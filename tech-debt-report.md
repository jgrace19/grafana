# Tech Debt Report — all — 2026-04-18

## Hotspots (high debt × high churn)

Priority score = debt signals × log2(commits + 1), lookback = 6 months

| Rank | Area | Signals | Commits (6mo) | Priority Score |
|------|------|---------|----------------|----------------|
| 1 | `pkg/registry/` | 327 | 619 | 3033.29 |
| 2 | `pkg/tests/` | 322 | 517 | 2903.41 |
| 3 | `public/app/plugins/datasource/` | 285 | 193 | 2165.98 |
| 4 | `pkg/storage/` | 241 | 367 | 2054.18 |
| 5 | `pkg/services/ngalert/` | 211 | 185 | 1590.76 |
| 6 | `public/app/features/dashboard/` | 151 | 170 | 1120.1 |
| 7 | `public/app/features/alerting/` | 133 | 270 | 1074.93 |
| 8 | `pkg/services/libraryelements/` | 122 | 16 | 498.67 |
| 9 | `public/app/plugins/panel/` | 115 | 182 | 864.31 |
| 10 | `pkg/api/` | 113 | 147 | 814.67 |

## Frontend Modernization

- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 files
- **stylesFactory**: 16 files

Top class-component buckets:
- `public/app/plugins/datasource/` — 12 files
- `public/app/plugins/panel/` — 11 files
- `public/app/features/dashboard/` — 10 files
- `public/app/features/explore/` — 8 files
- `public/app/core/` — 4 files

Top connect() buckets:
- `public/app/features/dashboard/` — 9 files
- `public/app/features/explore/` — 8 files
- `public/app/features/admin/` — 5 files
- `public/app/features/variables/` — 4 files
- `public/app/features/auth-config/` — 3 files

Unsafe lifecycle files:
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`

Top stylesFactory buckets:
- `public/app/features/explore/` — 7 files
- `public/app/plugins/panel/` — 4 files
- `public/app/features/dashboard/` — 2 files
- `public/app/features/inspector/` — 1 files
- `public/app/features/query/` — 1 files

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 47 files

Top explicit `any` files:
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

## Comment Debt

- **Frontend TODO/FIXME/HACK**: 602 occurrences
- **Backend TODO/FIXME/HACK**: 894 occurrences

Top frontend comment-debt files:
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10

Top backend comment-debt files:
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tsdb/cloudwatch/kinds/dataquery/types_dataquery_gen.go` — 13
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/registry/apis/provisioning/register.go` — 10

## Go Quality

- **nolint directives**: 1275 occurrences
- **Oversized files (>800 loc)**: 66 files
- **Deprecated Go APIs**: 65 files

Top oversized Go files:
- `pkg/tests/apis/provisioning/common/testing.go` — 2835 lines
- `pkg/services/featuremgmt/registry.go` — 2828 lines
- `pkg/storage/unified/testing/storage_backend_sql_compatibility.go` — 2674 lines
- `pkg/apiserver/storage/testing/store_tests.go` — 2667 lines
- `pkg/setting/setting.go` — 2432 lines
- `pkg/services/dashboards/service/dashboard_service.go` — 2410 lines
- `pkg/storage/unified/search/bleve.go` — 2192 lines
- `pkg/storage/unified/resource/storage_backend.go` — 2189 lines
- `pkg/util/xorm/core/core.go` — 2176 lines
- `pkg/storage/unified/testing/storage_backend.go` — 2087 lines
- `pkg/storage/unified/resource/server.go` — 1941 lines
- `pkg/services/ngalert/store/alert_rule.go` — 1873 lines
- `pkg/tests/api/alerting/testing.go` — 1689 lines
- `pkg/services/ngalert/models/testing.go` — 1650 lines
- `pkg/apiserver/storage/testing/watcher_tests.go` — 1639 lines

## Feature Toggles

- **Deprecated toggles with active call sites** (3): `localeFormatPreference`, `prometheusAzureOverrideAudience`, `prometheusTypeMigration`
- **Old IsEnabled API call sites**: 162 files

## Recommended Actions
1. Migrate legacy class components/connect() in highest-priority frontend buckets using the migrate-class-components skill.
2. Modernize Explore TraceView by replacing unsafe lifecycle methods and stylesFactory with hooks and useStyles2.
3. Split oversized high-churn Go files (for example setting.go, dashboard_service.go, and storage backend modules).
4. Clean up deprecated feature toggles and migrate IsEnabled/IsEnabledGlobally call sites to OpenFeature (see pkg/services/featuremgmt/ docs).
5. Reduce explicit any in top offender files and tighten typings around dashboard and datasource models.
6. Address high TODO/FIXME/nolint density in top backend service buckets to reduce maintenance drag.

## Change Log

### 2026-04-18 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | 0 |
| connect() HOC | 41 | 41 | 0 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory | 16 | 16 | 0 |
| Explicit `any` | 393 | 393 | 0 |
| `any` files | 137 | 137 | 0 |
| @deprecated APIs | 51 | 47 | -4 |
| Frontend TODO/FIXME/HACK | 618 | 602 | -16 |
| Backend TODO/FIXME/HACK | 894 | 894 | 0 |
| nolint directives | 1275 | 1275 | 0 |
| Oversized Go files (>800 loc) | 67 | 66 | -1 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 162 | 0 |

**Resolved since last scan:**
- 4 fewer @deprecated frontend API files
- 16 fewer frontend TODO/FIXME/HACK/XXX occurrences
- 1 fewer oversized Go files

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
