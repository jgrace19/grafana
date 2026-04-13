# Tech Debt Report — All Scopes — 2026-04-13

## Hotspots (high debt × high churn)

Priority score = debt signals × log₂(commits + 1)

| Rank | Area | Debt Signals | Commits (6mo) | Priority Score |
|------|------|-------------|----------------|----------------|
| 1 | `public/app/features/dashboard/` | 28 (10 class, 6 connect, 4 stylesFactory, 8 other) | 177 | 210 |
| 2 | `public/app/features/alerting/` | 11 (1 class, 0 connect, 0 stylesFactory, 10 @deprecated/any) | 274 | 93 |
| 3 | `public/app/features/explore/` | 14 (6 class, 4 connect, 3 stylesFactory, 1 unsafe lifecycle) | 110 | 96 |
| 4 | `public/app/plugins/` | 21 (11 class, 1 connect, 5 stylesFactory, 4 other) | 367 | 181 |
| 5 | `public/app/features/variables/` | 8 (4 class, 4 connect) | 23 | 37 |
| 6 | `public/app/core/` | 5 (2 class, 0 connect, 1 stylesFactory, 2 other) | 193 | 39 |
| 7 | `public/app/features/dashboard-scene/` | 0 legacy class/connect, moderate any/TODO | 552 | low (modern code) |
| 8 | `public/app/features/query/` | 5 (3 class, 0 connect, 1 stylesFactory, 1 other) | 27 | 24 |
| 9 | `pkg/registry/` | high TODO/nolint density | 639 | backend hotspot |
| 10 | `pkg/services/ngalert/` | high TODO/nolint density | 185 | backend hotspot |

## Frontend Modernization

### Class Components: 61 files

Top areas:
- `features/dashboard/` — 10 files (`DashboardPage`, `DashboardPanel`, `DashboardGrid`, `PanelEditor`, `SubMenu`, `ShareSnapshot`, `VersionsSettings`, `DashboardRow`, `PanelEditorQueries`, `PanelStateWrapper`)
- `features/explore/` — 6 files (`Explore`, `LogsContainer`, `LiveLogs`, `TableContainer`, `TraceTimelineViewer`, `TraceView DraggableManager demos`)
- `features/variables/` — 4 files (`QueryVariableEditor`, `OptionsPicker`, `VariableEditorEditor`, `VariableEditorContainer`)
- `plugins/panel/` — 7 files (`CanvasPanel`, `GeomapPanel`, `LivePanel`, `GettingStarted`, `BarGaugePanel`, `AnnoListPanel`, debug panels)
- `plugins/datasource/` — 8 files (InfluxDB, Graphite, Loki, Tempo, AzureMonitor, CloudMonitoring, Pyroscope editors)
- `features/query/` — 3 files (`QueryGroup`, `QueryEditorRows`, `QueryEditorRow`)
- `features/logs/` — 2 files (`LogMessageAnsi`, `LogDetailsRow`)

### connect() HOC (Redux): 41 files

Top areas:
- `features/dashboard/` — 6 files (`DashboardPage`, `DashboardPanel`, `PanelEditor`, `SubMenu`, `DashNav`, `GeneralSettings`)
- `features/explore/` — 7 files (`Explore`, `LogsContainer`, `TableContainer`, `RichHistoryContainer`, `ExploreQueryInspector`, `ExplorePaneContainer`, `NodeGraphContainer`)
- `features/admin/` — 4 files (`UserAdminPage`, `UpgradePage`, `UserListAnonymousPage`, `UserListAdminPage`, `LdapSettingsPage`)
- `features/variables/` — 3 files (`OptionsPicker`, `VariableEditorEditor`, `VariableEditorContainer`)

### Unsafe Lifecycle Methods: 1 file

- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx` — uses `UNSAFE_componentWillReceiveProps`

### Legacy `stylesFactory`: 16 files

- `features/explore/TraceView/` — 7 files (SpanBarRow, SpanDetailRow, SpanTreeOffset, VirtualizedTraceView, ViewingLayer, TimelineViewingLayer, TraceTimelineViewer index)
- `features/dashboard/` — 2 files (SubMenu, PanelEditor)
- `features/query/` — 1 file (QueryGroup)
- `features/inspector/` — 1 file (styles.ts)
- `plugins/panel/` — 3 files (GettingStarted, LivePanel, LiveChannelEditor, AnnoListPanel)
- `plugins/datasource/graphite/` — 1 file (MetricTankMetaInspector)

## Type Safety

### Explicit `any`: ~371 occurrences across ~128 files

Worst offenders (by occurrence count):
- `public/app/core/time_series2.ts` — 19
- `public/app/features/dashboard/state/DashboardModel.ts` — 23
- `public/app/features/dashboard/state/DashboardMigrator.ts` — 16
- `public/app/features/dashboard/state/PanelModel.ts` — 13
- `public/app/plugins/datasource/influxdb/query_part.ts` — 12
- `public/app/plugins/datasource/influxdb/datasource.ts` — 11
- `public/app/plugins/datasource/opentsdb/datasource.ts` — 16
- `public/app/features/alerting/state/query_part.ts` — 10
- `public/app/plugins/datasource/graphite/graphite_query.ts` — 9
- `public/app/features/explore/TraceView/components/model/link-patterns.tsx` — 9
- `public/app/features/templating/template_srv.ts` — 8

### `@deprecated` APIs: ~58 files (non-generated)

Key files with deprecated APIs still defined:
- `public/app/features/dashboard/state/DashboardModel.ts`
- `public/app/core/services/backend_srv.ts`
- `public/app/features/templating/template_srv.ts`
- `public/app/types/events.ts`
- `public/app/core/time_series2.ts`

## Comment Debt

### Frontend TODO/FIXME/HACK/XXX: ~515 occurrences across ~280 files

Highest-density files (sampled):
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18

### Backend TODO/FIXME/HACK/XXX: ~913 occurrences across ~490 files

Highest-density files (sampled):
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/storage/unified/testing/kv.go` — 16
- `pkg/tests/api/alerting/api_ruler_test.go` — 25 (test file)
- `pkg/registry/apis/provisioning/register.go` — 10
- `pkg/services/org/orgimpl/org.go` — 10
- `pkg/storage/unified/resource/datastore.go` — 10

## Go Quality

### `nolint` Directives: ~1,275 occurrences across ~500+ files

Highest-density files:
- `pkg/tests/api/alerting/api_ruler_test.go` — 25
- `pkg/tests/api/annotations/annotations_test.go` — 19
- `pkg/services/libraryelements/libraryelements_patch_test.go` — 19
- `pkg/services/preference/prefimpl/store_test.go` — 17
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/preference/prefimpl/pref_test.go` — 16
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42

### Oversized Non-Test Go Files (>800 loc): 20 files

| File | Lines |
|------|-------|
| `pkg/tests/apis/provisioning/common/testing.go` | 2835 |
| `pkg/services/featuremgmt/registry.go` | 2828 |
| `pkg/apimachinery/utils/meta_mock.go` | 2779 |
| `pkg/apimachinery/apis/common/v0alpha1/zz_generated.openapi.go` | 2757 |
| `pkg/storage/unified/testing/storage_backend_sql_compatibility.go` | 2674 |
| `pkg/apiserver/storage/testing/store_tests.go` | 2667 |
| `pkg/setting/setting.go` | 2432 |
| `pkg/services/dashboards/service/dashboard_service.go` | 2410 |
| `pkg/storage/unified/search/bleve.go` | 2192 |
| `pkg/storage/unified/resource/storage_backend.go` | 2189 |
| `pkg/util/xorm/core/core.go` | 2176 |
| `pkg/storage/unified/testing/storage_backend.go` | 2087 |
| `pkg/server/wire_gen.go` | 1943 |
| `pkg/storage/unified/resource/server.go` | 1941 |
| `pkg/services/ngalert/store/alert_rule.go` | 1873 |
| `pkg/registry/apis/provisioning/register.go` | 1579 |
| `pkg/storage/unified/resource/search.go` | 1551 |

*Note*: `wire_gen.go`, `zz_generated.openapi.go`, and `meta_mock.go` are generated — not actionable. Real targets: `setting.go` (2432), `dashboard_service.go` (2410), `bleve.go` (2192), `storage_backend.go` (2189), `alert_rule.go` (1873).

### Deprecated Go APIs: ~77 files (non-generated)

## Feature Toggles

### Deprecated Toggles (3 active in registry)

| Toggle Name | Description |
|---|---|
| `prometheusAzureOverrideAudience` | "Allow override default AAD audience for Azure Prometheus endpoint. Enabled by default. This feature should no longer be used and will be removed in the future." |
| `localeFormatPreference` | "Specifies the locale so the correct format for numbers and dates can be shown" — paused, will be removed |
| `prometheusTypeMigration` | "Checks for deprecated Prometheus authentication methods (SigV4 and Azure), installs the relevant data source, and migrates the Prometheus data sources" |

### Old `IsEnabled`/`IsEnabledGlobally` API: ~160 files

These call sites should migrate to the OpenFeature interface (per deprecation notice in `pkg/services/featuremgmt/models.go`).

## Recommended Actions

### Priority 1: Dashboard Legacy Code (highest debt × high churn)
`features/dashboard/` has 10 class components, 6 connect() usages, heavy `any` typing (52+ occurrences), and 177 commits in 6 months. Use the **`migrate-class-components` skill** to convert `DashboardPage`, `DashboardPanel`, `DashboardGrid`, `PanelEditor`, `SubMenu` etc.

### Priority 2: Explore TraceView Modernization
The `TraceView` subtree accounts for the only unsafe lifecycle method, 7 of 16 `stylesFactory` usages, and multiple class components. These are tightly coupled and could be modernized as a batch.

### Priority 3: Oversized Go Files
Split `setting.go` (2432 loc), `dashboard_service.go` (2410 loc), and `storage_backend.go` (2189 loc) into focused submodules. These are non-generated, non-test files that are actively maintained.

### Priority 4: Feature Toggle Cleanup
Remove 3 deprecated feature toggles and migrate ~160 files from `IsEnabled`/`IsEnabledGlobally` to OpenFeature.

### Priority 5: `any` Type Reduction
Target the top 10 files (DashboardModel 23, time_series2 19, DashboardMigrator 16, PanelModel 13, opentsdb/datasource 16) for strict typing. These files are the biggest impediment to type safety.

### Priority 6: Plugin Datasource Class Components
8 datasource editors still use class components (InfluxDB, Graphite, Loki, Tempo, AzureMonitor, CloudMonitoring). Many are Yarn workspaces — modernize them as part of plugin maintenance cycles.

## Change Log

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
