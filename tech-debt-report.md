# Tech Debt Report — All Scopes — 2026-04-18

## Hotspots (high debt × high churn)

Priority score = debt signals × log2(commits + 1)

This scan keeps the import-aware `react-redux` `connect()` filter and excludes generated and test-oriented Go helpers from the oversized-file list so the hotspot ranking stays focused on production code.

| Rank | Area | Debt Signals | Commits (6mo) | Priority Score |
|------|------|--------------|---------------|----------------|
| 1 | `pkg/services/ngalert/` | 115 | 185 | 867 |
| 2 | `pkg/storage/` | 74 | 367 | 631 |
| 3 | `public/app/plugins/datasource/` | 81 | 193 | 616 |
| 4 | `public/app/features/alerting/` | 76 | 270 | 614 |
| 5 | `public/app/plugins/panel/` | 79 | 182 | 594 |
| 6 | `pkg/api/` | 64 | 147 | 461 |
| 7 | `public/app/features/dashboard/` | 52 | 170 | 386 |
| 8 | `pkg/registry/apis/provisioning/` | 42 | 194 | 320 |
| 9 | `public/app/features/explore/` | 47 | 106 | 317 |
| 10 | `public/app/core/` | 40 | 187 | 302 |

## Frontend Modernization

### Class Components: 61 files

Top areas:
- `features/dashboard/` — 10 files
- `plugins/datasource/` — 12 files
- `plugins/panel/` — 11 files
- `features/explore/` — 8 files
- `features/variables/` — 4 files
- `core/` — 4 files

### connect() HOC (Redux): 44 files

Top areas:
- `features/explore/` — 10 files
- `features/dashboard/` — 9 files
- `features/admin/` — 5 files
- `features/variables/` — 4 files
- `features/auth-config/` — 3 files
- `features/org/` — 3 files

### Unsafe Lifecycle Methods: 1 file

- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx` — uses `UNSAFE_componentWillReceiveProps`

### Legacy `stylesFactory`: 16 files

Top areas:
- `features/explore/` — 7 files
- `plugins/panel/` — 4 files
- `features/dashboard/` — 2 files
- `features/query/` — 1 file
- `features/inspector/` — 1 file
- `plugins/datasource/` — 1 file

## Type Safety

### Explicit `any`: 397 occurrences across 140 files

Worst offenders (by occurrence count):
- `public/app/features/dashboard/state/DashboardModel.ts` — 23
- `public/app/core/time_series2.ts` — 19
- `public/app/features/dashboard/state/DashboardMigrator.ts` — 16
- `public/app/plugins/datasource/opentsdb/datasource.ts` — 16
- `public/app/features/dashboard/state/PanelModel.ts` — 13
- `public/app/plugins/datasource/influxdb/query_part.ts` — 12
- `public/app/plugins/datasource/influxdb/datasource.ts` — 11
- `public/app/features/alerting/state/query_part.ts` — 10
- `public/app/features/dashboard/state/DashboardMigrator.test.ts` — 10
- `public/app/features/explore/TraceView/components/model/link-patterns.tsx` — 9

### `@deprecated` APIs: 46 files (non-generated)

Top areas:
- `core/` — 7 files
- `features/alerting/` — 7 files
- `plugins/datasource/` — 7 files
- `plugins/panel/` — 5 files
- `features/search/` — 2 files
- `features/explore/` — 2 files

## Comment Debt

### Frontend TODO/FIXME/HACK/XXX: 602 occurrences across 327 files

Highest-density files (sampled):
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10
- `public/app/features/panel/panellinks/specs/link_srv.test.ts` — 8

### Backend TODO/FIXME/HACK/XXX: 851 occurrences across 441 files

Highest-density files (sampled):
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/registry/apis/provisioning/register.go` — 10
- `pkg/services/org/orgimpl/org.go` — 10
- `pkg/storage/unified/resource/datastore.go` — 10

## Go Quality

### `nolint` Directives: 1274 occurrences across 486 files

Highest-density files:
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25
- `pkg/tests/api/alerting/api_ruler_test.go` — 25
- `pkg/services/libraryelements/libraryelements_patch_test.go` — 19

### Oversized Non-Test Go Files (>800 loc): 56 files

Top actionable files (generated code and test-oriented helpers excluded):

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
| `pkg/tsdb/grafana-testdata-datasource/scenarios.go` | 1318 |

*Note*: `pkg/services/featuremgmt/registry.go` is still the largest production file at 2828 loc. `pkg/setting/setting.go`, `pkg/services/dashboards/service/dashboard_service.go`, and `pkg/storage/unified/resource/storage_backend.go` remain the highest-value split candidates because they combine size with sustained churn.

### Deprecated Go APIs: 58 files (non-generated)

## Feature Toggles

### Deprecated Toggles (3 active in registry)

| Toggle Name | Description |
|---|---|
| `prometheusAzureOverrideAudience` | Deprecated. Allow override default AAD audience for Azure Prometheus endpoint. Enabled by default. This feature should no longer be used and will be removed in the future. |
| `localeFormatPreference` | Specifies the locale so the correct format for numbers and dates can be shown |
| `prometheusTypeMigration` | Checks for deprecated Prometheus authentication methods (SigV4 and Azure), installs the relevant data source, and migrates the Prometheus data sources |

### Old `IsEnabled`/`IsEnabledGlobally` API: 160 files

These call sites should migrate to the OpenFeature interface (per deprecation notice in `pkg/services/featuremgmt/models.go`).

## Recommended Actions

1. **[Tech Debt] Modernize dashboard legacy React patterns**  
   `public/app/features/dashboard/` still carries 52 debt signals across 41 files, including 10 class components, 9 `connect()` usages, and 17 explicit `any` file signals. Use the `migrate-class-components` skill for `DashboardPage`, `DashboardPanel`, `DashboardGrid`, `PanelEditor`, and `SubMenu`, then tighten the high-volume model types.
2. **[Tech Debt] Modernize Explore TraceView legacy patterns**  
   `public/app/features/explore/` contains the repository's only unsafe lifecycle, 7 `stylesFactory` usages, 8 class components, and 10 `connect()` call sites. Treat the TraceView subtree as a single modernization batch.
3. **[Tech Debt] Reduce plugin datasource tech debt hotspots**  
   `public/app/plugins/datasource/` is the largest frontend hotspot by debt volume after the core app areas: 81 signals across 69 files, 12 class components, 26 explicit `any` file signals, and 35 comment-debt matches.
4. **[Tech Debt] Split oversized backend files in active packages**  
   56 production Go files still exceed 800 loc. Start with `pkg/services/featuremgmt/registry.go`, `pkg/setting/setting.go`, `pkg/services/dashboards/service/dashboard_service.go`, `pkg/storage/unified/resource/storage_backend.go`, and `pkg/services/ngalert/store/alert_rule.go`.
5. **[Tech Debt] Migrate legacy feature toggle APIs to OpenFeature**  
   Three deprecated toggles remain in the registry and 160 files still rely on `IsEnabled`/`IsEnabledGlobally`.
6. **[Tech Debt] Reduce explicit any in top frontend offenders**  
   The top offenders are still `DashboardModel.ts`, `core/time_series2.ts`, `DashboardMigrator.ts`, `opentsdb/datasource.ts`, and `PanelModel.ts`; together they represent a disproportionate share of the `any` surface area.

## Change Log

### 2026-04-18 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | 0 |
| connect() HOC | 41 | 44 | +3 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory | 16 | 16 | 0 |
| Explicit any | 393 | 397 | +4 |
| any files | 137 | 140 | +3 |
| @deprecated APIs | 51 | 46 | -5 |
| Frontend TODO/FIXME/HACK | 618 | 602 | -16 |
| Backend TODO/FIXME/HACK | 894 | 851 | -43 |
| nolint directives | 1275 | 1274 | -1 |
| Oversized Go files (>800 loc) | 67 | 56 | -11 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 160 | -2 |

**Resolved since last scan:**
- 5 files with `@deprecated` APIs no longer match the scan
- 16 frontend TODO/FIXME/HACK comments and 43 backend TODO/FIXME/HACK comments were removed
- 2 files migrated off the legacy `IsEnabled` API surface
- 11 files dropped out of the oversized Go-file list after consistent exclusion of generated and test-oriented helper code

**New since last scan:**
- 3 additional `react-redux` `connect()` call sites are now tracked by the import-aware scan
- 4 new explicit `any` annotations appeared across 3 additional files
- Dashboard and plugin datasource areas remain the largest frontend sources of new type-safety debt

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
