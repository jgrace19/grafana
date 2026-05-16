# Tech Debt Report — all — 2026-05-16

## Hotspots (high debt × high churn)
| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|----------------------|----------------|
| 1 | `pkg/registry/` | 365 | 540 | 3314.0 |
| 2 | `pkg/tests/` | 322 | 476 | 2865.1 |
| 3 | `public/app/plugins/datasource/` | 296 | 155 | 2156.5 |
| 4 | `pkg/services/ngalert/` | 250 | 171 | 1856.6 |
| 5 | `pkg/storage/` | 243 | 333 | 2037.2 |
| 6 | `pkg/api/` | 164 | 127 | 1148.0 |
| 7 | `public/app/features/dashboard/` | 155 | 145 | 1114.4 |
| 8 | `public/app/features/alerting/` | 133 | 233 | 1046.8 |
| 9 | `pkg/services/publicdashboards/` | 132 | 9 | 438.5 |
| 10 | `pkg/services/libraryelements/` | 129 | 13 | 491.1 |

## Frontend Modernization
- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 files
- **stylesFactory**: 16 files

Top class-component areas:
- `public/app/plugins/datasource/` — 12 files
- `public/app/plugins/panel/` — 11 files
- `public/app/features/dashboard/` — 10 files
- `public/app/features/explore/` — 8 files
- `public/app/features/variables/` — 4 files
- `public/app/core/` — 4 files

Top connect() areas:
- `public/app/features/dashboard/` — 9 files
- `public/app/features/explore/` — 8 files
- `public/app/features/admin/` — 5 files
- `public/app/features/variables/` — 4 files
- `public/app/features/auth-config/` — 3 files
- `public/app/features/users/` — 2 files

Top stylesFactory areas:
- `public/app/features/explore/` — 7 files
- `public/app/plugins/panel/` — 4 files
- `public/app/features/dashboard/` — 2 files
- `public/app/features/query/` — 1 files
- `public/app/features/inspector/` — 1 files
- `public/app/plugins/datasource/` — 1 files

## Type Safety
- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 46 files

Top `any` hotspots:
- `public/app/features/dashboard/state/DashboardModel.ts` — 23
- `public/app/core/time_series2.ts` — 19
- `public/app/plugins/datasource/opentsdb/datasource.ts` — 16
- `public/app/features/dashboard/state/DashboardMigrator.ts` — 16
- `public/app/features/dashboard/state/PanelModel.ts` — 13
- `public/app/plugins/datasource/influxdb/query_part.ts` — 12
- `public/app/plugins/datasource/influxdb/datasource.ts` — 11
- `public/app/features/dashboard/state/DashboardMigrator.test.ts` — 10
- `public/app/features/alerting/state/query_part.ts` — 10
- `public/app/features/explore/TraceView/components/model/link-patterns.tsx` — 9

## Comment Debt
- **Frontend TODO/FIXME/HACK**: 602 occurrences
- **Backend TODO/FIXME/HACK**: 894 occurrences

Top frontend comment-debt files:
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10
- `public/app/features/panel/panellinks/specs/link_srv.test.ts` — 8
- `public/app/plugins/panel/xychart/SeriesEditor.tsx` — 7
- `public/app/plugins/datasource/azuremonitor/components/MetricsQueryEditor/AdvancedResourcePicker.tsx` — 7

Top backend comment-debt files:
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tsdb/cloudwatch/kinds/dataquery/types_dataquery_gen.go` — 13
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/storage/unified/resource/datastore.go` — 10
- `pkg/services/org/orgimpl/org.go` — 10
- `pkg/registry/apis/provisioning/register.go` — 10
- `pkg/storage/unified/sql/queries.go` — 9

## Go Quality
- **nolint directives**: 1274 occurrences
- **Oversized files (>800 loc)**: 78 files
- **Deprecated Go APIs**: 65 files

Top `nolint` files:
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_ruler_test.go` — 25
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25
- `pkg/tests/api/annotations/annotations_test.go` — 19
- `pkg/services/libraryelements/libraryelements_patch_test.go` — 19
- `pkg/services/annotations/annotationsimpl/xorm_store_test.go` — 17

Largest non-test Go files:
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

## Feature Toggles
- **Deprecated toggles with active call sites**:

| Toggle Name | Description |
|-------------|-------------|
| `panelTitleSearch` | Search for dashboards using panel title |
| `dataplaneAggregator` | Enable grafana dataplane aggregator |
| `unifiedStorageGrpcConnectionPool` | Enables the unified storage grpc connection pool |

- **Old IsEnabled API call sites**: 162 files

## Recommended Actions
1. **Dashboard class/connect modernization** — Dashboard feature has 10 class components, 9 connect() usages, and 26 files with explicit any. Use migrate-class-components skill for class/connect conversion, then tighten typing incrementally.
2. **Explore TraceView modernization** — TraceView subtree contains 4 class components, 7 stylesFactory usages, and 1 unsafe lifecycle call sites. Migrate class components + stylesFactory to hooks/useStyles2 and remove unsafe lifecycle methods.
3. **Oversized Go file decomposition** — There are 78 non-test Go files over 800 LOC; largest include pkg/tests/apis/provisioning/common/testing.go (2835), pkg/services/featuremgmt/registry.go (2828), pkg/apimachinery/utils/meta_mock.go (2779). Extract cohesive submodules by responsibility (registry slices, service helpers, API handlers).
4. **OpenFeature migration** — Old IsEnabled/IsEnabledGlobally APIs are still used in 162 files; deprecated toggles in registry: 3. Follow pkg/services/featuremgmt migration path and replace call sites package-by-package.
5. **Type safety debt reduction** — Explicit any appears 393 times across 137 files; top offenders: public/app/features/dashboard/state/DashboardModel.ts (23), public/app/core/time_series2.ts (19), public/app/plugins/datasource/opentsdb/datasource.ts (16), public/app/features/dashboard/state/DashboardMigrator.ts (16), public/app/features/dashboard/state/PanelModel.ts (13). Prioritize top offenders and replace any with domain types/unknown + narrowing guards.
6. **Datasource plugin class component migration** — Datasource plugins still contain 12 class-based React components. Convert plugin editors incrementally during plugin maintenance cycles, prioritizing high churn plugins.

## Change Log

### 2026-05-16 (current scan)

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
| nolint directives | 1,275 | 1,274 | -1 |
| Oversized Go files (>800 loc) | 67 | 78 | +11 |
| Deprecated feature toggles | 3 | 3 | +0 |
| Old IsEnabled API files | 162 | 162 | +0 |

**Resolved since last scan:**
- None detected from prior cache

**New since last scan:**
- None detected from prior cache

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
