# Tech Debt Report — All Scopes — 2026-04-16

## Hotspots (high debt × high churn)

Priority score = debt signals × log₂(commits + 1)

| Rank | Area | Debt Signals | Commits (6mo) | Priority Score |
|------|------|-------------|----------------|----------------|
| 1 | `pkg/registry/` | 327 | 632 | 3043.08 |
| 2 | `pkg/tests/` | 322 | 519 | 2905.20 |
| 3 | `public/app/plugins/datasource/` | 285 | 195 | 2170.19 |
| 4 | `pkg/storage/` | 240 | 369 | 2047.53 |
| 5 | `pkg/services/ngalert/` | 211 | 185 | 1590.76 |
| 6 | `public/app/features/dashboard/` | 151 | 172 | 1122.63 |
| 7 | `public/app/features/alerting/` | 132 | 272 | 1068.24 |
| 8 | `pkg/services/libraryelements/` | 122 | 16 | 498.67 |
| 9 | `public/app/plugins/panel/` | 115 | 186 | 867.89 |
| 10 | `pkg/api/` | 113 | 148 | 815.77 |

## Frontend Modernization

### Class Components: 61 files

- `public/app/AppWrapper.tsx`
- `public/app/core/components/GraphNG/GraphNG.tsx`
- `public/app/core/components/OptionsUI/multiSelect.tsx`
- `public/app/core/components/OptionsUI/select.tsx`
- `public/app/core/components/SharedPreferences/SharedPreferencesOld.tsx`
- `public/app/features/alerting/unified/components/rule-editor/QueryRows.tsx`
- `public/app/features/annotations/components/StandardAnnotationQueryEditor.tsx`
- `public/app/features/dashboard/components/DashboardRow/DashboardRow.tsx`
- `public/app/features/dashboard/components/DashboardSettings/VersionsSettings.tsx`
- `public/app/features/dashboard/components/PanelEditor/PanelEditor.tsx`
- `public/app/features/dashboard/components/PanelEditor/PanelEditorQueries.tsx`
- `public/app/features/dashboard/components/ShareModal/ShareSnapshot.tsx`
- `public/app/features/dashboard/components/SubMenu/SubMenu.tsx`
- `public/app/features/dashboard/containers/DashboardPage.tsx`
- `public/app/features/dashboard/dashgrid/DashboardGrid.tsx`
- ... and 46 more

### connect() HOC (Redux): 41 files

- `public/app/features/admin/UpgradePage.tsx`
- `public/app/features/admin/UserAdminPage.tsx`
- `public/app/features/admin/UserListAdminPage.tsx`
- `public/app/features/admin/UserListAnonymousPage.tsx`
- `public/app/features/admin/ldap/LdapSettingsPage.tsx`
- `public/app/features/auth-config/AuthDrawer.tsx`
- `public/app/features/auth-config/AuthProvidersListPage.tsx`
- `public/app/features/auth-config/ErrorContainer.tsx`
- `public/app/features/dashboard/components/DashNav/DashNav.tsx`
- `public/app/features/dashboard/components/DashboardSettings/GeneralSettings.tsx`
- `public/app/features/dashboard/components/DeleteDashboard/DeleteDashboardModal.tsx`
- `public/app/features/dashboard/components/Inspector/PanelInspector.tsx`
- `public/app/features/dashboard/components/PanelEditor/PanelEditor.tsx`
- `public/app/features/dashboard/components/SubMenu/SubMenu.tsx`
- `public/app/features/dashboard/containers/DashboardPage.tsx`
- ... and 26 more

### Unsafe Lifecycle Methods: 1 files

- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`

### Legacy `stylesFactory`: 16 files

- `public/app/features/dashboard/components/PanelEditor/PanelEditor.tsx`
- `public/app/features/dashboard/components/SubMenu/SubMenu.tsx`
- `public/app/features/explore/TraceView/components/TracePageHeader/SpanGraph/ViewingLayer.tsx`
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/SpanBarRow.tsx`
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/SpanDetailRow.tsx`
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/SpanTreeOffset.tsx`
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/VirtualizedTraceView.tsx`
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/index.tsx`
- `public/app/features/inspector/styles.ts`
- `public/app/features/query/components/QueryGroup.tsx`
- `public/app/plugins/datasource/graphite/components/MetricTankMetaInspector.tsx`
- `public/app/plugins/panel/annolist/AnnoListPanel.tsx`
- `public/app/plugins/panel/gettingstarted/GettingStarted.tsx`
- `public/app/plugins/panel/live/LiveChannelEditor.tsx`
- `public/app/plugins/panel/live/LivePanel.tsx`

## Type Safety

### Explicit `any`: 393 occurrences across 137 files

Worst offenders (top 10):
- `public/app/features/dashboard/state/DashboardModel.ts` — 23
- `public/app/core/time_series2.ts` — 19
- `public/app/plugins/datasource/opentsdb/datasource.ts` — 16
- `public/app/features/dashboard/state/DashboardMigrator.ts` — 16
- `public/app/features/dashboard/state/PanelModel.ts` — 13
- `public/app/plugins/datasource/influxdb/query_part.ts` — 12
- `public/app/plugins/datasource/influxdb/datasource.ts` — 11
- `public/app/features/dashboard/state/DashboardMigrator.test.ts` — 10
- `public/app/features/alerting/state/query_part.ts` — 10
- `public/app/plugins/datasource/graphite/graphite_query.ts` — 9

### `@deprecated` APIs: 46 files

- `public/app/api/clients/playlist/v1/index.ts`
- `public/app/core/components/RolePicker/api.ts`
- `public/app/core/history/richHistoryLocalStorageUtils.ts`
- `public/app/core/services/__mocks__/backend_srv.ts`
- `public/app/core/services/backend_srv.ts`
- `public/app/core/time_series2.ts`
- `public/app/core/utils/kbn.ts`
- `public/app/core/utils/richHistoryTypes.ts`
- `public/app/features/alerting/unified/hooks/useAbilities.ts`
- `public/app/features/alerting/unified/hooks/useHasRuler.ts`
- `public/app/features/alerting/unified/hooks/useUnifiedAlertingSelector.ts`
- `public/app/features/alerting/unified/mocks.ts`
- `public/app/features/alerting/unified/utils/datasource.ts`
- `public/app/features/alerting/unified/utils/k8s/constants.ts`
- `public/app/features/alerting/unified/utils/misc.ts`
- `public/app/features/apiserver/types.ts`
- `public/app/features/browse-dashboards/fixtures/dashboardsTreeItem.fixture.ts`
- `public/app/features/dashboard-scene/mutation-api/commands/schemas.ts`
- `public/app/features/dashboard-scene/utils/utils.ts`
- `public/app/features/dashboard/state/DashboardModel.ts`
- ... and 26 more

## Comment Debt

### Frontend TODO/FIXME/HACK/XXX: 602 occurrences across 327 files

- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10
- `public/app/features/panel/panellinks/specs/link_srv.test.ts` — 8
- `public/app/plugins/panel/xychart/SeriesEditor.tsx` — 7
- `public/app/plugins/datasource/azuremonitor/components/MetricsQueryEditor/AdvancedResourcePicker.tsx` — 7
- `public/app/plugins/panel/geomap/layers/data/networkLayer.tsx` — 6
- `public/app/features/search/service/unified.ts` — 6

### Backend TODO/FIXME/HACK/XXX: 851 occurrences across 441 files

- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/registry/apis/provisioning/register.go` — 10
- `pkg/storage/unified/resource/datastore.go` — 10
- `pkg/services/org/orgimpl/org.go` — 10
- `pkg/storage/unified/sql/queries.go` — 9
- `pkg/registry/apis/provisioning/resources/dualwriter.go` — 8
- `pkg/registry/apps/dashvalidator/register_test.go` — 7
- `pkg/registry/apis/secret/service/secure_value.go` — 7

## Go Quality

### `nolint` Directives: 1274 occurrences across 486 files

- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_ruler_test.go` — 25
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25
- `pkg/tests/api/annotations/annotations_test.go` — 19
- `pkg/services/libraryelements/libraryelements_patch_test.go` — 19
- `pkg/services/annotations/annotationsimpl/xorm_store_test.go` — 17
- `pkg/services/preference/prefimpl/store_test.go` — 17
- `pkg/storage/unified/testing/kv.go` — 16

### Oversized Non-Test Go Files (>800 loc): 66 files

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
| `pkg/registry/apis/provisioning/register.go` | 1579 |
| `pkg/storage/unified/resource/search.go` | 1551 |
| `pkg/services/live/live.go` | 1477 |
| `pkg/storage/unified/sql/backend.go` | 1426 |
| `pkg/services/ngalert/api/prometheus/api_prometheus.go` | 1395 |

... and 46 more oversized files

### Deprecated Go APIs: 58 files

- `pkg/api/api.go`
- `pkg/api/dashboard.go`
- `pkg/api/dashboard_permission.go`
- `pkg/api/dataproxy.go`
- `pkg/api/datasource/connections.go`
- `pkg/api/datasources.go`
- `pkg/api/dtos/dashboard.go`
- `pkg/api/dtos/folder.go`
- `pkg/api/dtos/frontend_settings.go`
- `pkg/api/dtos/prefs.go`
- `pkg/api/folder.go`
- `pkg/api/folder_permission.go`
- `pkg/api/playlist.go`
- `pkg/api/search.go`
- `pkg/apimachinery/identity/requester.go`
- `pkg/apimachinery/utils/manager.go`
- `pkg/apimachinery/utils/meta.go`
- `pkg/apis/iam/v0alpha1/types_display.go`
- `pkg/plugins/repo/service_test.go`
- `pkg/registry/apis/iam/team_search.go`
- ... and 38 more

## Feature Toggles

### Deprecated Toggles (3 active in registry)

- `prometheusAzureOverrideAudience`
- `localeFormatPreference`
- `prometheusTypeMigration`

### Old `IsEnabled`/`IsEnabledGlobally` API: 160 files

- `pkg/api/api.go`
- `pkg/api/common_test.go`
- `pkg/api/dashboard.go`
- `pkg/api/dashboard_snapshot.go`
- `pkg/api/datasources_k8s.go`
- `pkg/api/ds_query.go`
- `pkg/api/folder_permission.go`
- `pkg/api/frontendsettings.go`
- `pkg/api/frontendsettings_test.go`
- `pkg/api/index.go`
- `pkg/api/login.go`
- `pkg/api/login_oauth.go`
- `pkg/api/pluginproxy/pluginproxy.go`
- `pkg/api/plugins.go`
- `pkg/api/short_url.go`
- `pkg/expr/converter.go`
- `pkg/expr/dataplane.go`
- `pkg/expr/graph.go`
- `pkg/expr/nodes.go`
- `pkg/operators/provisioning/jobs_operator.go`
- ... and 140 more

## Recommended Actions

1. **Modernize dashboard legacy React code** — use the `migrate-class-components` skill on `public/app/features/dashboard/` where class components and `connect()` usage remain concentrated.
2. **Refactor high-signal backend services** — prioritize `pkg/services/ngalert/`, `pkg/services/featuremgmt/`, and `pkg/services/dashboards/` where TODO/nolint and large-file pressure combine with churn.
3. **Reduce explicit `any` in top offenders** — start with `DashboardModel.ts`, `DashboardMigrator.ts`, `PanelModel.ts`, and `core/time_series2.ts`.
4. **Migrate old feature toggle calls** — replace `IsEnabled`/`IsEnabledGlobally` usage with OpenFeature APIs (`pkg/services/featuremgmt/`).
5. **Split oversized Go files** — especially `registry.go`, `setting.go`, and `dashboard_service.go` into cohesive modules.

## Change Log

### 2026-04-16 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | +0 |
| connect() HOC | 41 | 41 | +0 |
| Unsafe lifecycles | 1 | 1 | +0 |
| stylesFactory | 16 | 16 | +0 |
| Explicit `any` | 393 | 393 | +0 |
| `any` files | 137 | 137 | +0 |
| @deprecated APIs | 51 | 46 | -5 |
| Frontend TODO/FIXME/HACK | 618 | 602 | -16 |
| Backend TODO/FIXME/HACK | 894 | 851 | -43 |
| nolint directives | 1275 | 1274 | -1 |
| Oversized Go files (>800 loc) | 67 | 66 | -1 |
| Deprecated feature toggles | 3 | 3 | +0 |
| Old IsEnabled API files | 162 | 160 | -2 |

**Resolved since last scan:**
- @deprecated API files decreased by 5
- Frontend TODO/FIXME/HACK/XXX decreased by 16
- Backend TODO/FIXME/HACK/XXX decreased by 43
- nolint directives decreased by 1
- Oversized Go files decreased by 1
- Old IsEnabled API files decreased by 2

**New since last scan:**
- None


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
