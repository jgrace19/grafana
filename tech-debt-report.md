# Tech Debt Report — all — 2026-04-17

## Hotspots (high debt × high churn)

Priority score = debt signals × log2(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|---------------------|----------------|
| 1 | `pkg/registry/apis/` | 270 | 526 | 2441.25 |
| 2 | `public/app/plugins/datasource/` | 285 | 193 | 2165.98 |
| 3 | `pkg/storage/unified/` | 204 | 334 | 1711.16 |
| 4 | `pkg/services/ngalert/` | 211 | 185 | 1590.76 |
| 5 | `public/app/features/dashboard/` | 151 | 170 | 1120.10 |
| 6 | `pkg/tests/api/` | 187 | 62 | 1117.75 |
| 7 | `pkg/tests/apis/` | 126 | 452 | 1111.74 |
| 8 | `public/app/features/alerting/` | 132 | 270 | 1066.84 |
| 9 | `public/app/plugins/panel/` | 115 | 183 | 865.21 |
| 10 | `pkg/services/libraryelements/` | 122 | 16 | 498.67 |

## Frontend Modernization

### Class components: 61 files

Top areas:
- `public/app/plugins/datasource/` — 12 files
- `public/app/plugins/panel/` — 11 files
- `public/app/features/dashboard/` — 10 files
- `public/app/features/explore/` — 8 files
- `public/app/features/variables/` — 4 files

Representative files:
- `public/app/features/dashboard/containers/DashboardPage.tsx`
- `public/app/features/dashboard/components/PanelEditor/PanelEditor.tsx`
- `public/app/features/explore/Explore.tsx`
- `public/app/plugins/datasource/influxdb/components/editor/config/ConfigEditor.tsx`
- `public/app/plugins/panel/canvas/CanvasPanel.tsx`

### connect() HOC (Redux): 41 files

Top areas:
- `public/app/features/dashboard/` — 9 files
- `public/app/features/explore/` — 8 files
- `public/app/features/admin/` — 5 files
- `public/app/features/variables/` — 4 files
- `public/app/features/auth-config/` — 3 files

Representative files:
- `public/app/features/dashboard/components/DashNav/DashNav.tsx`
- `public/app/features/dashboard/containers/DashboardPage.tsx`
- `public/app/features/explore/Explore.tsx`
- `public/app/features/explore/Table/TableContainer.tsx`
- `public/app/features/admin/UserAdminPage.tsx`

### Unsafe lifecycle methods: 1 file

- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`

### Legacy `stylesFactory`: 16 files

Top areas:
- `public/app/features/explore/` — 7 files
- `public/app/plugins/panel/` — 4 files
- `public/app/features/dashboard/` — 2 files

Representative files:
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/SpanBarRow.tsx`
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/VirtualizedTraceView.tsx`
- `public/app/features/dashboard/components/PanelEditor/PanelEditor.tsx`
- `public/app/plugins/panel/live/LivePanel.tsx`

## Type Safety

### Explicit `any`: 393 occurrences across 137 files

Top files:
- `public/app/features/dashboard/state/DashboardModel.ts` — 23
- `public/app/core/time_series2.ts` — 19
- `public/app/plugins/datasource/opentsdb/datasource.ts` — 16
- `public/app/features/dashboard/state/DashboardMigrator.ts` — 16
- `public/app/features/dashboard/state/PanelModel.ts` — 13
- `public/app/plugins/datasource/influxdb/query_part.ts` — 12
- `public/app/plugins/datasource/influxdb/datasource.ts` — 11

### `@deprecated` APIs: 46 files

Representative files:
- `public/app/core/services/backend_srv.ts`
- `public/app/core/time_series2.ts`
- `public/app/features/dashboard/state/DashboardModel.ts`
- `public/app/features/alerting/unified/utils/datasource.ts`
- `public/app/types/events.ts`

## Comment Debt

### Frontend TODO/FIXME/HACK/XXX: 602 occurrences across 327 files

Highest-density files (sample):
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18

### Backend TODO/FIXME/HACK/XXX: 894 occurrences across 453 files

Highest-density files (sample):
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/registry/apis/provisioning/register.go` — 10
- `pkg/services/org/orgimpl/org.go` — 10

## Go Quality

### `nolint` directives: 1,274 occurrences across 486 files

Highest-density files:
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_ruler_test.go` — 25
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25

### Oversized non-test Go files (>800 LOC): 66 files

Top actionable files (non-generated):

| File | Lines |
|------|-------|
| `pkg/services/featuremgmt/registry.go` | 2828 |
| `pkg/setting/setting.go` | 2432 |
| `pkg/services/dashboards/service/dashboard_service.go` | 2410 |
| `pkg/storage/unified/search/bleve.go` | 2192 |
| `pkg/storage/unified/resource/storage_backend.go` | 2189 |
| `pkg/util/xorm/core/core.go` | 2176 |
| `pkg/storage/unified/resource/server.go` | 1941 |
| `pkg/services/ngalert/store/alert_rule.go` | 1873 |
| `pkg/registry/apis/provisioning/register.go` | 1579 |
| `pkg/storage/unified/resource/search.go` | 1551 |
| `pkg/services/live/live.go` | 1477 |
| `pkg/storage/unified/sql/backend.go` | 1426 |
| `pkg/services/ngalert/api/prometheus/api_prometheus.go` | 1395 |
| `pkg/services/ngalert/models/alert_rule.go` | 1322 |
| `pkg/api/dashboard.go` | 1290 |

### Deprecated Go APIs: 65 files

## Feature Toggles

### Deprecated toggles in registry: 3

| Toggle Name | Description |
|---|---|
| `prometheusAzureOverrideAudience` | Deprecated. Allow override default AAD audience for Azure Prometheus endpoint. Enabled by default. |
| `localeFormatPreference` | Specifies the locale so the correct format for numbers and dates can be shown. |
| `prometheusTypeMigration` | Migrates deprecated Prometheus auth methods (SigV4 and Azure). |

### Old `IsEnabled`/`IsEnabledGlobally` API call sites: 162 files

Representative files:
- `pkg/api/api.go`
- `pkg/api/dashboard.go`
- `pkg/api/frontendsettings.go`
- `pkg/registry/apis/dashboard/register.go`
- `pkg/registry/apis/folders/register.go`

## Recommended Actions

### Priority 1: Reduce debt in `pkg/registry/apis/`
This area has the highest debt × churn priority score and combines TODO/FIXME density, `nolint` usage, deprecated markers, and oversized files (notably `pkg/registry/apis/provisioning/register.go`).

### Priority 2: Modernize datasource plugin frontend code
`public/app/plugins/datasource/` is a top hotspot with 12 class components, high TODO density, and multiple files in the top explicit-`any` list.

### Priority 3: Split `pkg/storage/unified/` large files and suppressions
`pkg/storage/unified/` has 204 aggregate signals and very high churn. Start with `storage_backend.go`, `server.go`, and `search.go`.

### Priority 4: Stabilize `pkg/services/ngalert/` debt hotspots
The ngalert service combines large files, TODOs, and linter suppressions in a high-churn service boundary.

### Priority 5: Continue React modernization in dashboard/explore
`public/app/features/dashboard/` and `public/app/features/explore/` still contain class components, `connect()`, the only unsafe lifecycle method, and most `stylesFactory` usage. Use the `migrate-class-components` skill for conversions.

### Priority 6: Complete feature-toggle API migration
Remove 3 deprecated toggles and migrate 162 call sites from `IsEnabled` / `IsEnabledGlobally` to OpenFeature APIs in `pkg/services/featuremgmt/`.

### Priority 7: Reduce explicit `any` in top offenders
Target `DashboardModel.ts`, `time_series2.ts`, and top datasource/query files first to reduce the largest concentration of type-unsafe usage.

## Change Log

### 2026-04-14 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | 0 |
| connect() HOC | 41 | 41 | 0 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory | 16 | 16 | 0 |
| Explicit `any` | ~371 | ~393 | +22 |
| `any` files | ~128 | ~137 | +9 |
| @deprecated APIs | ~58 | ~51 | -7 ✓ |
| Frontend TODO/FIXME/HACK | ~515 | ~618 | +103 |
| Backend TODO/FIXME/HACK | ~913 | ~894 | -19 ✓ |
| nolint directives | ~1,275 | ~1,275 | 0 |
| Oversized Go files (>800 loc) | 20 | 67 | +47 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | ~160 | ~162 | +2 |

**Resolved since last scan:**
- 7 files with `@deprecated` APIs were cleaned up
- 19 backend TODO/FIXME/HACK comments were resolved

**New since last scan:**
- 22 new explicit `any` type annotations added across 9 new files
- 103 new frontend TODO/FIXME/HACK comments added
- 47 additional Go files now exceed 800 lines (note: previous scan may have used different exclusion criteria)
- 2 new files using old IsEnabled API

### 2026-04-13 (rescan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | 0 |
| connect() HOC | 41 | 41 | 0 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory | 16 | 16 | 0 |
| Explicit `any` | ~371 | ~371 | 0 |
| @deprecated APIs | ~58 | ~58 | 0 |
| Frontend TODO/FIXME/HACK | ~515 | ~515 | 0 |
| Backend TODO/FIXME/HACK | ~913 | ~913 | 0 |
| nolint directives | ~1,275 | ~1,275 | 0 |
| Oversized Go files | 20 | 20 | 0 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | ~160 | ~160 | 0 |

**Resolved since last scan:** None

**New since last scan:** None

### 2026-04-17 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | 0 |
| connect() HOC | 41 | 41 | 0 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory | 16 | 16 | 0 |
| Explicit `any` | 393 | 393 | 0 |
| `any` files | 137 | 137 | 0 |
| @deprecated APIs | 51 | 46 | -5 |
| Frontend TODO/FIXME/HACK | 618 | 602 | -16 |
| Backend TODO/FIXME/HACK | 894 | 894 | 0 |
| nolint directives | 1,275 | 1,274 | -1 |
| Oversized Go files (>800 loc) | 67 | 66 | -1 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 162 | 0 |

**Resolved since last scan:**
- 5 files with `@deprecated` APIs no longer match the scan.
- 16 frontend TODO/FIXME/HACK/XXX markers were removed.
- 1 `nolint` directive was removed.
- 1 oversized non-test Go file dropped below 800 LOC.

**New since last scan:**
- No net-new top-level debt signals were added in this scan.
