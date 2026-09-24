# Visual parity harness (Emotion → StyleX)

Deterministic screenshots of Grafana app pages, every `@grafana/ui` Storybook story, and the interaction
states (hover, focus-visible, active, disabled, open) of interactive components, in light and dark, plus the
diff that decides whether a migration slice changed anything visible.

Every slice runs this same harness, against a baseline captured on `main` with it. The baseline images
and `manifest.json` live outside the repo, in the migration project store (`media/baseline/`).

## Layout

| Path | Purpose |
|---|---|
| `check.sh` | Slice entry point: capture this checkout, then diff it against the baseline |
| `scripts/run-capture.sh` | One capture run: fresh Grafana + static Storybook + `capture.mjs` |
| `scripts/capture.mjs` | Playwright capture (suites `app`, `storybook`, `states`) and manifest writer |
| `scripts/diff.mjs` | Baseline vs candidate diff (default migration mode, `--strict` for determinism) |
| `scripts/targets.mjs` / `scripts/states.mjs` | App page targets and interaction-state recipes |
| `scripts/start-grafana.sh` / `stop-grafana.sh` / `seed.sh` | Throwaway Grafana with a brand-new SQLite DB per run |
| `scripts/gen-dashboards.mjs` | Regenerates the provisioned dashboards from a fixed seed |
| `conf/`, `provisioning/` | Deterministic Grafana config, datasources, dashboards, paused alert rules |
| `storybook-excludes.json` / `storybook-overrides.json` | Excluded stories (with reasons) and story masks |

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

## Run a slice check

```bash
scripts/stylex/visual/check.sh U2-inputs                   # full manifest, both themes
STYLEX_DIFF_ONLY='^storybook' scripts/stylex/visual/check.sh U2-inputs --suites storybook,states
```

The report (`summary.md`, `summary.json`, and a `.diff.png` for **every** entry with a non-zero pixel count,
passing or not) goes to the store's `media/visual-diff/<slice-id>/`. Attach every diff image to the PR.

**Pass rule (default mode):** pixelmatch `threshold: 0.1`, `includeAA: false`; identical dimensions; at most
0.1% of an image's pixels differ. Missing entries, capture errors, changed mask lists and environment
mismatches (Playwright, Chromium, OS, fonts, viewport, DPR) always fail. `--strict` (`threshold: 0`,
`includeAA: true`, 0 px) is for run-vs-run determinism checks on the same commit.

Adding or widening a mask, excluding a story, or re-baselining needs coordinator approval. Re-baseline only
from a newer `main` merge-base, never from a migration branch.
