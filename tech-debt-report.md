# Tech Debt Report — All Scopes — 2026-04-15

## Hotspots (high debt × high churn)

Priority score = file-scoped debt signals × log₂(commits + 1). Test-only files are excluded from hotspot ranking so the list stays focused on production-facing areas.

| Rank | Area | Debt Signals | Distinct Files | Commits (6mo) | Priority Score |
|------|------|--------------|----------------|---------------|----------------|
| 1 | `pkg/registry/apis/` | 128 | 91 | 535 | 1160.46 |
| 2 | `pkg/services/ngalert/` | 120 | 77 | 185 | 904.70 |
| 3 | `pkg/storage/` | 81 | 50 | 369 | 691.04 |
| 4 | `public/app/plugins/datasource/` | 81 | 69 | 195 | 616.79 |
| 5 | `public/app/features/alerting/` | 76 | 74 | 272 | 615.05 |
| 6 | `public/app/plugins/panel/` | 79 | 71 | 186 | 596.20 |
| 7 | `pkg/api/` | 64 | 33 | 148 | 462.03 |
| 8 | `public/app/features/dashboard/` | 52 | 41 | 173 | 387.03 |
| 9 | `public/app/features/explore/` | 47 | 41 | 110 | 319.34 |
| 10 | `public/app/core/` | 40 | 38 | 191 | 303.40 |

## Frontend Modernization

### Class Components: 61 files

Top areas:
- `public/app/plugins/datasource/` — 12 files (`QueryField`, `AdHocFilter`, `LokiQueryField`, `LokiCheatSheet`, `ConfigEditor`, `FluxQueryEditor`, `FSQLEditor`, `MetricTankMetaInspector`, `VariableQueryEditor`, `EditorField`)
- `public/app/plugins/panel/` — 11 files (`CanvasPanel`, `GeomapPanel`, `LivePanel`, `GettingStarted`, `BarGaugePanel`, `AnnoListPanel`, debug views)
- `public/app/features/dashboard/` — 10 files (`DashboardPage`, `DashboardPanel`, `DashboardGrid`, `PanelEditor`, `SubMenu`, `ShareSnapshot`, `VersionsSettings`, `DashboardRow`, `PanelEditorQueries`, `PanelStateWrapper`)
- `public/app/features/explore/` — 8 files (`Explore`, `LogsContainer`, `LiveLogs`, `TableContainer`, `TraceTimelineViewer`, DraggableManager demos)
- `public/app/features/variables/` — 4 files (`QueryVariableEditor`, `OptionsPicker`, `VariableEditorEditor`, `VariableEditorContainer`)

### connect() HOC (Redux): 44 files

Top areas:
- `public/app/features/explore/` — 10 files (`Explore`, `ExplorePaneContainer`, `ExploreQueryInspector`, `ExploreRunQueryButton`, `LogsContainer`, `NodeGraphContainer`, `RawPrometheusContainer`, `RichHistoryCard`, `RichHistoryContainer`, `TableContainer`)
- `public/app/features/dashboard/` — 9 files (`DashboardPage`, `SoloPanelPage`, `DashboardPanel`, `DashNav`, `GeneralSettings`, `DeleteDashboardModal`, `PanelInspector`, `PanelEditor`, `SubMenu`)
- `public/app/features/admin/` — 5 files (`UserAdminPage`, `UpgradePage`, `UserListAnonymousPage`, `UserListAdminPage`, `LdapSettingsPage`)
- `public/app/features/variables/` — 4 files (`QueryVariableEditor`, `OptionsPicker`, `VariableEditorEditor`, `VariableEditorContainer`)

### Unsafe Lifecycle Methods: 1 file

- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx` — uses `UNSAFE_componentWillReceiveProps`

### Legacy `stylesFactory`: 16 files

- `public/app/features/explore/TraceView/` — 7 files (`SpanBarRow`, `SpanDetailRow`, `SpanTreeOffset`, `VirtualizedTraceView`, `ViewingLayer`, `TimelineViewingLayer`, `TraceTimelineViewer`)
- `public/app/features/dashboard/` — 2 files (`SubMenu`, `PanelEditor`)
- `public/app/plugins/panel/` — 4 files (`LivePanel`, `LiveChannelEditor`, `GettingStarted`, `AnnoListPanel`)
- `public/app/features/query/` — 1 file (`QueryGroup`)
- `public/app/features/inspector/` — 1 file (`styles.ts`)
- `public/app/plugins/datasource/graphite/` — 1 file (`MetricTankMetaInspector`)

## Type Safety

### Explicit `any`: 397 occurrences across 140 files

Worst offenders (non-test files):
- `public/app/features/dashboard/state/DashboardModel.ts` — 23
- `public/app/core/time_series2.ts` — 19
- `public/app/features/dashboard/state/DashboardMigrator.ts` — 16
- `public/app/plugins/datasource/opentsdb/datasource.ts` — 16
- `public/app/features/dashboard/state/PanelModel.ts` — 13
- `public/app/plugins/datasource/influxdb/query_part.ts` — 12
- `public/app/plugins/datasource/influxdb/datasource.ts` — 11
- `public/app/features/alerting/state/query_part.ts` — 10
- `public/app/features/explore/TraceView/components/model/link-patterns.tsx` — 9
- `public/app/plugins/datasource/graphite/graphite_query.ts` — 9

### `@deprecated` APIs: 46 files (non-generated)

Key files with deprecated APIs still defined:
- `public/app/features/dashboard/state/DashboardModel.ts`
- `public/app/core/services/backend_srv.ts`
- `public/app/features/templating/template_srv.ts`
- `public/app/types/events.ts`
- `public/app/core/time_series2.ts`
- `public/app/features/alerting/unified/hooks/useUnifiedAlertingSelector.ts`
- `public/app/features/alerting/unified/utils/datasource.ts`

## Comment Debt

### Frontend TODO/FIXME/HACK/XXX: 602 occurrences across 327 files

Highest-density files (sampled, non-test focus):
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/azuremonitor/components/MetricsQueryEditor/AdvancedResourcePicker.tsx` — 7
- `public/app/plugins/panel/xychart/SeriesEditor.tsx` — 7
- `public/app/features/browse-dashboards/api/browseDashboardsAPI.ts` — 6

### Backend TODO/FIXME/HACK/XXX: 894 occurrences across 453 files

Highest-density non-generated files (sampled):
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/registry/apis/provisioning/register.go` — 10
- `pkg/services/org/orgimpl/org.go` — 10
- `pkg/storage/unified/resource/datastore.go` — 10
- `pkg/storage/unified/sql/queries.go` — 9
- `pkg/registry/apis/provisioning/resources/dualwriter.go` — 8

## Go Quality

### `nolint` Directives: 1,274 occurrences across 486 files

Highest-density non-test files:
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/services/libraryelements/api.go` — 13
- `pkg/services/libraryelements/database.go` — 12
- `pkg/services/navtree/navtreeimpl/navtree.go` — 11
- `pkg/api/dashboard.go` — 8
- `pkg/api/preferences.go` — 8

### Oversized Non-Test Go Files (>800 loc): 68 files

Top actionable files (excluding generated and obvious test harness files):

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

*Note*: `registry.go`, `setting.go`, `dashboard_service.go`, and `register.go` remain the clearest decomposition targets because they are both large and touched frequently.

### Deprecated Go APIs: 65 files (non-generated)

Most concentrated areas are `pkg/services/ngalert/`, `pkg/registry/apis/`, and `pkg/api/`.

## Feature Toggles

### Deprecated Toggles with Active Call Sites

| Toggle Name | Non-registry callsite files | Sample call sites |
|---|---:|---|
| `prometheusAzureOverrideAudience` | 4 | `pkg/tsdb/prometheus/azureauth/azure.go`, `pkg/tsdb/prometheus/prometheus.go`, `public/app/plugins/datasource/prometheus/configuration/AzureAuthSettings.tsx` |
| `localeFormatPreference` | 4 | `public/app/app.ts`, `public/app/core/components/SharedPreferences/SharedPreferencesFunctional.tsx`, `public/app/core/internationalization/dates.ts` |
| `prometheusTypeMigration` | 0 | registry-generated accessor only |

### Old `IsEnabled`/`IsEnabledGlobally` API: 161 files

These call sites should migrate to the OpenFeature interface described in `pkg/services/featuremgmt/models.go`.

## Recommended Actions

### Priority 1: Provisioning registry API hotspot cleanup
`pkg/registry/apis/provisioning/` now carries 52 file-scoped debt signals across 40 files, with 535 commits in the last 6 months flowing through the broader `pkg/registry/apis/` bucket. The area combines comment debt, `nolint` suppressions, and oversized files (`register.go`, `controller/repository.go`). Break the work into smaller provisioning submodules and trim backlog comments as behavior solidifies.

### Priority 2: Reduce debt concentration in `pkg/services/ngalert/`
The `pkg/services/ngalert/` subtree has 120 debt signals across 77 non-test files, including 60 TODO/FIXME/HACK markers, 48 `nolint` suppressions, 16 legacy `IsEnabled` call sites, 6 deprecated APIs, and 12 oversized files. This is currently the highest-risk backend hotspot not already tracked as a dedicated ticket.

### Priority 3: Dashboard legacy code
`public/app/features/dashboard/` still has 10 class components, 9 `connect()` HOC usages, and several of the largest `any` hotspots in the frontend. Use the `migrate-class-components` skill to convert `DashboardPage`, `DashboardPanel`, `DashboardGrid`, `PanelEditor`, `SubMenu`, and related views.

### Priority 4: Alerting/unified type safety and deprecation cleanup
`public/app/features/alerting/unified/` now concentrates 86 debt signals across 84 files, led by 69 TODO/FIXME/HACK comments, 9 files with explicit `any`, 7 files with `@deprecated` APIs, and one remaining class component. This area is active and adjacent to the backend `ngalert` hotspot, so cleanup here will reduce friction on both sides of the alerting stack.

### Priority 5: Explore TraceView modernization
The `TraceView` subtree still owns the repo's only unsafe lifecycle method, 7 of 16 `stylesFactory` usages, and multiple class components. The components are tightly coupled enough that a batch modernization is still the cleanest path.

### Priority 6: Oversized Go files
The count increased again to 68 non-test files over 800 lines. Start with `setting.go`, `dashboard_service.go`, `storage_backend.go`, and `register.go`, where size, churn, and nearby suppressions all overlap.

### Priority 7: Feature toggle cleanup
Three toggles remain deprecated in the registry, and 161 files still use the old `IsEnabled`/`IsEnabledGlobally` API. Continue migrating callers to OpenFeature and remove the registry entries once external call sites are gone.

### Priority 8: `any` type reduction
The frontend now has 397 explicit `any` annotations across 140 files. Focusing on the top 10 files still gives the best return, with dashboard state, `time_series2`, OpenTSDB, InfluxDB, and alerting state remaining the worst offenders.

### Priority 9: Plugin datasource class components
12 datasource plugin editor components still use class components. Many are built-in plugin workspaces, so this work is best handled alongside regular plugin maintenance rather than as a single repo-wide refactor.

## Change Log

### 2026-04-15 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | 0 |
| connect() HOC | 41 | 44 | +3 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory | 16 | 16 | 0 |
| Explicit `any` | 393 | 397 | +4 |
| `any` files | 137 | 140 | +3 |
| @deprecated APIs | 51 | 46 | -5 |
| Frontend TODO/FIXME/HACK | 618 | 602 | -16 |
| Backend TODO/FIXME/HACK | 894 | 894 | 0 |
| nolint directives | 1,275 | 1,274 | -1 |
| Oversized Go files (>800 loc) | 67 | 68 | +1 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 161 | -1 |

**Resolved since last scan:**
- 5 files no longer expose `@deprecated` frontend APIs.
- 16 frontend `TODO`/`FIXME`/`HACK`/`XXX` comments were removed.
- 1 file stopped using the legacy `IsEnabled` API.
- 1 `nolint` suppression was removed.

**New since last scan:**
- 3 additional `react-redux` `connect()` HOC files still need modernization.
- 4 explicit `any` annotations were added across 3 files.
- 1 more non-test Go file crossed the 800 line threshold.

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
