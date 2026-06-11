# Tech Debt Report — All Scopes — 2026-06-11

## Hotspots (high debt × high churn)

Priority score = debt signals × log₂(commits + 1)

| Rank | Area | Debt Signals | Commits (6mo) | Priority Score |
|------|------|-------------|----------------|----------------|
| 1 | `pkg/registry/` | 127 (77 TODO, 48 nolint, 2 deprecated) | 463 | 1125 |
| 2 | `pkg/services/ngalert/` | 114 (60 TODO, 48 nolint, 6 deprecated) | 141 | 815 |
| 3 | `pkg/storage/unified/` | 85 (42 TODO, 41 nolint, 2 deprecated) | 369 | 730 |
| 4 | `public/app/features/alerting/` | 153 (108 TODO, 32 any, 12 @deprecated) | 197 | 1175 |
| 5 | `public/app/features/dashboard/` | 151 (104 any, 10 class, 9 connect, 2 stylesFactory) | 114 | 171 |
| 6 | `public/app/plugins/` | 21 (11 class, 1 connect, 5 stylesFactory) | 253 | 168 |
| 7 | `public/app/features/explore/` | 57 (22 TODO, 8 class, 8 connect, 7 stylesFactory, 1 unsafe) | 75 | 150 |
| 8 | `public/app/core/` | 82 (39 any, 32 TODO, 4 class) | 122 | 35 |
| 9 | `public/app/features/variables/` | 44 (30 any, 4 class, 4 connect) | 17 | 33 |
| 10 | `pkg/setting/` | 15 (setting.go 2432 loc) | 108 | 102 |

## Frontend Modernization

### Class Components: 61 files

Top areas:
- `features/dashboard/` — 10 files (`DashboardPage`, `DashboardPanel`, `DashboardGrid`, `PanelEditor`, `SubMenu`, `ShareSnapshot`, `VersionsSettings`, `DashboardRow`, `PanelEditorQueries`, `PanelStateWrapper`)
- `features/explore/` — 8 files (`Explore`, `LogsContainer`, `LiveLogs`, `TableContainer`, `TraceTimelineViewer`, `TraceView DraggableManager demos`)
- `features/variables/` — 4 files (`QueryVariableEditor`, `OptionsPicker`, `VariableEditorEditor`, `VariableEditorContainer`)
- `plugins/panel/` — 7 files (`CanvasPanel`, `GeomapPanel`, `LivePanel`, `GettingStarted`, `BarGaugePanel`, `AnnoListPanel`, debug panels)
- `plugins/datasource/` — 8 files (InfluxDB, Graphite, Loki, Tempo, AzureMonitor, CloudMonitoring, Pyroscope editors)
- `features/query/` — 3 files (`QueryGroup`, `QueryEditorRows`, `QueryEditorRow`)
- `features/logs/` — 2 files (`LogMessageAnsi`, `LogDetailsRow`)

### connect() HOC (Redux): 41 files

Top areas:
- `features/dashboard/` — 9 files (`DashboardPage`, `DashboardPanel`, `PanelEditor`, `SubMenu`, `DashNav`, `GeneralSettings`, and related)
- `features/explore/` — 8 files (`Explore`, `LogsContainer`, `TableContainer`, `RichHistoryContainer`, `ExploreQueryInspector`, `ExplorePaneContainer`, `NodeGraphContainer`)
- `features/admin/` — 4 files (`UserAdminPage`, `UpgradePage`, `UserListAnonymousPage`, `UserListAdminPage`, `LdapSettingsPage`)
- `features/variables/` — 4 files (`QueryVariableEditor`, `OptionsPicker`, `VariableEditorEditor`, `VariableEditorContainer`)

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

### Explicit `any`: 393 occurrences across 137 files

Worst offenders (by occurrence count):
- `public/app/features/dashboard/state/DashboardModel.ts` — 23
- `public/app/core/time_series2.ts` — 19
- `public/app/plugins/datasource/opentsdb/datasource.ts` — 16
- `public/app/features/dashboard/state/DashboardMigrator.ts` — 16
- `public/app/features/dashboard/state/PanelModel.ts` — 13
- `public/app/plugins/datasource/influxdb/query_part.ts` — 12
- `public/app/plugins/datasource/influxdb/datasource.ts` — 11
- `public/app/features/alerting/state/query_part.ts` — 10
- `public/app/plugins/datasource/graphite/graphite_query.ts` — 9
- `public/app/features/explore/TraceView/components/model/link-patterns.tsx` — 9
- `public/app/features/templating/template_srv.ts` — 8

### `@deprecated` APIs: 51 files (non-generated)

Key files with deprecated APIs still defined:
- `public/app/features/dashboard/state/DashboardModel.ts`
- `public/app/core/services/backend_srv.ts`
- `public/app/features/templating/template_srv.ts`
- `public/app/types/events.ts`
- `public/app/core/time_series2.ts`

## Comment Debt

### Frontend TODO/FIXME/HACK/XXX: 618 occurrences across ~337 files

Highest-density files (sampled):
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18

### Backend TODO/FIXME/HACK/XXX: 894 occurrences across ~453 files

Highest-density files (sampled):
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/storage/unified/testing/kv.go` — 16
- `pkg/tests/api/alerting/api_ruler_test.go` — 25 (test file)
- `pkg/registry/apis/provisioning/register.go` — 10
- `pkg/services/org/orgimpl/org.go` — 10
- `pkg/storage/unified/resource/datastore.go` — 10

## Go Quality

### `nolint` Directives: 1,275 occurrences across ~500+ files

Highest-density files:
- `pkg/tests/api/alerting/api_ruler_test.go` — 25
- `pkg/tests/api/annotations/annotations_test.go` — 19
- `pkg/services/libraryelements/libraryelements_patch_test.go` — 19
- `pkg/services/preference/prefimpl/store_test.go` — 17
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/preference/prefimpl/pref_test.go` — 16
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42

### Oversized Non-Test Go Files (>800 loc): 78 files

Top actionable files (excluding generated code like wire_gen.go, zz_generated*.go):

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

*Note*: `registry.go` (2828 loc) is a feature toggle registry — consider splitting by feature area. `setting.go` (2432 loc) and `dashboard_service.go` (2410 loc) are high-churn files that would benefit from modularization.

### Deprecated Go APIs: 65 files (non-generated)

## Feature Toggles

### Deprecated Toggles (3 active in registry)

| Toggle Name | Description |
|---|---|
| `prometheusAzureOverrideAudience` | "Deprecated. Allow override default AAD audience for Azure Prometheus endpoint. Enabled by default. This feature should no longer be used and will be removed in the future." |
| `localeFormatPreference` | "Specifies the locale so the correct format for numbers and dates can be shown" — paused, will be removed |
| `prometheusTypeMigration` | "Checks for deprecated Prometheus authentication methods (SigV4 and Azure), installs the relevant data source, and migrates the Prometheus data sources" |

### Old `IsEnabled`/`IsEnabledGlobally` API: 162 files

These call sites should migrate to the OpenFeature interface (per deprecation notice in `pkg/services/featuremgmt/models.go`).

## Recommended Actions

### Priority 1: Dashboard Legacy Code (highest frontend debt × churn)
`features/dashboard/` has 10 class components, 9 connect() usages, heavy `any` typing (104 occurrences), and 114 commits in 6 months. Use the **`migrate-class-components` skill** to convert `DashboardPage`, `DashboardPanel`, `DashboardGrid`, `PanelEditor`, `SubMenu` etc.

### Priority 2: Explore TraceView Modernization
The `TraceView` subtree accounts for the only unsafe lifecycle method, 7 of 16 `stylesFactory` usages, and multiple class components. These are tightly coupled and could be modernized as a batch.

### Priority 3: Oversized Go Files
Split `setting.go` (2432 loc), `dashboard_service.go` (2410 loc), and `storage_backend.go` (2189 loc) into focused submodules. These are non-generated, non-test files that are actively maintained.

### Priority 4: Feature Toggle Cleanup
Remove 3 deprecated feature toggles and migrate 162 files from `IsEnabled`/`IsEnabledGlobally` to OpenFeature.

### Priority 5: `any` Type Reduction
Target the top 10 files (DashboardModel 23, time_series2 19, DashboardMigrator 16, PanelModel 13, opentsdb/datasource 16) for strict typing. These files are the biggest impediment to type safety.

### Priority 6: Plugin Datasource Class Components
8 datasource editors still use class components (InfluxDB, Graphite, Loki, Tempo, AzureMonitor, CloudMonitoring). Many are Yarn workspaces — modernize them as part of plugin maintenance cycles.

## Change Log

### 2026-06-11 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | 0 |
| connect() HOC | 41 | 41 | 0 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory | 16 | 16 | 0 |
| Explicit `any` | 393 | 393 | 0 |
| `any` files | 137 | 137 | 0 |
| @deprecated APIs | 51 | 51 | 0 |
| Frontend TODO/FIXME/HACK | 618 | 618 | 0 |
| Backend TODO/FIXME/HACK | 894 | 894 | 0 |
| nolint directives | 1,275 | 1,275 | 0 |
| Oversized Go files (>800 loc) | 67 | 78 | +11 |
| Deprecated Go APIs | 77 | 65 | -12 ✓ |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 162 | 0 |

**Resolved since last scan:**
- 12 files with deprecated Go API markers were cleaned up

**New since last scan:**
- 11 additional Go files now exceed 800 lines (continued growth in `pkg/storage/unified/` and test infrastructure files)

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
