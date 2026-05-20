# Tech Debt Report — all — 2026-05-20

## Hotspots (high debt × high churn)

Priority score = debt signals × log₂(commits + 1), lookback = 6 months

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|--------------------|----------------|
| 1 | `pkg/registry/` | 177 | 531 | 1602.78 |
| 2 | `pkg/services/ngalert/` | 142 | 163 | 1044.77 |
| 3 | `pkg/storage/` | 104 | 327 | 869.19 |
| 4 | `public/app/features/alerting/` | 90 | 227 | 704.96 |
| 5 | `public/app/plugins/datasource/` | 87 | 148 | 628.07 |
| 6 | `pkg/tests/` | 69 | 469 | 612.48 |
| 7 | `public/app/plugins/panel/` | 76 | 146 | 547.18 |
| 8 | `pkg/api/` | 73 | 122 | 506.80 |
| 9 | `public/app/features/dashboard/` | 64 | 137 | 454.95 |
| 10 | `public/app/core/` | 47 | 141 | 336.04 |

## Frontend Modernization
- **Class components**: 61 files
  - `plugins/datasource/` — 12 files
  - `plugins/panel/` — 11 files
  - `features/dashboard/` — 10 files
  - `features/explore/` — 8 files
  - `core/` — 4 files
  - `features/variables/` — 4 files
- **connect() HOC**: 41 files
  - `features/dashboard/` — 9 files
  - `features/explore/` — 8 files
  - `features/admin/` — 5 files
  - `features/variables/` — 4 files
  - `features/auth-config/` — 3 files
  - `features/org/` — 2 files
- **Unsafe lifecycles**: 1 file
  - `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`
- **stylesFactory**: 16 files
  - `features/explore/` — 7 files
  - `plugins/panel/` — 4 files
  - `features/dashboard/` — 2 files
  - `features/inspector/` — 1 files
  - `features/query/` — 1 files
  - `plugins/datasource/` — 1 files

## Type Safety
- **Explicit `any`**: 393 occurrences across 137 files
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
- **@deprecated APIs**: 46 files
  - `public/app/api/clients/playlist/v1/index.ts`
  - `public/app/core/components/RolePicker/api.ts`
  - `public/app/core/history/richHistoryLocalStorageUtils.ts`
  - `public/app/core/services/__mocks__/backend_srv.ts`
  - `public/app/core/services/backend_srv.ts`
  - `public/app/core/time_series2.ts`
  - `public/app/core/utils/kbn.ts`
  - `public/app/core/utils/richHistoryTypes.ts`

## Comment Debt
- **Frontend TODO/FIXME/HACK**: 602 occurrences
  - `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
  - `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
  - `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
  - `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
  - `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10
- **Backend TODO/FIXME/HACK**: 894 occurrences
  - `pkg/storage/secret/metadata/query.go` — 17
  - `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
  - `pkg/tsdb/cloudwatch/kinds/dataquery/types_dataquery_gen.go` — 13
  - `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
  - `pkg/registry/apis/provisioning/register.go` — 10

## Go Quality
- **nolint directives**: 1274 occurrences
  - `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
  - `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
  - `pkg/services/dashboards/service/dashboard_service.go` — 26
  - `pkg/tests/api/alerting/api_ruler_test.go` — 25
  - `pkg/tests/api/alerting/api_prometheus_test.go` — 25
- **Oversized files (>800 loc)**: 57 files

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
- **Deprecated Go APIs**: 65 files

## Feature Toggles
- **Deprecated toggles with active call sites**:
  - `localeFormatPreference` — no non-test, non-generated call-site files detected
  - `prometheusAzureOverrideAudience` — 2 non-test, non-generated call-site files
    - `pkg/tsdb/prometheus/azureauth/azure.go`
    - `pkg/tsdb/prometheus/prometheus.go`
  - `prometheusTypeMigration` — no non-test, non-generated call-site files detected
- **Old IsEnabled API call sites**: 162 files

## Recommended Actions
1. [Tech Debt] Decompose oversized Go hotspots in `pkg/registry/` and `pkg/services/ngalert/` (start with non-test files >800 LOC and heavy nolint density).
2. [Tech Debt] Migrate dashboard and explore class components/connect() usage to hooks + RTK patterns using the `migrate-class-components` skill.
3. [Tech Debt] Replace TraceView `stylesFactory` and unsafe lifecycle usage with `useStyles2` and hook-based updates.
4. [Tech Debt] Reduce explicit `any` in the top 10 offender files (DashboardModel, DashboardMigrator, time_series2, datasource editors).
5. [Tech Debt] Retire deprecated feature toggles and migrate `IsEnabled`/`IsEnabledGlobally` call sites to OpenFeature (`pkg/services/featuremgmt/` migration guidance).
6. [Tech Debt] Burn down TODO/FIXME/HACK backlog in high-churn buckets (`public/app/features/alerting/`, `pkg/storage/`, datasource plugins).

## Change Log

### 2026-05-20 (current scan)

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
| Oversized Go files (>800 loc) | 67 | 57 | -10 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 162 | 0 |

**Resolved since last scan:**
- 5 fewer @deprecated apis
- 16 fewer frontend todo/fixme/hack
- 1 fewer nolint directives
- 10 fewer oversized go files (>800 loc)

**New since last scan:** None

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
