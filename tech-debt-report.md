# Tech Debt Report — all — 2026-06-01

## Hotspots (high debt × high churn)
| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|--------------------|----------------|
| 1 | `pkg/registry/` | 327 | 505 | 2937.44 |
| 2 | `pkg/tests/` | 322 | 461 | 2850.26 |
| 3 | `public/app/plugins/datasource/` | 285 | 141 | 2037.68 |
| 4 | `pkg/storage/` | 240 | 309 | 1986.27 |
| 5 | `pkg/services/ngalert/` | 211 | 151 | 1529.31 |
| 6 | `public/app/features/dashboard/` | 151 | 128 | 1058.7 |
| 7 | `public/app/features/alerting/` | 132 | 212 | 1020.98 |
| 8 | `public/app/plugins/panel/` | 115 | 141 | 822.22 |
| 9 | `pkg/api/` | 113 | 116 | 776.35 |
| 10 | `pkg/services/libraryelements/` | 122 | 12 | 451.45 |

## Frontend Modernization
- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 files
- **stylesFactory**: 16 files

## Type Safety
- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 46 files

## Comment Debt
- **Frontend TODO/FIXME/HACK**: 602 occurrences
- **Backend TODO/FIXME/HACK**: 894 occurrences

## Go Quality
- **nolint directives**: 1274 occurrences
- **Oversized files (>800 loc)**: 66 files
- **Deprecated Go APIs**: 65 files

## Feature Toggles
- **Deprecated toggles with active call sites**:
  - `azureMonitorLogsBuilderEditor`
  - `prometheusAzureOverrideAudience`
  - `prometheusTypeMigration`
- **Old IsEnabled API call sites**: 162 files

## Recommended Actions
1. **Migrate dashboard class/connect components to hooks**
   - What: public/app/features/dashboard legacy React components
   - Why: 10 class components and 9 connect() usages in dashboard area
   - How: Use migrate-class-components skill to convert class components and connect() HOCs to hooks/selectors
   - Scope: ~15 files
   - Suggested estimate: 3 points
2. **Modernize Explore TraceView legacy lifecycle and stylesFactory**
   - What: public/app/features/explore/TraceView subtree
   - Why: 7 stylesFactory files and 1 unsafe lifecycle files
   - How: Refactor to useStyles2 and React hooks; remove UNSAFE lifecycle methods
   - Scope: ~7 files
   - Suggested estimate: 2 points
3. **Split oversized Go files in high-churn services**
   - What: largest non-test Go files over 800 LOC
   - Why: 66 oversized files; top files exceed 1.5k LOC
   - How: Extract cohesive submodules by domain boundaries and keep API-compatible facades
   - Scope: ~66 files
   - Suggested estimate: 8 points
4. **Migrate legacy IsEnabled API calls to OpenFeature**
   - What: pkg/** call sites of IsEnabled / IsEnabledGlobally
   - Why: 162 files still use deprecated feature toggle accessors
   - How: Follow pkg/services/featuremgmt migration docs and replace deprecated calls with OpenFeature
   - Scope: ~162 files
   - Suggested estimate: 13 points
5. **Reduce explicit any in top frontend hotspots**
   - What: public/app top any-heavy files
   - Why: 393 explicit any occurrences across 137 files
   - How: Start with the top 10 offender files using narrow interfaces and unknown + type guards before widening rollout
   - Scope: ~10 files (phase 1)
   - Suggested estimate: 3 points

## Detailed Findings (Top Samples)

### Top explicit `any` files
- `public/app/features/dashboard/state/DashboardModel.ts` — 23
- `public/app/core/time_series2.ts` — 19
- `public/app/plugins/datasource/opentsdb/datasource.ts` — 16
- `public/app/features/dashboard/state/DashboardMigrator.ts` — 16
- `public/app/features/dashboard/state/PanelModel.ts` — 13
- `public/app/plugins/datasource/influxdb/query_part.ts` — 12
- `public/app/plugins/datasource/influxdb/datasource.ts` — 11
- `public/app/features/alerting/state/query_part.ts` — 10
- `public/app/features/dashboard/state/DashboardMigrator.test.ts` — 10
- `public/app/plugins/datasource/graphite/graphite_query.ts` — 9
- `public/app/features/explore/TraceView/components/model/link-patterns.tsx` — 9
- `public/app/plugins/datasource/influxdb/influx_series.ts` — 8

### Top frontend TODO/FIXME/HACK files
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10
- `public/app/features/panel/panellinks/specs/link_srv.test.ts` — 8
- `public/app/plugins/panel/xychart/SeriesEditor.tsx` — 7
- `public/app/plugins/datasource/azuremonitor/components/MetricsQueryEditor/AdvancedResourcePicker.tsx` — 7

### Top backend TODO/FIXME/HACK files
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tsdb/cloudwatch/kinds/dataquery/types_dataquery_gen.go` — 13
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/registry/apis/provisioning/register.go` — 10
- `pkg/services/org/orgimpl/org.go` — 10
- `pkg/storage/unified/resource/datastore.go` — 10
- `pkg/storage/unified/sql/queries.go` — 9

### Top `nolint` files
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_ruler_test.go` — 25
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25
- `pkg/services/libraryelements/libraryelements_patch_test.go` — 19
- `pkg/tests/api/annotations/annotations_test.go` — 19
- `pkg/services/annotations/annotationsimpl/xorm_store_test.go` — 17
- `pkg/services/preference/prefimpl/store_test.go` — 17
- `pkg/storage/unified/testing/kv.go` — 16

### Top oversized Go files (>800 LOC)
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

## Change Log

### 2026-06-01 (current scan)

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
| Backend TODO/FIXME/HACK | 894 | 894 | +0 |
| nolint directives | 1275 | 1274 | -1 |
| Oversized Go files (>800 loc) | 67 | 66 | -1 |
| Deprecated feature toggles | 3 | 3 | +0 |
| Old IsEnabled API files | 162 | 162 | +0 |

**Resolved since last scan:**
- None detected from file-level sections in prior report

**New since last scan:**
- deprecated_api_files: `public/app/api/clients/playlist/v1/index.ts`
- deprecated_api_files: `public/app/core/components/RolePicker/api.ts`
- deprecated_api_files: `public/app/core/history/richHistoryLocalStorageUtils.ts`
- deprecated_api_files: `public/app/core/services/__mocks__/backend_srv.ts`
- deprecated_api_files: `public/app/core/utils/kbn.ts`
- deprecated_api_files: `public/app/core/utils/richHistoryTypes.ts`
- deprecated_api_files: `public/app/features/alerting/unified/hooks/useAbilities.ts`
- deprecated_api_files: `public/app/features/alerting/unified/hooks/useHasRuler.ts`
- deprecated_api_files: `public/app/features/alerting/unified/hooks/useUnifiedAlertingSelector.ts`
- deprecated_api_files: `public/app/features/alerting/unified/mocks.ts`
- deprecated_api_files: `public/app/features/alerting/unified/utils/datasource.ts`
- deprecated_api_files: `public/app/features/alerting/unified/utils/k8s/constants.ts`
- deprecated_api_files: `public/app/features/alerting/unified/utils/misc.ts`
- deprecated_api_files: `public/app/features/apiserver/types.ts`
- deprecated_api_files: `public/app/features/browse-dashboards/fixtures/dashboardsTreeItem.fixture.ts`
- oversized_go_files: `pkg/api/datasources.go`
- oversized_go_files: `pkg/api/frontendsettings.go`
- oversized_go_files: `pkg/api/http_server.go`
- oversized_go_files: `pkg/apimachinery/utils/meta.go`
- oversized_go_files: `pkg/apiserver/storage/testing/store_tests.go`

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
