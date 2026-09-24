---
name: emotion-to-stylex
description: Use when migrating a bounded Grafana Emotion cohort to StyleX on jgrace19/grafana (main), including StyleX webpack/esbuild foundation and grafana-ui Tags/Badge/Divider. Enforces per-batch verification. Do not use for general frontend work or full-repo rewrites.
---

# Emotion → StyleX (Grafana)

## Scope discipline
Only touch paths named by the parent prompt / `docs/agent-specs/emotion-to-stylex-grafana-ui.md`.
Refuse to widen to Button/Box/Stack/Select, GlobalStyles, or features/* without a spec update.
Never modify `.cursor/hooks.json`.

## Phase order
1. If StyleX cannot compile in this checkout, complete **Phase 0 (foundation)** first — deps, webpack/esbuild + Storybook wiring, theme→CSS var / `createTheme` bridge, smoke render light+dark.
2. Only then convert cohort directories one at a time: Tags → Badge → Divider (or parallel workers with hard path allowlists after foundation merges).

## Conversion playbook
1. Inventory Emotion imports and `getStyles` / `useStyles2` / `useTheme2` call sites in the assigned paths.
2. Convert style factories (`css({...})` slots) to StyleX; map tokens through the Phase 0 bridge.
3. Handle dynamic styles (e.g. Tag `getTagColorsFromName`) via CSS variables or a documented runtime escape — do not freeze one theme’s colors.
4. Update tests that assert on Emotion className internals; prefer role/behavior assertions; **add** computed-style or screenshot proof (existing tests will stay green even if CSS is wrong).
5. Remove dead Emotion imports only after typecheck + jest for that path are green.

## Mandatory verify gate (the loop)
After every batch (one component directory, or one foundation PR unit):

```bash
# residual Emotion in assigned paths
rg -n "@emotion/css|@emotion/react" <paths>

# unit — NEVER plain `yarn test` (watch)
yarn jest --no-watch <path>

# types + lint on slice
yarn workspace @grafana/ui typecheck
yarn eslint --cache <paths>
```

On any non-zero exit: fix in place and re-run the gate. Do not start the next component red.
Append command, exit code, and last ~40 log lines to `docs/agent-runs/emotion-to-stylex/VERIFY.md`
(`scripts/stylex/verify-gate.sh "<batch label>" <paths...>` runs all four gates and appends the entry).

For foundation batches, also prove a StyleX class renders under light and dark (Storybook or fixture) and attach screenshots/artifacts.

## Completion

Claim done only when the spec DoD checklist is fully satisfied and VERIFY.md is complete.
Then refresh the draft PR and keep CI subscriptions green.
