# Tech Debt Report — all — 2026-04-19

## Hotspots (high debt × high churn)

Priority score = debt signals × log2(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|--------------------|----------------|
| 1 | `pkg/registry/` | 328 | 619 | 3043 |
| 2 | `pkg/tests/` | 322 | 517 | 2903 |
| 3 | `public/app/plugins/datasource/` | 285 | 193 | 2166 |
| 4 | `pkg/storage/` | 241 | 367 | 2054 |
| 5 | `pkg/services/ngalert/` | 213 | 185 | 1606 |
| 6 | `public/app/features/dashboard/` | 151 | 170 | 1120 |
| 7 | `public/app/features/alerting/` | 132 | 270 | 1067 |
| 8 | `pkg/services/libraryelements/` | 122 | 16 | 499 |
| 9 | `public/app/plugins/panel/` | 115 | 182 | 864 |
| 10 | `pkg/api/` | 113 | 147 | 815 |

## Frontend Modernization
- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 files
- **stylesFactory**: 16 files

## Type Safety
- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 46 files

Top `any` offenders:
- `public/app/features/dashboard/state/DashboardModel.ts` — 23
- `public/app/core/time_series2.ts` — 19
- `public/app/plugins/datasource/opentsdb/datasource.ts` — 16
- `public/app/features/dashboard/state/DashboardMigrator.ts` — 16
- `public/app/features/dashboard/state/PanelModel.ts` — 13
- `public/app/plugins/datasource/influxdb/query_part.ts` — 12
- `public/app/plugins/datasource/influxdb/datasource.ts` — 11
- `public/app/features/alerting/state/query_part.ts` — 10
- `public/app/features/dashboard/state/DashboardMigrator.test.ts` — 10
- `public/app/features/explore/TraceView/components/model/link-patterns.tsx` — 9

## Comment Debt
- **Frontend TODO/FIXME/HACK**: 602 occurrences
- **Backend TODO/FIXME/HACK**: 894 occurrences

Highest-density frontend files:
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10

Highest-density backend files:
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tsdb/cloudwatch/kinds/dataquery/types_dataquery_gen.go` — 13
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/services/org/orgimpl/org.go` — 10

## Go Quality
- **nolint directives**: 1274 occurrences
- **Oversized files (>800 loc)**: 78 files
- **Deprecated Go APIs**: 65 files

Largest non-test Go files (top 10):
- `pkg/tests/apis/provisioning/common/testing.go` — 2835 lines
- `pkg/services/featuremgmt/registry.go` — 2828 lines
- `pkg/apimachinery/utils/meta_mock.go` — 2779 lines
- `pkg/apimachinery/apis/common/v0alpha1/zz_generated.openapi.go` — 2757 lines
- `pkg/storage/unified/testing/storage_backend_sql_compatibility.go` — 2674 lines
- `pkg/apiserver/storage/testing/store_tests.go` — 2667 lines
- `pkg/setting/setting.go` — 2432 lines
- `pkg/services/dashboards/service/dashboard_service.go` — 2410 lines
- `pkg/storage/unified/search/bleve.go` — 2192 lines
- `pkg/storage/unified/resource/storage_backend.go` — 2189 lines

## Feature Toggles
- **Deprecated toggles with active call sites**: 1
  - `prometheusAzureOverrideAudience` — 3 files: `pkg/tsdb/prometheus/azureauth/azure.go`, `pkg/tsdb/prometheus/azureauth/azure_test.go`, `pkg/tsdb/prometheus/prometheus.go`
- **Old IsEnabled API call sites**: 162 files

## Recommended Actions
1. Migrate dashboard/explore class components and `connect()` usage to hooks with the `migrate-class-components` skill.
2. Modernize Explore TraceView (`UNSAFE_componentWillReceiveProps` + `stylesFactory`) to current React patterns.
3. Split oversized Go modules beginning with `pkg/services/featuremgmt/registry.go`, `pkg/setting/setting.go`, and `pkg/services/dashboards/service/dashboard_service.go`.
4. Migrate `IsEnabled`/`IsEnabledGlobally` call sites to OpenFeature and clean up deprecated toggles in `pkg/services/featuremgmt/`.
5. Reduce explicit `any` in top TypeScript offenders, especially dashboard state and datasource code paths.
6. Reduce TODO/FIXME/HACK and `nolint` concentration in high-churn backend hotspots (`pkg/registry/`, `pkg/services/ngalert/`, `pkg/storage/`).

## Change Log

### 2026-04-19 (current scan)

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
| Oversized Go files (>800 loc) | 67 | 78 | +11 |
| Deprecated feature toggles | 3 | 3 | +0 |
| Old IsEnabled API files | 162 | 162 | +0 |

**Resolved since last scan:**
- None (file-level resolved/new tracking unavailable in previous summary baseline).

**New since last scan:**
- None (file-level resolved/new tracking unavailable in previous summary baseline).

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
