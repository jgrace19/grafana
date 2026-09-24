# Spec: Emotion → StyleX — foundation + @grafana/ui leaf cohort

## Repo

- Remote: github.com/jgrace19/grafana (demo fork of grafana/grafana)
- Base branch: `main`; open one draft PR against `main`
- Package manager: yarn@4.11.0 (Corepack, bundled in `.yarn/releases/`). Node: `.nvmrc` (24.x)

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

| Component     | Path                                          |
| ------------- | --------------------------------------------- |
| Tag / TagList | `packages/grafana-ui/src/components/Tags/`    |
| Badge         | `packages/grafana-ui/src/components/Badge/`   |
| Divider       | `packages/grafana-ui/src/components/Divider/` |

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

## Appendix: approved conversion patterns (Phase 0 ADR)

This appendix records the Phase 0 decisions that every converted component must follow. It's the reference for
Phase 1 lanes and later cohorts.

### Toolchain

A single compile step, `scripts/stylex/transform.js`, runs `@stylexjs/babel-plugin` with syntax-only TypeScript and JSX
parsing, so each toolchain keeps its own TypeScript compiler and produces identical class names:

- **App webpack:** `enforce: 'pre'` loader in `scripts/webpack/webpack.common.js` (dev and prod), ahead of `esbuild-loader`.
- **Storybook:** the same loader in `packages/grafana-ui/.storybook/main.ts` and `packages/grafana-flamegraph/.storybook/main.ts`
  (flamegraph compiles `@grafana/ui` from source).
- **Jest:** `scripts/stylex/jest-transformer.js` wraps `ts-jest` (root `jest.config.js`) and `@swc/jest`
  (`packages/grafana-plugin-configs/jest/jest.config.js`, used by decoupled plugins that import `@grafana/ui` source).
- **Package build:** a rollup transform in `packages/grafana-ui/rollup.config.ts`, ahead of esbuild.

Styles use runtime injection instead of static CSS extraction. This keeps the published `@grafana/ui` package
self-contained and avoids backend template changes for a new CSS asset. The cost is Emotion-like runtime insertion;
static extraction is a follow-up once more of the tree is converted.

The injector is `packages/grafana-ui/src/themes/stylex/inject.ts`, not the stock `@stylexjs/stylex/lib/stylex-inject`.
The stock injector adds one `:not(#\#)` per priority level, which gives longhand rules ID-level specificity and would
silently break every `className` override consumers pass today. The Grafana injector keeps plain class specificity,
orders rules by priority inside one sheet, and places that sheet first in `<head>`, so Emotion classes (appended later)
still win at equal specificity.

### Theme tokens

`GrafanaTheme2` stays the source of truth. `getThemeCssVariables(theme)` in `themes/stylex/cssVariables.ts` emits
`--grafana-*` custom properties named after the theme path, for example `theme.colors.border.weak` becomes
`--grafana-colors-border-weak` and `theme.spacing(0.5)` becomes `--grafana-spacing-0-5`.

- `useThemeCssVariables(theme)` publishes them on `body`. It runs in the app `ThemeProvider`
  (`public/app/core/utils/ConfigProvider.tsx`) and in the Storybook `withTheme` decorator and docs container. The body
  class isn't used as the selector because it isn't always in sync with the React theme (for example in Storybook).
- `themes/stylex/tokens.stylex.ts` exposes them to StyleX through `stylex.defineVars` with literal `--grafana-*` keys, so
  `colors['--grafana-colors-border-weak']` compiles to `var(--grafana-colors-border-weak)`. `cssVariables.test.ts`
  fails if the two files drift. To add a token, add it to both.
- Don't use `stylex.defineConsts`. Its values are resolved by runtime injection side effects in the defining module, and
  `@grafana/ui` declares `sideEffects: false`, so production tree-shaking can drop them.
- To theme a subtree differently, spread `getThemeCssVariables(otherTheme)` as the wrapper's inline `style` (refer to the
  `Foundations/StyleX theme bridge` story).
- Code that renders `@grafana/ui` outside the Grafana app or Storybook must call `useThemeCssVariables`, which is exported
  from `@grafana/ui/internal` for now.

### Component conversion patterns

Convert each `getStyles` slot to a `stylex.create` key and keep DOM, props, refs, and a11y unchanged:

| Emotion today                                                                       | StyleX pattern                                                                                                                     |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `css({ color: theme.colors.text.secondary })`                                       | `color: colors['--grafana-colors-text-secondary']`                                                                                 |
| `theme.spacing(1)`                                                                  | `spacing['--grafana-spacing-1']`                                                                                                   |
| `getStyles(theme, flag)` boolean or enum variants                                   | Separate keys composed with `stylex.props(styles.base, flag && styles.variant)`                                                    |
| Runtime-only values (tag color from name, Badge `tinycolor` math, a `spacing` prop) | StyleX dynamic style functions: a static class plus an inline custom property, so consumer classes can still override the property |
| `cx(styles.wrapper, className)`                                                     | `mergeStylexProps(stylex.props(...), className, style)`; consumer `className` and `style` apply last                               |
| `'&:hover': { opacity: 0.85 }`                                                      | `opacity: { default: null, ':hover': 0.85 }`                                                                                       |
| Multi-value shorthands (`padding: '1px 4px'`, `border: '1px solid X'`)              | Longhands (`paddingBlock`/`paddingInline`, `borderWidth`/`borderStyle`/`borderColor`), enforced by `@stylexjs/valid-shorthands`    |
| Class-only props such as Skeleton `containerClassName`                              | `stylex.props(styles.container).className`                                                                                         |

### Tests and style proof

jsdom's `getComputedStyle` drops typed values written as `var(...)`. Use `getCascadedStyle` and `getResolvedStyle` from
`themes/stylex/testUtils.ts`, which read declarations from matching CSSOM rules and resolve `--grafana-*` variables
against `body`. Cohort tests must not import `@emotion/*`; to prove `className` overrides, append a plain `<style>`
element, which lands after the StyleX sheet exactly like Emotion's sheets. The real Emotion ordering is covered once in
`themes/stylex/StyleXThemeFixture.test.tsx`.
