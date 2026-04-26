# Tech Debt Report — All Scopes — 2026-04-26

## Hotspots (high debt × high churn)

Priority score = debt signals × log₂(commits + 1), lookback = 6 months

| Rank | Area | Signals | Commits (6mo) | Priority Score |
|------|------|---------|----------------|----------------|
| 1 | `public/app/plugins/datasource/` | 285 | 181 | 2139.72 |
| 2 | `pkg/services/ngalert/` | 211 | 182 | 1585.81 |
| 3 | `public/app/features/dashboard/` | 151 | 161 | 1108.32 |
| 4 | `public/app/features/alerting/` | 132 | 262 | 1061.14 |
| 5 | `pkg/services/libraryelements/` | 122 | 16 | 498.67 |
| 6 | `public/app/plugins/panel/` | 115 | 166 | 849.13 |
| 7 | `pkg/api/` | 113 | 142 | 809.07 |
| 8 | `public/app/core/` | 82 | 171 | 609 |
| 9 | `public/app/features/explore/` | 57 | 100 | 379.52 |
| 10 | `public/app/features/dashboard-scene/` | 55 | 532 | 498.19 |

## Frontend Modernization

- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 file
- **stylesFactory**: 16 files

Top class-component areas:
- `plugins/datasource/` — 12 files (e.g., ConfigEditor.tsx, VariableQueryEditor.tsx, EditorField.tsx)
- `plugins/panel/` — 11 files (e.g., AnnoListPanel.tsx, BarGaugePanel.tsx, CanvasPanel.tsx)
- `features/dashboard/` — 10 files (e.g., DashboardRow.tsx, VersionsSettings.tsx, PanelEditor.tsx)
- `features/explore/` — 8 files (e.g., Explore.tsx, LiveLogs.tsx, LogsContainer.tsx)
- `core/` — 4 files (e.g., GraphNG.tsx, multiSelect.tsx, select.tsx)
- `features/variables/` — 4 files (e.g., VariableEditorContainer.tsx, VariableEditorEditor.tsx, OptionsPicker.tsx)

Top connect() areas:
- `features/dashboard/` — 9 files (e.g., DashNav.tsx, GeneralSettings.tsx, DeleteDashboardModal.tsx)
- `features/explore/` — 8 files (e.g., Explore.tsx, ExplorePaneContainer.tsx, ExploreQueryInspector.tsx)
- `features/admin/` — 5 files (e.g., UpgradePage.tsx, UserAdminPage.tsx, UserListAdminPage.tsx)
- `features/variables/` — 4 files (e.g., VariableEditorContainer.tsx, VariableEditorEditor.tsx, OptionsPicker.tsx)
- `features/auth-config/` — 3 files (e.g., AuthDrawer.tsx, AuthProvidersListPage.tsx, ErrorContainer.tsx)
- `features/org/` — 2 files (e.g., OrgDetailsPage.tsx, SelectOrgPage.tsx)

Unsafe lifecycle file:
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`

Top stylesFactory areas:
- `features/explore/` — 7 files (e.g., ViewingLayer.tsx, SpanBarRow.tsx, SpanDetailRow.tsx)
- `plugins/panel/` — 4 files (e.g., AnnoListPanel.tsx, GettingStarted.tsx, LiveChannelEditor.tsx)
- `features/dashboard/` — 2 files (e.g., PanelEditor.tsx, SubMenu.tsx)
- `features/inspector/` — 1 files (e.g., styles.ts)
- `features/query/` — 1 files (e.g., QueryGroup.tsx)
- `plugins/datasource/` — 1 files (e.g., MetricTankMetaInspector.tsx)

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 46 files

Worst `any` offenders:
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

## Comment Debt

- **Frontend TODO/FIXME/HACK/XXX**: 602 occurrences
- **Backend TODO/FIXME/HACK/XXX**: 894 occurrences

Frontend highest-density files (sample):
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10
- `public/app/features/panel/panellinks/specs/link_srv.test.ts` — 8
- `public/app/plugins/datasource/azuremonitor/components/MetricsQueryEditor/AdvancedResourcePicker.tsx` — 7
- `public/app/plugins/panel/xychart/SeriesEditor.tsx` — 7

Backend highest-density files (sample):
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tsdb/cloudwatch/kinds/dataquery/types_dataquery_gen.go` — 13
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/registry/apis/provisioning/register.go` — 10
- `pkg/services/org/orgimpl/org.go` — 10
- `pkg/storage/unified/resource/datastore.go` — 10
- `pkg/storage/unified/sql/queries.go` — 9

## Go Quality

- **nolint directives**: 1274 occurrences
- **Oversized files (>800 loc)**: 66 files
- **Deprecated Go APIs**: 65 files

Top `nolint` density files:
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25
- `pkg/tests/api/alerting/api_ruler_test.go` — 25
- `pkg/services/libraryelements/libraryelements_patch_test.go` — 19
- `pkg/tests/api/annotations/annotations_test.go` — 19
- `pkg/services/annotations/annotationsimpl/xorm_store_test.go` — 17
- `pkg/services/preference/prefimpl/store_test.go` — 17
- `pkg/services/preference/prefimpl/pref_test.go` — 16

Largest non-generated Go files (sample):

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

## Feature Toggles

### Deprecated toggles with active call sites

| Toggle | Description | IsEnabled file mentions |
|---|---|---|
| `localeFormatPreference` | Specifies the locale so the correct format for numbers and dates can be shown | 0 |
| `prometheusAzureOverrideAudience` | Deprecated. Allow override default AAD audience for Azure Prometheus endpoint. Enabled by default. This feature should no longer be used and will be removed in the future. | 1 |
| `prometheusTypeMigration` | Checks for deprecated Prometheus authentication methods (SigV4 and Azure), installs the relevant data source, and migrates the Prometheus data sources | 0 |

### Old `IsEnabled`/`IsEnabledGlobally` API call sites: 162 files

## Recommended Actions

1. Migrate dashboard and explore class components/connect() usage using the **`migrate-class-components`** skill.
2. Reduce datasource plugin debt in `public/app/plugins/datasource/` (explicit `any`, TODO hotspots, and legacy class components).
3. Split and modularize oversized Go files (`pkg/setting/setting.go`, `pkg/services/dashboards/service/dashboard_service.go`, `pkg/storage/unified/resource/storage_backend.go`).
4. Clean up deprecated feature toggles and migrate `IsEnabled` / `IsEnabledGlobally` call sites to OpenFeature (`pkg/services/featuremgmt/`).
5. Lower backend suppression debt by reducing `nolint` in high-density areas (`pkg/services/libraryelements/`, `pkg/api/`, `pkg/services/ngalert/`).
6. Target top `any` offenders first (`DashboardModel.ts`, `time_series2.ts`, `DashboardMigrator.ts`, `opentsdb/datasource.ts`).

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

### 2026-04-26 (current scan)

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
| nolint directives | 1275 | 1274 | -1 |
| Oversized Go files (>800 loc) | 67 | 66 | -1 |
| Deprecated Go APIs | 77 | 65 | -12 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 162 | 0 |

**Resolved since last scan:**
- 5 @deprecated apis reduced
- 16 frontend todo/fixme/hack reduced
- 1 nolint directives reduced
- 1 oversized go files (>800 loc) reduced
- 12 deprecated go apis reduced

**New since last scan:**
- None
