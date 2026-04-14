# Tech Debt Report

> **Date:** 2026-04-14
> **Scope:** `all`
> **Commit:** `2298df8aff`
> **Previous report:** 2026-04-13

## Summary

| ID | Check | Count | Delta | Severity |
|---|---|---|---|---|
| FE-01 | Class components | 61 | unchanged | Medium |
| FE-02 | `connect()` HOC | 45 | +4 | Medium |
| FE-03 | Default exports (approx) | 461 | n/a | Low |
| FE-04 | SASS files | 0 | n/a | n/a |
| FE-05 | `stylesFactory` usage | 16 | unchanged | Medium |
| FE-06 | Unsafe lifecycle methods | 1 | unchanged | High |
| FE-07 | Enzyme/shallow tests | 1 | n/a | High |
| FE-08 | Arrow component defs (approx) | 1680 | n/a | Low |
| BE-01 | Large API handlers | 30 | n/a | High |
| BE-02 | Missing service interfaces | 6 | n/a | Medium |
| BE-03 | Services without tests | 31 | n/a | Medium |
| CC-01 | TODO/FIXME/HACK comments | 1496 | +68 | Low |
| CC-02 | Large files | 536 | n/a | Low |

## Detailed Findings

### FE-01: Class components

**Count:** 61
**Delta:** unchanged

Class components should be migrated to function components with hooks. Error boundaries (`componentDidCatch`) are the main exception.

**Examples:**
- `public/app/AppWrapper.tsx`
- `public/app/core/components/GraphNG/GraphNG.tsx`
- `public/app/core/components/OptionsUI/multiSelect.tsx`
- `public/app/core/components/OptionsUI/select.tsx`
- `public/app/core/components/SharedPreferences/SharedPreferencesOld.tsx`

**Action:** Use the `migrate-class-components` skill.

---

### FE-02: `connect()` HOC

**Count:** 45
**Delta:** +4

Replace Redux `connect()` usage with `useSelector` and `useDispatch` where possible.

**Note:** Filtered to files importing `react-redux` to avoid unrelated `connect()` calls.

**Examples:**
- `public/app/features/admin/UpgradePage.tsx`
- `public/app/features/admin/UserAdminPage.tsx`
- `public/app/features/admin/UserListAdminPage.tsx`
- `public/app/features/admin/UserListAnonymousPage.tsx`
- `public/app/features/auth-config/AuthDrawer.tsx`

**Action:** Use the `migrate-class-components` skill and replace HOCs with hooks.

---

### FE-03: Default exports (approx)

**Count:** 461 (approximate)
**Delta:** n/a

Project convention prefers named exports. This count is approximate because some default exports are intentional, especially route boundaries and compatibility shims.

**Note:** Approximate; may include intentional default exports.

**Examples:**
- `public/app/app.ts`
- `public/app/core/TableModel.ts`
- `public/app/core/config.ts`
- `public/app/core/time_series2.ts`
- `public/app/types/images.d.ts`

---

### FE-04: SASS files

**Count:** 0
**Delta:** n/a

New and modified frontend code should use Emotion `useStyles2`. A zero count is a positive signal for `public/app`.

**Examples:**
- None

---

### FE-05: `stylesFactory` usage

**Count:** 16
**Delta:** unchanged

`stylesFactory` is the deprecated styling helper. Replace with `useStyles2(getStyles)`.

**Examples:**
- `public/app/features/inspector/styles.ts`
- `public/app/features/dashboard/components/PanelEditor/PanelEditor.tsx`
- `public/app/features/dashboard/components/SubMenu/SubMenu.tsx`
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/SpanBarRow.tsx`
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/SpanDetailRow.tsx`

---

### FE-06: Unsafe lifecycle methods

**Count:** 1
**Delta:** unchanged

`componentWillReceiveProps`, `componentWillMount`, and `componentWillUpdate` are deprecated and incompatible with strict-mode expectations.

**Examples:**
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`

**Action:** Highest-priority frontend migration target. Convert to hooks or derived state.

---

### FE-07: Enzyme/shallow tests

**Count:** 1
**Delta:** n/a

Tests using Enzyme patterns should migrate to `@testing-library/react` render-based assertions.

**Examples:**
- `public/app/features/dashboard/containers/SoloPanelPage.test.tsx`

**Action:** Migrate the remaining file to RTL with `render()`-based assertions.

---

### FE-08: Arrow component defs (approx)

**Count:** 1680 (approximate)
**Delta:** n/a

Convention prefers `function Foo()` declarations for React components. This heuristic still overcounts some non-component arrow functions.

**Note:** Approximate; limited to non-test `.tsx` files and still includes some non-component arrow functions.

**Examples:**
- `public/app/AppWrapper.tsx`
- `public/app/api/clients/folder/v1beta1/test-utils.tsx`
- `public/app/core/components/CardButton.tsx`
- `public/app/core/context/ModalsContextProvider.tsx`
- `public/app/core/navigation/GrafanaRouteError.tsx`

---

### BE-01: Large API handlers

**Count:** 30
**Delta:** n/a

API handlers in `pkg/api/` exceeding roughly 50 lines are good candidates for extracting business logic into `pkg/services/`.

**Note:** Counted files with at least one `func (hs *HTTPServer)` handler over ~50 lines.

**Examples:**
- `pkg/api/accesscontrol.go (589 lines)`
- `pkg/api/api.go (550 lines)`
- `pkg/api/frontendsettings.go (325 lines)`
- `pkg/api/datasources.go (215 lines)`
- `pkg/api/index.go (177 lines)`

---

### BE-02: Missing service interfaces

**Count:** 6
**Delta:** n/a

Grafana service packages usually define interfaces in the same package to keep Wire-friendly boundaries explicit. This is a spot-check heuristic on immediate `pkg/services/*` roots.

**Note:** Spot-check limited to immediate `pkg/services/*` package roots.

**Examples:**
- `pkg/services/contexthandler`
- `pkg/services/datasourceproxy`
- `pkg/services/frontend`
- `pkg/services/hooks`
- `pkg/services/pluginsintegration`

---

### BE-03: Services without tests

**Count:** 31
**Delta:** n/a

Top-level service packages without root-level tests are good candidates for baseline coverage, even if nested packages already have tests.

**Note:** Counted immediate `pkg/services/*` roots without root-level `*_test.go` files.

**Examples:**
- `pkg/services/annotations`
- `pkg/services/anonymous`
- `pkg/services/apikey`
- `pkg/services/auth`
- `pkg/services/authapi`

---

### CC-01: TODO/FIXME/HACK comments

**Count:** 1496
**Delta:** +68

Known shortcuts or unfinished work flagged by authors. This count is scoped to `public/app/` and `pkg/` only.

**Breakdown:**
- TODO: 1170
- FIXME: 144
- HACK: 24
- XXX: 158
- Frontend subtotal: 602
- Backend subtotal: 894

**Examples:**
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx (36)`
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx (27)`
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx (27)`
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts (18)`
- `pkg/storage/secret/metadata/query.go (17)`

---

### CC-02: Large files

**Count:** 536
**Delta:** n/a

Frontend files over ~500 lines and backend Go files over ~800 lines are candidates for splitting. This scan includes test files when they cross the threshold.

**Note:** Includes test files when they cross the size threshold; generated files with non-standard names may still appear and need manual review.

**Top offenders:**
- `pkg/services/ngalert/state/manager_private_test.go (5689 lines)`
- `pkg/tests/api/alerting/api_ruler_test.go (5187 lines)`
- `public/app/features/alerting/unified/mockGrafanaNotifiers.ts (3675 lines)`
- `pkg/services/ngalert/api/api_prometheus_test.go (3604 lines)`
- `pkg/services/ngalert/store/alert_rule_test.go (3428 lines)`
- `pkg/storage/unified/resource/datastore_test.go (3394 lines)`
- `pkg/storage/unified/resource/storage_backend_test.go (3104 lines)`
- `pkg/services/authz/rbac/service_test.go (3003 lines)`
- `public/app/features/dashboard-scene/scene/DashboardScene.test.tsx (2989 lines)`
- `public/app/features/dashboard-scene/pages/DashboardScenePageStateManager.test.ts (2865 lines)`

---

## Recommended Actions

1. Use the `migrate-class-components` skill on `public/app/features/dashboard/` first; it still contains 10 class components and 9 Redux `connect()` call sites.
2. Batch-modernize `public/app/features/explore/TraceView/` to remove the only unsafe lifecycle method and 7 of the remaining `stylesFactory` usages.
3. Extract long `pkg/api/` handlers into service-layer helpers, starting with `pkg/api/accesscontrol.go`, `pkg/api/api.go`, and `pkg/api/frontendsettings.go`.
4. Backfill `pkg/services/*` package-root interfaces/tests, beginning with `pkg/services/contexthandler`, `pkg/services/datasourceproxy`, `pkg/services/frontend`, `pkg/services/annotations`, and `pkg/services/anonymous`.
5. Treat default-export cleanup and named function component declarations as opportunistic modernization work when touching files in `public/app/`; the scan found 461 default exports and 1680 heuristic arrow-style component definitions.

## Manual Notes

<!-- Add any manual observations or context below this line. This section is
preserved across report updates. -->
