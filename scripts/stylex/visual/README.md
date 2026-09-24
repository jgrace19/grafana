# Visual parity harness (Emotion → StyleX)

Deterministic screenshots of Grafana app pages, every `@grafana/ui` Storybook story, and the interaction
states (hover, focus-visible, active, disabled, open) of interactive components, in light and dark, plus the
diff that decides whether a migration slice changed anything visible.

Every slice runs this same harness, against a baseline captured on `main` with it. The baseline images
and `manifest.json` live outside the repo, in the migration project store (`media/baseline/`).

## Layout

| Path                                                       | Purpose                                                                         |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `check.sh`                                                 | Slice entry point: capture this checkout, then diff it against the baseline     |
| `scripts/run-capture.sh`                                   | One capture run: fresh Grafana + static Storybook + `capture.mjs`               |
| `scripts/capture.mjs`                                      | Playwright capture (suites `app`, `storybook`, `states`) and manifest writer    |
| `scripts/diff.mjs`                                         | Baseline vs candidate diff (default migration mode, `--strict` for determinism) |
| `scripts/targets.mjs` / `scripts/states.mjs`               | App page targets and interaction-state recipes                                  |
| `scripts/start-grafana.sh` / `stop-grafana.sh` / `seed.sh` | Throwaway Grafana with a brand-new SQLite DB per run                            |
| `scripts/gen-dashboards.mjs`                               | Regenerates the provisioned dashboards from a fixed seed                        |
| `conf/`, `provisioning/`                                   | Deterministic Grafana config, datasources, dashboards, paused alert rules       |
| `storybook-excludes.json` / `storybook-overrides.json`     | Excluded stories (with reasons) and story masks                                 |

## Build the checkout under test

```bash
export PATH=$HOME/.nvm/versions/node/v24.11.0/bin:$PATH   # Node 24; Node 22 breaks plugin builds
yarn install --immutable
npx playwright install chromium                            # Playwright 1.56.1 → Chromium 141.0.7390.37
make build-backend                                         # -> bin/grafana
export NODE_ENV=production NODE_OPTIONS=--max-old-space-size=16384
yarn nx run grafana:themes-generate
yarn nx run-many -t build --projects=tag:scope:plugin
yarn webpack --config scripts/webpack/webpack.prod.js     # production bundle, same code path as main
unset NODE_ENV NODE_OPTIONS
yarn storybook:build                                       # -> packages/grafana-ui/dist/storybook
```

A running Grafana caches the asset manifest: restart it after rebuilding the frontend.

## Match the baseline environment (never relax the check)

`diff.mjs` fails on any environment mismatch, so fix the machine rather than the check. The baseline's
fingerprint is in `manifest.json > environment`: Playwright 1.56.1, Chromium 141.0.7390.37, Node v24.11.0,
Ubuntu 24.04.4 (linux 6.12.94+ x64), `fontsSha256` `c06afa0c80fbb20c6ec8c521ef2797901104c56a5882b6c72bad7018c99d0362`
(373 fonts), plus a `harnessSha256` of these scripts.

On the cloud-agent VM image, the only step needed was `npx playwright install chromium`, which downloads the pinned
Chromium into `~/.cache/ms-playwright`; the OS and fonts already matched. To check a machine before a
15-minute run:

```bash
npx playwright --version                                            # Version 1.56.1
fc-list --format '%{file}|%{family}|%{style}\n' | sort | node -e \
  "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>console.log(require('crypto').createHash('sha256').update(d.trim()).digest('hex')))"
```

On another image, install the missing font packages until the hash matches. Don't edit these scripts
locally either: a changed `harnessSha256` shows up in the manifest.

## Decisions already made

- Server timestamps are rewritten to fixed values instead of masked; this satisfies the "no masks on styled
  chrome" rule.
- App pages boot at a fixed clock and freeze it right before the first screenshot; this satisfies the
  frozen-clock rule.
- The only mask (the Combobox suffix icon in the contact-point / routing-tree selector stories) covers a
  pre-existing `main` bug: react-inlinesvg sometimes keeps the spinner SVG. Don't fix it as part of the
  migration.
- The copy in the migration project store (`internal/visual-baseline/`) is the reference; keep this directory
  identical to it.

## Run a slice check

```bash
scripts/stylex/visual/check.sh U2-inputs                   # full manifest, both themes
STYLEX_DIFF_ONLY='^storybook' scripts/stylex/visual/check.sh U2-inputs --suites storybook,states
```

`check.sh` runs **both** diffs. Each writes `summary.md`, `summary.json`, and a `.diff.png` for every entry with a
non-zero pixel count, passing or not: default mode to the store's `media/visual-diff/<slice-id>/`, strict mode to
`media/visual-diff/<slice-id>/strict/`.

**Rule for every slice (coordinator decision):**

1. **Default mode is the pass/fail bar.** pixelmatch `threshold: 0.1`, `includeAA: false`; identical dimensions;
   at most 0.1% of an image's pixels differ. `check.sh` exits non-zero if it fails.
2. **A strict run is mandatory.** pixelmatch `threshold: 0`, `includeAA: true`. Every entry with a non-zero
   strict pixel count must be **fixed**, or **justified in the PR** with its diff image attached. The 0.1
   threshold hides small colour shifts over large areas (Phase 0's only regression scored 0 px in default mode).
3. Attach every non-zero diff image from either mode to the PR.

Missing entries, capture errors, changed mask lists and environment mismatches (Playwright, Chromium, OS,
fonts, viewport, DPR) fail both modes. Strict mode is also the run-vs-run determinism check on one commit.

Adding or widening a mask, excluding a story, or re-baselining needs coordinator approval. Re-baseline only
from a newer `main` merge-base, never from a migration branch.
