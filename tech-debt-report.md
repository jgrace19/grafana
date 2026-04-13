# Tech Debt Report

> **Date:** 2026-04-13  
> **Scope:** `all` (frontend `public/app/` + backend `pkg/`)  
> **Commit:** `2298df8a`  
> **Previous report:** 2026-04-13 (narrative scan; superseded by this convention audit)

## Summary

| ID | Check | Count | Delta | Severity |
|---|---|---|---|---|
| FE-01 | Class components | 61 files | unchanged vs prior class scan | Medium |
| FE-02 | `connect()` HOC (react-redux) | 45 files | +4 vs prior “41 files” (refined: only `react-redux` imports) | Medium |
| FE-03 | Default exports (approx) | 498 files | new metric | Low |
| FE-04 | SASS files (`.scss`/`.sass`) | 0 | unchanged | Medium |
| FE-05 | `stylesFactory` usage | 16 files | unchanged | Medium |
| FE-06 | Unsafe lifecycle methods | 1 file | unchanged | High |
| FE-07 | Enzyme `shallow`/`mount` in tests | 22 files | new metric | High |
| FE-08 | Arrow component defs (approx) | 1998 `.tsx` files | new metric | Low |
| BE-01 | Large `HTTPServer` handlers (>50 lines) | 42 handlers | new metric | High |
| BE-02 | Service dirs without `type … interface` | 6 dirs | new spot-check | Medium |
| BE-03 | Service dirs without `*_test.go` | 31 dirs | new metric | Medium |
| CC-01 | TODO/FIXME/HACK/XXX | 1595 matches, 833 files | new breakdown | Low |
| CC-02 | Large files | 318 FE files >500 LOC; 84 BE non-test >800 LOC | new metric | Low |

## Detailed Findings

### FE-01: Class components

**Count:** 61 files  
**Delta:** unchanged (prior scan: 61)

Class components should be migrated to function components with hooks. Error boundaries (`componentDidCatch`) are the only exception.

**Examples:**

- `public/app/AppWrapper.tsx`
- `public/app/features/dashboard/containers/DashboardPage.tsx`
- `public/app/features/dashboard/components/DashboardRow/DashboardRow.tsx`
- `public/app/features/annotations/components/StandardAnnotationQueryEditor.tsx`
- `public/app/features/alerting/unified/components/rule-editor/QueryRows.tsx`

**Action:** Use the `migrate-class-components` skill (`.cursor/skills/migrate-class-components/SKILL.md`).

---

### FE-02: `connect()` HOC

**Count:** 45 files (files that import from `react-redux` and contain `connect(`)  
**Delta:** +4 vs prior “41 files” tally — prior count matched any `connect(` (e.g. RxJS `connect`); this audit restricts to Redux usage.

Replace `connect()` with `useSelector` and `useDispatch` hooks.

**Examples:**

- `public/app/features/migrate-to-cloud/onprem/Page.tsx`
- `public/app/features/manage-dashboards/import/legacy/DashboardImportLegacy.tsx`
- `public/app/features/users/UsersListPage.tsx`
- `public/app/features/dashboard/containers/DashboardPage.tsx`
- `public/app/features/explore/Explore.tsx`

**Action:** Use the `migrate-class-components` skill (Step 2).

---

### FE-03: Default exports

**Count:** 498 files (approximate)  
**Delta:** —

Project convention is named declaration exports. Count is approximate because some default exports are intentional (e.g. lazy-loaded routes).

**Examples:**

- `public/app/features/correlations/CorrelationsPage.tsx`
- `public/app/features/correlations/CorrelationsPageWrapper.tsx`
- `public/app/features/migrate-to-cloud/MigrateToCloud.tsx`
- `public/app/features/correlations/Forms/TransformationEditorRow.tsx`
- `public/app/features/alerting/unified/integration/AlertRulesToolbarButton.tsx`

---

### FE-04: SASS files

**Count:** 0 files under `public/app/`  
**Delta:** unchanged

New and modified frontend code should use Emotion `useStyles2`. No `.scss`/`.sass` files were found under `public/app/` in this scan.

**Examples:** —

---

### FE-05: `stylesFactory` usage

**Count:** 16 files  
**Delta:** unchanged (prior scan: 16)

`stylesFactory` is the deprecated styling helper. Replace with `useStyles2(getStyles)`.

**Examples:**

- `public/app/features/inspector/styles.ts`
- `public/app/features/query/components/QueryGroup.tsx`
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/index.tsx`
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/SpanTreeOffset.tsx`

---

### FE-06: Unsafe lifecycle methods

**Count:** 1 file  
**Delta:** unchanged

`componentWillReceiveProps`, `componentWillMount`, and `componentWillUpdate` are incompatible with React strict mode and must be migrated.

**Examples:**

- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`

**Action:** Highest priority migration target. Convert to hooks or derived state.

---

### FE-07: Enzyme/shallow tests

**Count:** 22 files  
**Delta:** —

Tests using `shallow()` or `mount()` should migrate to `@testing-library/react` with `render()`.

**Examples:**

- `public/app/features/dashboard/containers/SoloPanelPage.test.tsx`
- `public/app/features/dashboard/containers/DashboardPage.test.tsx`
- `public/app/features/teams/create-team/CreateTeamAPICalls.test.tsx`
- `public/app/features/alerting/unified/triage/hooks/useApplyDefaultTriageSearch.test.tsx`
- `public/app/features/commandPalette/scopes/scopeActions.test.tsx`

---

### FE-08: Arrow component definitions

**Count:** 1998 `.tsx` files matching heuristic `const Name = (…) =>`  
**Delta:** —

Convention prefers `function Foo()` declarations for React components. Count is approximate — includes non-component arrow functions.

**Examples:**

- `public/app/features/bookmarks/BookmarksPage.tsx`
- `public/app/features/alerting/unified/AlertWarning.tsx`
- `public/app/features/alerting/routes.tsx`
- `public/app/AppWrapper.tsx`
- `public/app/features/alerting/unified/integration/AlertRulesToolbarButton.tsx`

---

### BE-01: Large API handlers

**Count:** 42 `func (hs *HTTPServer) …` handlers exceeding ~50 lines in `pkg/api/`  
**Delta:** —

API handlers this large often contain logic that should live in `pkg/services/`.

**Examples (largest):**

- `pkg/api/accesscontrol.go` — `declareFixedRoles` (~586 lines)
- `pkg/api/api.go` — `registerRoutes` (~549 lines)
- `pkg/api/frontendsettings.go` — `getFrontendSettings` (~324 lines)
- `pkg/api/index.go` — `setIndexViewData` (~176 lines)
- `pkg/api/dashboard.go` — `GetDashboard` (~172 lines)

---

### BE-02: Missing service interfaces (spot-check)

**Count:** 6 top-level `pkg/services/<name>/` directories with Go sources but no `type … interface {` in any `*.go` file  
**Delta:** —

Wire DI favors interfaces defined next to implementations. Absence of an interface may be acceptable for thin packages (e.g. utilities); verify case-by-case.

**Examples:**

- `pkg/services/contexthandler`
- `pkg/services/datasourceproxy`
- `pkg/services/frontend`
- `pkg/services/hooks`
- `pkg/services/pluginsintegration`
- `pkg/services/scimutil`

---

### BE-03: Services without tests

**Count:** 31 service directories under `pkg/services/` that contain `*.go` but no `*_test.go`  
**Delta:** —

**Examples:**

- `pkg/services/supportbundles`
- `pkg/services/validations`
- `pkg/services/dashboardimport`
- `pkg/services/authapi`
- `pkg/services/extsvcauth`

*(Full list: `annotations`, `anonymous`, `apikey`, `auth`, `authapi`, `authz`, `dashboardimport`, `dashboardversion`, `dsquerierclient`, `extsvcauth`, `gcom`, `hooks`, `kmsproviders`, `licensing`, `login`, `loginattempt`, `org`, `plugindashboards`, `pluginsintegration`, `publicdashboards`, `quota`, `searchusers`, `secrets`, `signingkeys`, `ssosettings`, `star`, `stats`, `supportbundles`, `team`, `temp_user`, `validations`.)*

---

### CC-01: TODO/FIXME/HACK comments

**Count:** 1595 matches across 833 files (`public/app/` + `pkg/`)  
**Delta:** —

Known shortcuts or unfinished work flagged by authors.

**Breakdown (matches):**

- TODO: 1221  
- FIXME: 154  
- HACK: 24  
- XXX: 196  

---

### CC-02: Large files

**Count:** 318 frontend `.ts`/`.tsx` files over ~500 lines; 84 backend non-test `.go` files over ~800 lines  
**Delta:** —

Frontend and backend files exceeding these thresholds are candidates for splitting. Generated/protobuf/test harness files often dominate the backend list.

**Top offenders (frontend, by lines):**

- `public/app/features/alerting/unified/mockGrafanaNotifiers.ts` — 3675  
- `public/app/api/clients/scope/v0alpha1/endpoints.gen.ts` — 1828  
- `public/app/features/transformers/docs/content.ts` — 1670  
- `public/app/plugins/datasource/tempo/datasource.ts` — 1609  
- `public/app/features/dashboard/api/ResponseTransformers.ts` — 1484  

**Top offenders (backend non-test, by lines):**

- `pkg/storage/unified/resourcepb/resource.pb.go` — 3682  
- `pkg/tests/apis/provisioning/common/testing.go` — 2835  
- `pkg/services/featuremgmt/registry.go` — 2828  
- `pkg/setting/setting.go` — 2432  
- `pkg/services/dashboards/service/dashboard_service.go` — 2410  

---

## Recommended Actions

1. **Remove the unsafe lifecycle usage** in `TimelineViewingLayer.tsx` (FE-06) — single file, highest React risk.  
2. **Migrate Enzyme `shallow`/`mount` tests** (FE-07, 22 files) to React Testing Library — aligns with strict mode and current testing standards.  
3. **Thin the largest `HTTPServer` handlers** (BE-01), starting with `declareFixedRoles` and `registerRoutes`, moving orchestration into services.  
4. **Reduce class components and `connect()`** (FE-01, FE-02) using the **`migrate-class-components`** skill — prioritize high-churn areas such as dashboard and explore.  
5. **Replace `stylesFactory`** in TraceView and adjacent code (FE-05) alongside TraceView modernization.

## Manual Notes

Prior narrative scan (same date) called out debt×churn hotspots (`features/dashboard/`, `features/explore/`, `plugins/`), explicit `any` density, `nolint` usage, deprecated feature toggles, and OpenFeature migration — useful for prioritization alongside this convention checklist. Large generated or vendor-adjacent files (e.g. `*.pb.go`, `wire_gen.go`) should be excluded when judging “split this file” work.

<!-- Add any manual observations or context below this line. This section is
preserved across report updates. -->
