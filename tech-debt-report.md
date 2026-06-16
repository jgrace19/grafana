# Tech Debt Report — all — 2026-06-16

## Hotspots (high debt × high churn)

Priority score = debt signals × log₂(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|--------------------|----------------|
| 1 | `pkg/registry/` | 328 | 450 | 2891.97 |
| 2 | `pkg/tests/` | 322 | 431 | 2819.07 |
| 3 | `public/app/plugins/datasource/` | 285 | 120 | 1971.88 |
| 4 | `pkg/storage/unified/` | 205 | 267 | 1653.55 |
| 5 | `pkg/services/ngalert/` | 213 | 138 | 1516.33 |
| 6 | `public/app/features/dashboard/` | 151 | 110 | 1025.96 |
| 7 | `public/app/features/alerting/` | 132 | 194 | 1004.17 |
| 8 | `public/app/plugins/panel/` | 115 | 133 | 812.60 |
| 9 | `pkg/api/` | 113 | 104 | 758.71 |
| 10 | `pkg/services/libraryelements/` | 122 | 12 | 451.45 |

## Frontend Modernization

### Class Components: 61 files

Top areas:
- `features/dashboard/` — 10 files (DashboardRow.tsx, VersionsSettings.tsx, PanelEditor.tsx, PanelEditorQueries.tsx, ShareSnapshot.tsx, ...)
- `features/explore/` — 8 files (Explore.tsx, LiveLogs.tsx, LogsContainer.tsx, TableContainer.tsx, index.tsx, ...)
- `core/` — 4 files (GraphNG.tsx, multiSelect.tsx, select.tsx, SharedPreferencesOld.tsx)
- `features/variables/` — 4 files (VariableEditorContainer.tsx, VariableEditorEditor.tsx, OptionsPicker.tsx, QueryVariableEditor.tsx)
- `features/query/` — 3 files (QueryEditorRow.tsx, QueryEditorRows.tsx, QueryGroup.tsx)
- `plugins/datasource/influxdb/` — 3 files (ConfigEditor.tsx, FluxQueryEditor.tsx, FSQLEditor.tsx)

### connect() HOC (Redux): 41 files

Top areas:
- `features/dashboard/` — 9 files (DashNav.tsx, GeneralSettings.tsx, DeleteDashboardModal.tsx, PanelInspector.tsx, PanelEditor.tsx, ...)
- `features/explore/` — 8 files (Explore.tsx, ExplorePaneContainer.tsx, ExploreQueryInspector.tsx, LogsContainer.tsx, NodeGraphContainer.tsx, ...)
- `features/admin/` — 5 files (UpgradePage.tsx, UserAdminPage.tsx, UserListAdminPage.tsx, UserListAnonymousPage.tsx, LdapSettingsPage.tsx)
- `features/variables/` — 4 files (VariableEditorContainer.tsx, VariableEditorEditor.tsx, OptionsPicker.tsx, QueryVariableEditor.tsx)
- `features/auth-config/` — 3 files (AuthDrawer.tsx, AuthProvidersListPage.tsx, ErrorContainer.tsx)

### Unsafe Lifecycle Methods: 1 file

- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`

### Legacy `stylesFactory`: 16 files

- `features/explore/` — 7 files (ViewingLayer.tsx, SpanBarRow.tsx, SpanDetailRow.tsx, SpanTreeOffset.tsx, TimelineViewingLayer.tsx, ...)
- `features/dashboard/` — 2 files (PanelEditor.tsx, SubMenu.tsx)
- `plugins/panel/live/` — 2 files (LiveChannelEditor.tsx, LivePanel.tsx)
- `features/inspector/` — 1 files (styles.ts)
- `features/query/` — 1 files (QueryGroup.tsx)
- `plugins/datasource/graphite/` — 1 files (MetricTankMetaInspector.tsx)

## Type Safety

### Explicit `any`: 393 occurrences across 137 files

Worst offenders (by occurrence count):
- `public/app/features/dashboard/state/DashboardModel.ts` — 23
- `public/app/core/time_series2.ts` — 19
- `public/app/features/dashboard/state/DashboardMigrator.ts` — 16
- `public/app/plugins/datasource/opentsdb/datasource.ts` — 16
- `public/app/features/dashboard/state/PanelModel.ts` — 13
- `public/app/plugins/datasource/influxdb/query_part.ts` — 12
- `public/app/plugins/datasource/influxdb/datasource.ts` — 11
- `public/app/features/dashboard/state/DashboardMigrator.test.ts` — 10
- `public/app/features/alerting/state/query_part.ts` — 10
- `public/app/features/explore/TraceView/components/model/link-patterns.tsx` — 9

### `@deprecated` APIs: 46 files (non-generated)

- `public/app/api/clients/playlist/v1/index.ts`
- `public/app/core/components/RolePicker/api.ts`
- `public/app/core/history/richHistoryLocalStorageUtils.ts`
- `public/app/core/services/__mocks__/backend_srv.ts`
- `public/app/core/services/backend_srv.ts`
- `public/app/core/time_series2.ts`
- `public/app/core/utils/kbn.ts`
- `public/app/core/utils/richHistoryTypes.ts`

## Comment Debt

### Frontend TODO/FIXME/HACK/XXX: 602 occurrences

- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10

### Backend TODO/FIXME/HACK/XXX: 894 occurrences

- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tsdb/cloudwatch/kinds/dataquery/types_dataquery_gen.go` — 13
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/storage/unified/resource/datastore.go` — 10

## Go Quality

### `nolint` Directives: 1,274 occurrences

- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25
- `pkg/tests/api/alerting/api_ruler_test.go` — 25

### Oversized Non-Test Go Files (>800 loc): 78 files

Top actionable files (generated files excluded from this table):

| File | Lines |
|------|-------|
| `pkg/tests/apis/provisioning/common/testing.go` | 2835 |
| `pkg/services/featuremgmt/registry.go` | 2828 |
| `pkg/storage/unified/testing/storage_backend_sql_compatibility.go` | 2674 |
| `pkg/apiserver/storage/testing/store_tests.go` | 2667 |
| `pkg/setting/setting.go` | 2432 |
| `pkg/services/dashboards/service/dashboard_service.go` | 2410 |
| `pkg/storage/unified/search/bleve.go` | 2192 |
| `pkg/storage/unified/resource/storage_backend.go` | 2189 |
| `pkg/util/xorm/core/core.go` | 2176 |
| `pkg/storage/unified/testing/storage_backend.go` | 2087 |
| `pkg/storage/unified/resource/server.go` | 1941 |
| `pkg/services/ngalert/store/alert_rule.go` | 1873 |
| `pkg/tests/api/alerting/testing.go` | 1689 |
| `pkg/services/ngalert/models/testing.go` | 1650 |
| `pkg/apiserver/storage/testing/watcher_tests.go` | 1639 |

### Deprecated Go APIs: 65 files (non-generated + generated mix)

## Feature Toggles

### Deprecated Toggles (3 active in registry)

| Toggle Name | Active callsite files |
|---|---|
| `localeFormatPreference` | 1 |
| `prometheusAzureOverrideAudience` | 4 |
| `prometheusTypeMigration` | 1 |

### Old `IsEnabled`/`IsEnabledGlobally` API: 162 files

These call sites should migrate to OpenFeature interfaces (see `pkg/services/featuremgmt/models.go`).

## Recommended Actions

### Priority 1: Migrate dashboard class components to function components
Dashboard still has 10 class components and 9 connect() HOCs in a high-churn area. Use the `migrate-class-components` skill to convert key containers and remove Redux HOCs.

### Priority 2: Modernize Explore TraceView legacy React patterns
TraceView contains the only unsafe lifecycle usage and 7/16 `stylesFactory` usages, plus multiple class components. Refactor this subtree as one migration batch.

### Priority 3: Split oversized Go files in high-churn packages
66+ non-generated oversized Go files remain; prioritize `pkg/setting/setting.go`, `pkg/services/dashboards/service/dashboard_service.go`, and `pkg/storage/unified/resource/storage_backend.go`.

### Priority 4: Clean up deprecated feature toggles
Three toggles are marked deprecated in `pkg/services/featuremgmt/registry.go`; remove callsites and delete stale entries once migration is complete.

### Priority 5: Reduce explicit any usage in top frontend files
393 explicit `any` occurrences persist across 137 files; start with top offenders in dashboard state and datasource implementations.

### Priority 6: Migrate IsEnabled API call sites to OpenFeature
162 backend files still use `IsEnabled`/`IsEnabledGlobally`; migrate to OpenFeature interfaces in `pkg/services/featuremgmt/`.

## Change Log

### 2026-06-16 (current scan)

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
| Oversized Go files (>800 loc) | 78 | 78 | 0 |
| Deprecated Go APIs | 65 | 65 | 0 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 162 | 0 |

**Resolved since last scan:**
- @deprecated APIs decreased by 5 (51 → 46)
- Frontend TODO/FIXME/HACK decreased by 16 (618 → 602)
- nolint directives decreased by 1 (1,275 → 1,274)

**New since last scan:**
- No metric-level increases detected.

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
