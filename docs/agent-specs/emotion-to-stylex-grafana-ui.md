# Spec: Emotion → StyleX — foundation + @grafana/ui leaf cohort

## Repo
- Remotes: github.com/internalsphere/grafana (upstream identity grafana/grafana)
- Base branch: `seed`
- Package manager: yarn@4.17.1 (Corepack). Node: `.nvmrc` (24.x)
- Do not use grafana-migration-probe (empty internalsphere shell)

## Problem
Grafana FE styles almost entirely via Emotion (`@emotion/css` `css`/`cx` + `useStyles2` / `useTheme2` against runtime `GrafanaTheme2`). ~1.3k files import `@emotion/*`. StyleX is **not present**. App webpack uses `esbuild-loader` (no Babel StyleX plugin). Theme tokens are a JS object, not CSS variables.

A credible migration is therefore two phases: (1) StyleX compiler + theme token bridge, (2) convert a bounded leaf cohort and prove it.

## Phase 0 — Foundation (serial, one agent, no parallel lanes)
Must land before any component migration is “done”:

1. Add StyleX dependencies (`@stylexjs/*` as required by the chosen webpack/esbuild integration).
2. Wire StyleX into app webpack (`scripts/webpack/rules.ts`, `webpack.common.ts`) and into `@grafana/ui` Storybook webpack if ui stories are in scope.
3. Emit `GrafanaTheme2` as StyleX-usable tokens (CSS variables on `body.theme-dark` / `body.theme-light` and/or `stylex.createTheme` for dark/light + visual-refresh). Preserve behavior of `ThemeProvider` in `public/app/core/utils/ConfigProvider.tsx`.
4. Document the approved conversion patterns in this spec’s appendix (or a linked ADR): static StyleX atoms vs runtime-dynamic escapes.
5. ESLint: allow StyleX in converted files; do not remove `@emotion/syntax-preference` for unconverted code. Do **not** edit `.cursor/hooks.json`.

Foundation DoD:
- A smoke Storybook or minimal fixture can apply a StyleX class and render under light + dark.
- `yarn workspace @grafana/ui typecheck` still exits 0.
- No component cohort claimed done until Phase 0 is green.

## Phase 1 — Cohort (parallelizable after Phase 0)
### In scope
| Component | Path |
|---|---|
| Tag / TagList | `packages/grafana-ui/src/components/Tags/` |
| Badge | `packages/grafana-ui/src/components/Badge/` |
| Divider | `packages/grafana-ui/src/components/Divider/` |

Include colocated `*.test.tsx`, `*.story.tsx`, and mdx only as needed for the cohort.

### Explicitly out of scope
- `Button`, `Box`, `Stack`, `Select` (high fan-in)
- `public/app/features/**` (alerting, dashboard-scene, explore, …)
- `GlobalStyles` / `@emotion/react` `<Global />` (second session)
- Visual redesign, token renaming, drive-by refactors
- Editing `.cursor/hooks.json` or the `gh` internalsphere enforcer

### Source patterns (canonical today)
Documented in `contribute/style-guides/styling.md` and `themes.md`:
- `import { css, cx } from '@emotion/css'`
- `const styles = useStyles2(getStyles, ...args)` with `getStyles(theme, ...)` returning `{ slot: css({...}) }`
- `useTheme2()` when theme is read without generating classes
- Divider is the smallest canonical example; Badge uses `useStyles2(getStyles, color)`; Tag colors via `getTagColorsFromName` (dynamic — forces token/dynamic design)

### Conversion standards
- No new `@emotion/*` imports in converted files
- Public React APIs, a11y, and DOM structure unchanged unless StyleX forces a single documented wrapper
- Prefer StyleX `create` + `props` / class composition over leaving dual Emotion+StyleX for the same slot
- Runtime-dynamic values (e.g. tag colors from name): isolate with CSS vars or documented escape; never silently hardcode one theme

## Definition of Done (machine-checkable)
A lane or the cohort is DONE only when ALL are true:

1. `rg -n "@emotion/css|@emotion/react" <lane-paths>` → no matches in `.ts`/`.tsx`
2. `yarn jest --no-watch <each lane path>` exits 0
   (never use default `yarn test` — it is watch mode)
3. `yarn workspace @grafana/ui typecheck` exits 0
4. `yarn eslint --cache <lane-paths>` exits 0
5. **Style proof added** (repo has no visual-regression CI): at least one of
   - new `getComputedStyle` / computed-token assertions in unit tests, or
   - light + dark Storybook screenshots attached as Cloud Agent artifacts for each component
   Optionally extend `e2e-playwright/storybook/verify.spec.ts` beyond Button smoke.
6. `docs/agent-runs/emotion-to-stylex/VERIFY.md` contains command + exit code + last ~40 log lines for each gate above
7. Draft PR open; CI subscription green for the agent’s PR (not “ready for human QA”)

## Operating model
- Do not pause for mid-loop human review
- After every conversion batch (≤ one component dir): run the lane verify gate; stay red-fixing before the next lane
- Open/update draft PR as soon as Phase 0 or first lane is green; subscribe to checks; autofix
- Done means DoD, not a narrative summary
