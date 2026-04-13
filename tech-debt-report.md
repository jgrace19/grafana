# Tech Debt Report

> **Date:** 2026-04-13
> **Scope:** `all`
> **Commit:** `2298df8aff`
> **Previous report:** 2026-04-13

## Summary

| ID | Check | Count | Delta | Severity |
|---|---|---|---|---|
| FE-01 | Class components | 60 | -1 | Medium |
| FE-02 | `connect()` HOC | 44 | +3 | Medium |
| FE-03 | Default exports (approx) | 498 | n/a | Low |
| FE-04 | SASS files | 0 | n/a | n/a |
| FE-05 | `stylesFactory` usage | 16 | unchanged | Medium |
| FE-06 | Unsafe lifecycle methods | 1 | unchanged | High |
| FE-07 | Enzyme/shallow tests | 22 | n/a | High |
| FE-08 | Arrow component defs (approx) | 1938 | n/a | Low |
| BE-01 | Large API handlers | 10 | n/a | High |
| BE-02 | Missing service interfaces | 6 | n/a | Medium |
| BE-03 | Services without tests | 31 | n/a | Medium |
| CC-01 | TODO/FIXME/HACK comments | 1412 | -16 | Low |
| CC-02 | Large files | 549 | n/a | Low |

This report uses the check-based `tech-debt-audit` skill. Several deltas are marked `n/a` because the prior report was hotspot-oriented and did not record directly comparable per-check baselines. For FE-02, this scan intentionally counts only `react-redux` `connect()` HOC usage to avoid false positives from unrelated APIs.

## Detailed Findings

### FE-01: Class components

**Count:** 60
**Delta:** -1

Class components should be migrated to function components with hooks. Error boundaries (`componentDidCatch`) are the main exception.

**Examples:**
- `public/app/AppWrapper.tsx`
- `public/app/core/components/GraphNG/GraphNG.tsx`
- `public/app/core/components/OptionsUI/multiSelect.tsx`
- `public/app/core/components/OptionsUI/select.tsx`
- `public/app/core/components/SharedPreferences/SharedPreferencesOld.tsx`

**Action:** Use the `migrate-class-components` skill. Existing hotspot tickets already cover dashboard and plugin datasource areas.

---

### FE-02: `connect()` HOC

**Count:** 44
**Delta:** +3

Replace `connect()` with `useSelector` and `useDispatch` hooks. This scan counts files that import from `react-redux` and call `connect()`.

**Examples:**
- `public/app/features/admin/UpgradePage.tsx`
- `public/app/features/admin/UserAdminPage.tsx`
- `public/app/features/admin/UserListAdminPage.tsx`
- `public/app/features/admin/UserListAnonymousPage.tsx`
- `public/app/features/admin/ldap/LdapSettingsPage.tsx`

**Action:** Use the `migrate-class-components` skill when modernizing the remaining Redux-connected pages.

---

### FE-03: Default exports

**Count:** 498 (approximate)
**Delta:** n/a

Project convention is named declaration exports. Count is approximate because some default exports are intentional, including route and lazy-load boundaries.

**Examples:**
- `public/app/app.ts`
- `public/app/core/TableModel.ts`
- `public/app/core/components/AppNotifications/AppNotificationItem.tsx`
- `public/app/core/components/EmptyListCTA/EmptyListCTA.tsx`
- `public/app/core/components/ForgottenPassword/ChangePasswordPage.tsx`

---

### FE-04: SASS files

**Count:** 0
**Delta:** n/a

No `.scss` or `.sass` files were found under `public/app/`. This is a positive signal for the Emotion `useStyles2` migration.

**Examples:**
- None

---

### FE-05: `stylesFactory` usage

**Count:** 16
**Delta:** unchanged

`stylesFactory` is the deprecated styling helper. Replace with `useStyles2(getStyles)`.

**Examples:**
- `public/app/features/dashboard/components/PanelEditor/PanelEditor.tsx`
- `public/app/features/dashboard/components/SubMenu/SubMenu.tsx`
- `public/app/features/explore/TraceView/components/TracePageHeader/SpanGraph/ViewingLayer.tsx`
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/SpanBarRow.tsx`
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/SpanDetailRow.tsx`

---

### FE-06: Unsafe lifecycle methods

**Count:** 1
**Delta:** unchanged

`componentWillReceiveProps`, `componentWillMount`, and `componentWillUpdate` are removed in React strict mode and must be migrated.

**Examples:**
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`

**Action:** Highest-priority frontend modernization target. Existing TraceView work already covers this file.

---

### FE-07: Enzyme/shallow tests

**Count:** 22
**Delta:** n/a

Tests using `shallow()` or `mount()` should migrate to `@testing-library/react` and behavior-first assertions.

**Examples:**
- `public/app/plugins/panel/geomap/GeomapPanel.test.tsx`
- `public/app/plugins/datasource/loki/components/LokiContextUi.test.tsx`
- `public/app/core/components/AppNotifications/AppNotificationList.test.tsx`
- `public/app/core/components/FormPrompt/Prompt.test.tsx`
- `public/app/core/components/AppChrome/ExtensionSidebar/ExtensionSidebarProvider.test.tsx`

**Action:** Focus first on `public/app/core/components`, `public/app/features/dashboard/containers`, and `public/app/features/dashboard-scene/`, which account for the densest clusters.

---

### FE-08: Arrow component definitions

**Count:** 1938 (approximate)
**Delta:** n/a

Convention prefers `function Foo()` declarations for React components. Count is approximate and includes non-component arrow functions.

**Examples:**
- `public/app/AppWrapper.tsx`
- `public/app/api/clients/folder/v1beta1/test-utils.tsx`
- `public/app/core/components/AccessControl/AddPermission.tsx`
- `public/app/core/components/AccessControl/PermissionList.tsx`
- `public/app/core/components/AccessControl/PermissionListItem.tsx`

---

### BE-01: Large API handlers

**Count:** 10
**Delta:** n/a

API handlers in `pkg/api/` exceeding roughly 50 lines are candidates for extraction. The largest offenders include route registration and request assembly logic that likely belongs in lower layers.

**Examples:**
- `pkg/api/accesscontrol.go (declareFixedRoles, ~586 lines)`
- `pkg/api/api.go (registerRoutes, ~549 lines)`
- `pkg/api/frontendsettings.go (getFrontendSettings, ~324 lines)`
- `pkg/api/index.go (setIndexViewData, ~176 lines)`
- `pkg/api/render.go (RenderHandler, ~106 lines)`

**Action:** Prioritize `declareFixedRoles`, `registerRoutes`, and `getFrontendSettings`, where the line counts are large enough to justify focused extraction work.

---

### BE-02: Missing service interfaces

**Count:** 6
**Delta:** n/a

This spot-check looks at direct child packages under `pkg/services/` and flags packages without interface declarations in their top-level `.go` files. These are candidates for clearer DI boundaries and easier mocking.

**Examples:**
- `pkg/services/contexthandler`
- `pkg/services/datasourceproxy`
- `pkg/services/frontend`
- `pkg/services/hooks`
- `pkg/services/pluginsintegration`

Additional package:
- `pkg/services/scimutil`

---

### BE-03: Services without tests

**Count:** 31
**Delta:** n/a

This spot-check looks at direct child packages under `pkg/services/` and flags packages without top-level `*_test.go` files.

**Examples:**
- `pkg/services/annotations`
- `pkg/services/anonymous`
- `pkg/services/apikey`
- `pkg/services/auth`
- `pkg/services/authapi`

Additional packages include `pkg/services/authz`, `pkg/services/org`, `pkg/services/publicdashboards`, `pkg/services/supportbundles`, and 22 more.

---

### CC-01: TODO/FIXME/HACK comments

**Count:** 1412
**Delta:** -16

Known shortcuts or unfinished work flagged by authors. This raw count includes tests and generated-adjacent source files.

**Examples:**
- `pkg/storage/secret/metadata/query.go`
- `pkg/tests/apis/dashboard/integration/api_validation_test.go`
- `pkg/tsdb/cloudwatch/kinds/dataquery/types_dataquery_gen.go`
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go`
- `pkg/registry/apis/provisioning/register.go`

**Breakdown:**
- TODO: 1211
- FIXME: 154
- HACK: 24
- XXX: 23

---

### CC-02: Large files

**Count:** 549
**Delta:** n/a

Frontend files over roughly 500 lines and backend files over roughly 800 lines are candidates for splitting. The raw count includes many tests and generated files, so manual triage is needed before treating the total as actionable debt.

**Top actionable offenders:**
- `public/app/features/alerting/unified/mockGrafanaNotifiers.ts (3675 lines)`
- `pkg/tests/apis/provisioning/common/testing.go (2835 lines)`
- `pkg/services/featuremgmt/registry.go (2828 lines)`
- `pkg/storage/unified/testing/storage_backend_sql_compatibility.go (2674 lines)`
- `pkg/apiserver/storage/testing/store_tests.go (2667 lines)`
- `pkg/setting/setting.go (2432 lines)`
- `pkg/services/dashboards/service/dashboard_service.go (2410 lines)`
- `pkg/storage/unified/search/bleve.go (2192 lines)`
- `pkg/storage/unified/resource/storage_backend.go (2189 lines)`
- `pkg/util/xorm/core/core.go (2176 lines)`

---

## Recommended Actions

1. Migrate the remaining 22 Enzyme-style tests to React Testing Library, starting with `public/app/core/components`, `public/app/features/dashboard/containers`, and `public/app/features/dashboard-scene/`.
2. Extract large `pkg/api/` handlers, especially `declareFixedRoles`, `registerRoutes`, and `getFrontendSettings`, into service-layer helpers or route builders.
3. Add or document explicit interfaces for the six `pkg/services/*` packages that currently lack top-level interface definitions.
4. Add baseline tests for the 31 direct `pkg/services/*` packages without top-level test files, starting with auth-related packages and organization-facing services.
5. Continue the already-tracked dashboard, TraceView, oversized Go file, feature-toggle, and `any`-reduction work from the earlier ticket set.

## Manual Notes

<!-- Add any manual observations or context below this line. This section is preserved across report updates. -->
