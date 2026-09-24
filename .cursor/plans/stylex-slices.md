# StyleX migration slice manifest

Coordinator-maintained manifest for Phases 5–7. See [docs/stylex-migration/rfc.md](../../docs/stylex-migration/rfc.md) and [docs/stylex-migration/implementer-brief.md](../../docs/stylex-migration/implementer-brief.md).

**Last updated:** 2026-09-24 (branch `cursor/stylex-migration-ac1d`)

## Status summary

| Phase | Area | Slices (est.) | Done | In progress | Pending |
| --- | --- | ---: | ---: | ---: | ---: |
| 5 | `@grafana/ui` components | 40 | 12 | 8 | 20 |
| 5 | `@grafana/ui` GlobalStyles → static CSS | 1 | 0 | 0 | 1 |
| 6 | Workspace packages | 6 | 3 | 1 | 2 |
| 7 | `public/app/core` | 6 | 5 | 1 | 0 |
| 7 | `public/app/features` | 45 | 18 | 6 | 21 |
| 7 | Built-in plugins | 25 | 22 | 2 | 1 |
| — | Shared compat / helpers | 2 | 1 | 0 | 1 |

**Legend:** **done** = no Emotion styling imports in owned paths; **in progress** = partial `.stylex.ts` coverage or mixed Emotion; **pending** = not started.

**Repo signals (automated counts, same date):**

| Path | `.stylex.ts` files | Files still importing `@emotion/*` (excl. compat / GlobalStyles / ThemeContext) |
| --- | ---: | ---: |
| `packages/grafana-ui/src/components` | 103 | 160 |
| `packages/grafana-alerting` | 1 | 0 |
| `packages/grafana-flamegraph` | 12 | 1 |
| `packages/grafana-prometheus` | 27 | 0 |
| `packages/grafana-sql` | 1 | 0 |
| `public/app/core` | 87 | 2 |
| `public/app/features/alerting` | 32 | 0 |
| `public/app/features/dashboard-scene` | 157 | 0 |
| `public/app/features/explore` | 29 | 1 |
| `public/app/features/dashboard` | 14 | 0 |
| `public/app/features/logs` | 6 | 4 |
| `public/app/plugins` | 171 | 0 |

## Files no slice may touch

- Generated tokens under `packages/grafana-ui/src/themes/stylex/`
- `eslint.config.js`, `docs/stylex-migration/emotion-ratchet-baseline.json`, visual baselines owned by other slices
- `packages/grafana-ui/src/themes/compat/**` (coordinator-only compat exports)
- `/opt/cursor/artifacts/plans/` (Cursor run plans)

## Slice entries

### Phase 5 — `@grafana/ui`

| ID | Status | Owned paths | Dependencies | Covering stories / pages | PR |
| --- | --- | --- | --- | --- | --- |
| UI-001-card | done | `packages/grafana-ui/src/components/Card/**` | compat `getCardStyles` | Card stories | — |
| UI-002-layout | in progress | `packages/grafana-ui/src/components/Layout/**` | spacing tokens | Box / Stack / Grid stories | — |
| UI-003-forms | in progress | `packages/grafana-ui/src/components/Forms/**` | focus / input tokens | Form stories | — |
| UI-004-overlays | pending | `Modal`, `Drawer`, `Tooltip`, `Menu` dirs | z-index tokens | Overlay stories | — |
| UI-005-select | pending | `packages/grafana-ui/src/components/Select/**` | global CSS for react-select | Select stories | — |
| UI-006-table | pending | `packages/grafana-ui/src/components/Table/**` | cell style lint rules | Table / TableNG stories | — |
| UI-007-global-styles | pending | `packages/grafana-ui/src/themes/GlobalStyles/**` | token codegen, layer order | Storybook full run | — |
| UI-008-dataviz | in progress | `DateTimePickers`, `VizTooltip`, `VizLayout`, `uPlot` | — | Matching stories | — |

### Phase 6 — workspace packages

| ID | Status | Owned paths | Dependencies | Covering stories / pages | PR |
| --- | --- | --- | --- | --- | --- |
| PKG-001-prometheus | done | `packages/grafana-prometheus/**` | — | Prometheus config UI | — |
| PKG-002-flamegraph | in progress | `packages/grafana-flamegraph/**` | nested theme scope | Flamegraph stories | — |
| PKG-003-sql | in progress | `packages/grafana-sql/**` | — | SQL query editor | — |
| PKG-004-alerting-pkg | done | `packages/grafana-alerting/**` | — | Alerting package stories | — |
| PKG-005-o11y-ds | pending | `packages/grafana-o11y-ds-frontend/**` | — | DS frontend flows | — |
| PKG-006-plugin-configs | pending | `packages/grafana-plugin-configs/**` | webpack StyleX plugin | plugin build CI | — |

### Phase 7 — `public/app`

| ID | Status | Owned paths | Dependencies | Covering stories / pages | PR |
| --- | --- | --- | --- | --- | --- |
| APP-CORE-001 | in progress | `public/app/core/**` (remaining Emotion) | UI layout primitives | Login, nav, preferences | — |
| APP-FEAT-001-alerting | done | `public/app/features/alerting/**` | `@grafana/alerting` package | Alerting e2e / stories | — |
| APP-FEAT-002-dashboard-scene | done | `public/app/features/dashboard-scene/**` | UI overlays | Dashboard e2e | — |
| APP-FEAT-003-explore | in progress | `public/app/features/explore/**` | TraceView nested selectors | Explore e2e | — |
| APP-FEAT-004-logs | in progress | `public/app/features/logs/**` | — | Logs panel e2e | — |
| APP-FEAT-005-tail | pending | remaining `public/app/features/*` long tail | per-subdir | area pages | — |
| APP-PLUG-001-panels | done | `public/app/plugins/panel/**` | `@grafana/ui` | panel e2e | — |
| APP-PLUG-002-datasources | in progress | workspace datasource plugins | plugin-configs StyleX | datasource e2e | — |

### Phase 8 — lock-in (coordinator)

| ID | Status | Owned paths | Notes |
| --- | --- | --- | --- |
| LOCK-001-eslint | done | `eslint.config.js` | `@emotion/*` ban + `@stylexjs/eslint-plugin` |
| LOCK-002-codemod | in progress | `scripts/stylex-migration/codemod.mjs` | placeholder CLI wired as `yarn stylex:codemod` |
| LOCK-003-plugin-compat-e2e | done | `e2e-playwright/test-plugins/grafana-usestyles2-compat-panel/**` | external `useStyles2` fixture |

## Token requests (batch queue)

| Slice | Request | State |
| --- | --- | --- |
| — | (empty) | — |
