# RFC: StyleX frontend migration

## Summary

Migrate Grafana core frontend styling from Emotion to StyleX on a CSS-variable token layer derived from `createTheme()`. Public plugin APIs (`useStyles2`, `useTheme2`, `withTheme2`, `GrafanaTheme2`, exported `get*Styles`) remain supported; `@emotion/css` stays a shared runtime for external plugins.

## Cascade layers

From lowest to highest specificity within layered CSS:

1. `@layer reset` — browser normalization (existing global reset)
2. `@layer grafana-global` — static global styles (migrated from `GlobalStyles/`)
3. `@layer grafana-stylex` — compiled StyleX output from core

Emotion styles injected by plugins or callers remain **unlayered**, so `className` overrides from plugins continue to win over core StyleX styles when specificity is equal.

## Compatibility contract

- `GrafanaTheme2` objects passed to plugins contain **concrete values** (hex, px), not `var(--token)` references.
- StyleX components read design tokens via CSS variables at runtime; the JS theme object is unchanged for plugins.
- `@grafana/ui` ships one extracted StyleX CSS bundle; Grafana core loads it once. Plugins must not bundle duplicate StyleX CSS.

## Budgets

See [budgets.json](./budgets.json). CI fails when post-migration metrics exceed these thresholds vs the Phase 0 baseline.

## Rollout

Phases 0–4 establish tooling, tokens, patterns, and pilot components. Phases 5–7 migrate slices tracked in `.cursor/plans/stylex-slices.md`. Phase 8 enforces lint bans and stabilizes exports.

## Decision log

| Date | Decision |
| --- | --- |
| 2026-09-24 | Keep Emotion compat APIs indefinitely for plugins |
| 2026-09-24 | StyleX Jest uses runtime injection so existing `toHaveStyle` tests remain meaningful during transition |
