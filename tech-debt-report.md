# Tech Debt Report — All Scopes — 2026-04-17

## Hotspots (high debt × high churn)

Priority score = debt signals × log2(commits + 1)

| Rank | Area | Debt Signals | Commits (6mo) | Priority Score |
|------|------|-------------|----------------|----------------|
| 1 | `pkg/registry/` | 275 | 621 | 2552.21 |
| 2 | `pkg/storage/` | 167 | 369 | 1424.74 |
| 3 | `pkg/services/ngalert/` | 182 | 185 | 1372.13 |
| 4 | `public/app/features/alerting/` | 111 | 270 | 897.12 |
| 5 | `public/app/features/dashboard/` | 116 | 170 | 860.47 |
| 6 | `pkg/api/` | 100 | 147 | 720.95 |
| 7 | `public/app/core/` | 74 | 187 | 559.04 |
| 8 | `pkg/build/` | 69 | 54 | 398.91 |
| 9 | `public/app/features/explore/` | 57 | 107 | 385.03 |
| 10 | `public/app/plugins/datasource/influxdb/` | 50 | 11 | 179.25 |

## Frontend Modernization

### Class Components: 61 files

Top areas:
- `plugins/datasource/` — 12 files (`ConfigEditor`, `VariableQueryEditor`, `EditorField`, `MetricTankMetaInspector`, `ConfigEditor`, `+5 more`)
- `plugins/panel/` — 11 files (`AnnoListPanel`, `BarGaugePanel`, `CanvasPanel`, `CursorView`, `EventBusLogger`, `+5 more`)
- `features/dashboard/` — 10 files (`DashboardRow`, `VersionsSettings`, `PanelEditor`, `PanelEditorQueries`, `ShareSnapshot`, `+5 more`)
- `features/explore/` — 8 files (`Explore`, `LiveLogs`, `LogsContainer`, `TableContainer`, `TraceTimelineViewer`, `+3 more`)
- `features/variables/` — 4 files (`VariableEditorContainer`, `VariableEditorEditor`, `OptionsPicker`, `QueryVariableEditor`)
- `public/app/core/` — 4 files (`GraphNG`, `multiSelect`, `select`, `SharedPreferencesOld`)
- `features/query/` — 3 files (`QueryEditorRow`, `QueryEditorRows`, `QueryGroup`)

### connect() HOC (Redux): 44 files

Top areas:
- `features/explore/` — 10 files (`Explore`, `ExplorePaneContainer`, `ExploreQueryInspector`, `ExploreRunQueryButton`, `LogsContainer`, `+5 more`)
- `features/dashboard/` — 9 files (`DashNav`, `GeneralSettings`, `DeleteDashboardModal`, `PanelInspector`, `PanelEditor`, `+4 more`)
- `features/admin/` — 5 files (`UpgradePage`, `UserAdminPage`, `UserListAdminPage`, `UserListAnonymousPage`, `LdapSettingsPage`)
- `features/variables/` — 4 files (`VariableEditorContainer`, `VariableEditorEditor`, `OptionsPicker`, `QueryVariableEditor`)

### Unsafe Lifecycle Methods: 1 file

- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx` — uses `UNSAFE_componentWillReceiveProps`

### Legacy `stylesFactory`: 16 files

Top areas:
- `features/explore/TraceView/` — 7 files (`ViewingLayer`, `SpanBarRow`, `SpanDetailRow`, `SpanTreeOffset`, `TimelineViewingLayer`, `+2 more`)
- `plugins/panel/` — 4 files (`AnnoListPanel`, `GettingStarted`, `LiveChannelEditor`, `LivePanel`)
- `features/dashboard/` — 2 files (`PanelEditor`, `SubMenu`)
- `features/inspector/` — 1 files (`styles`)
- `features/query/` — 1 files (`QueryGroup`)
- `plugins/datasource/graphite/` — 1 files (`MetricTankMetaInspector`)

## Type Safety

### Explicit `any`: ~393 occurrences across ~137 files

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

### `@deprecated` APIs: ~46 files (non-generated)

Key files with deprecated APIs still defined:
- `public/app/features/dashboard/state/DashboardModel.ts`
- `public/app/core/services/backend_srv.ts`
- `public/app/features/templating/template_srv.ts`
- `public/app/core/time_series2.ts`
- `public/app/types/events.ts`

## Comment Debt

### Frontend TODO/FIXME/HACK/XXX: ~602 occurrences across ~327 files

Highest-density files (sampled):
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10
- `public/app/features/panel/panellinks/specs/link_srv.test.ts` — 8

### Backend TODO/FIXME/HACK/XXX: ~853 occurrences across ~443 files

Highest-density files (sampled):
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16 (test file)
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12 (test file)
- `pkg/registry/apis/provisioning/register.go` — 10
- `pkg/services/org/orgimpl/org.go` — 10
- `pkg/storage/unified/resource/datastore.go` — 10

## Go Quality

### `nolint` Directives: ~1274 occurrences across ~486 files

Highest-density files:
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25
- `pkg/tests/api/alerting/api_ruler_test.go` — 25
- `pkg/services/libraryelements/libraryelements_patch_test.go` — 19
- `pkg/tests/api/annotations/annotations_test.go` — 19

### Oversized Non-Test Go Files (>800 loc): 57 files

Top actionable files (excluding generated and test-oriented files):

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
| `pkg/services/ngalert/models/testing.go` | 1650 |
| `pkg/registry/apis/provisioning/register.go` | 1579 |
| `pkg/storage/unified/resource/search.go` | 1551 |
| `pkg/services/live/live.go` | 1477 |
| `pkg/storage/unified/sql/backend.go` | 1426 |
| `pkg/services/ngalert/api/prometheus/api_prometheus.go` | 1395 |
| `pkg/services/ngalert/models/alert_rule.go` | 1322 |

*Note*: `registry.go` (2828 loc), `setting.go` (2432 loc), and `dashboard_service.go` (2410 loc) remain the highest-leverage split candidates.

### Deprecated Go APIs: ~62 files (non-generated)

## Feature Toggles

### Deprecated Toggles (3 active in registry)

| Toggle Name | Description |
|---|---|
| `prometheusAzureOverrideAudience` | Deprecated. Allow override default AAD audience for Azure Prometheus endpoint. Enabled by default. This feature should no longer be used and will be removed in the future. |
| `localeFormatPreference` | Specifies the locale so the correct format for numbers and dates can be shown |
| `prometheusTypeMigration` | Checks for deprecated Prometheus authentication methods (SigV4 and Azure), installs the relevant data source, and migrates the Prometheus data sources |

### Old `IsEnabled`/`IsEnabledGlobally` API: ~161 files

These call sites should migrate to the OpenFeature interface (per deprecation notice in `pkg/services/featuremgmt/models.go`).

## Recommended Actions

### Priority 1: Dashboard Legacy Code (highest debt × high churn)
`features/dashboard/` still has 10 class components, 9 `connect()` usages, heavy `any` typing in state models, and 170 commits in 6 months. Use the `migrate-class-components` skill to convert `DashboardPage`, `DashboardPanel`, `DashboardGrid`, `PanelEditor`, and `SubMenu`.

### Priority 2: Explore TraceView Modernization
The `TraceView` subtree still owns the only unsafe lifecycle method, 7 of 16 `stylesFactory` usages, and multiple class components. This remains the cleanest batch modernization target in Explore.

### Priority 3: Oversized Go Files
Split `pkg/services/featuremgmt/registry.go`, `pkg/setting/setting.go`, `pkg/services/dashboards/service/dashboard_service.go`, and `pkg/storage/unified/resource/storage_backend.go` into focused submodules. These are large, active, non-generated files.

### Priority 4: Feature Toggle Cleanup
Remove 3 deprecated feature toggles and migrate ~161 files from `IsEnabled`/`IsEnabledGlobally` to OpenFeature.

### Priority 5: `any` Type Reduction
Target the top 10 offenders (`DashboardModel`, `time_series2`, `DashboardMigrator`, `opentsdb/datasource`, `PanelModel`) for stricter typing. These files remain the biggest drag on frontend type safety.

### Priority 6: Plugin Datasource Class Components
12 datasource plugin editors still use class components (AzureMonitor, Cloud Monitoring, InfluxDB, Loki, Tempo, Graphite, Pyroscope). Many are workspace-scoped plugins, so modernize them alongside routine plugin maintenance.

## Change Log

### 2026-04-17 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | 0 |
| connect() HOC | 41 | 44 | +3 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory | 16 | 16 | 0 |
| Explicit `any` | 393 | 393 | 0 |
| `any` files | 137 | 137 | 0 |
| @deprecated APIs | 51 | 46 | -5 |
| Frontend TODO/FIXME/HACK | 618 | 602 | -16 |
| Backend TODO/FIXME/HACK | 894 | 853 | -41 |
| nolint directives | 1275 | 1274 | -1 |
| Oversized Go files (>800 loc) | 67 | 57 | -10 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 161 | -1 |

**Resolved since last scan:**
- 5 frontend files with `@deprecated` APIs were cleaned up
- 16 frontend and 41 backend TODO/FIXME/HACK comments were removed
- 1 `nolint` directive and 1 legacy `IsEnabled` call-site file were removed

**New since last scan:**
- 3 additional `react-redux` `connect()` files are still present under the current scan
- No new remediation themes emerged; the recommended action buckets are unchanged from the previous report

*Method note*: the oversized-file count now consistently excludes test-oriented helper files, which reduced noise by 10 files versus the prior report.

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
