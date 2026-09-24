---
title: StyleX migration implementer brief
---

# StyleX migration implementer brief

You own one slice from [.cursor/plans/stylex-slices.md](../../.cursor/plans/stylex-slices.md). Your job is to remove Emotion styling from that slice and land a single PR against `jgrace19/grafana`.

Before you begin, ensure you have the following:

- Read [docs/stylex-migration/rfc.md](./rfc.md) and [contribute/style-guides/stylex-migration.md](../../contribute/style-guides/stylex-migration.md).
- A git worktree or branch named for your slice id.
- Grafana dev stack or CI-equivalent commands to run lint, typecheck, and Jest for your paths.

## Scope

- **Edit only** the paths listed in your slice manifest entry (component directory, feature subdirectory, package, or plugin).
- **Do not edit:** token codegen output, `eslint.config.js`, ratchet baselines, visual baselines for other slices, or shared compat helpers unless the coordinator assigns a dedicated helper slice.
- If you need a new design token, list a **token request** in your PR description; do not edit generated token files yourself.

## Migration steps

1. Run `yarn stylex:gen-tokens` if your slice uses new theme fields (coordinator usually handles token batches).
2. Co-locate styles in `*.stylex.ts` next to the component. Use `grafanaTokens` / `cssVar` helpers from `@grafana/ui/unstable`.
3. Replace `useStyles2(getStyles)` with `stylex.props` and `mergeStylexClassName` where `className` is part of the public API.
4. Optional mechanical pass: `yarn stylex:codemod -- path/to/file.tsx` (placeholder until jscodeshift lands).
5. Remove `@emotion/*` imports from the slice. Non-styling `useTheme2()` is allowed (canvas, uPlot, etc.).

## Acceptance checklist

- `git diff --name-only` shows only owned paths (plus token requests filed separately).
- Zero `@emotion/*` imports and zero `useStyles2(` in the slice (except non-styling theme reads documented in the PR).
- `yarn eslint <owned paths>` and package typecheck pass.
- `yarn jest --no-watch <owned tests>` pass; snapshot updates are limited to class-name churn and reviewed.
- Covering Storybook stories or app pages exist; Playwright screenshot tests for those surfaces pass in light and dark.
- Public component props and exports unchanged; `className` merging still works per the layer recipe.

## Commands reference

```bash
yarn stylex:ratchet          # must not increase Emotion counts repo-wide
yarn eslint path/to/slice
yarn jest --no-watch path/to/slice.test.tsx
yarn e2e:playwright e2e-playwright/stylex-migration/
```

## PR

Target the fork: `gh pr create --repo jgrace19/grafana`. One slice per PR. Link the slice id and manifest row in the description.
