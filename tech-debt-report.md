# Tech Debt Report — all — 2026-05-07

## Hotspots (high debt × high churn)

Priority score = debt signals × log2(commits + 1), lookback = 6 months

| Rank | Area | Signals | Commits (6mo) | Priority Score |
|------|------|---------|----------------|----------------|
| 1 | `pkg/registry/` | 177 | 566 | 1619.06 |
| 2 | `pkg/services/ngalert/` | 142 | 176 | 1060.4 |
| 3 | `pkg/storage/` | 107 | 342 | 901.16 |
| 4 | `public/app/features/alerting/` | 90 | 243 | 713.77 |
| 5 | `pkg/tests/` | 73 | 488 | 652.16 |
| 6 | `public/app/plugins/datasource/` | 87 | 169 | 644.62 |
| 7 | `public/app/plugins/panel/` | 76 | 158 | 555.78 |
| 8 | `pkg/api/` | 73 | 134 | 516.61 |
| 9 | `public/app/features/dashboard/` | 64 | 154 | 465.67 |
| 10 | `public/app/core/` | 47 | 161 | 344.97 |

## Frontend Modernization
- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 files
- **stylesFactory**: 16 files

## Type Safety
- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 46 files

Top `any` files:
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
- `pkg/storage/unified/resource/datastore.go` — 10

## Go Quality
- **nolint directives**: 1274 occurrences
- **Oversized files (>800 loc, non-generated)**: 66 files
- **Deprecated Go APIs**: 65 files

Top nolint files:
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_ruler_test.go` — 25
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25

Top oversized files:
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

## Feature Toggles
| Toggle Name | Active Call Sites | Description |
|---|---|---|
| `prometheusAzureOverrideAudience` | 4 files / 4 refs | Deprecated. Allow override default AAD audience for Azure Prometheus endpoint. Enabled by default. This feature shoul... |
| `localeFormatPreference` | 1 files / 1 refs | Specifies the locale so the correct format for numbers and dates can be shown |
| `prometheusTypeMigration` | 1 files / 1 refs | Checks for deprecated Prometheus authentication methods (SigV4 and Azure), installs the relevant data source, and mig... |

- **Old IsEnabled API call sites**: 162 files

## Recommended Actions
1. Migrate remaining dashboard and explore class/connect patterns using the `migrate-class-components` skill, starting with `public/app/features/dashboard/`.
2. Prioritize `pkg/registry/`, `pkg/services/ngalert/`, and `pkg/storage/` debt cleanup because they combine high signal density with high recent churn.
3. Reduce explicit `any` in the top 10 files (notably `DashboardModel.ts`, `time_series2.ts`, and `DashboardMigrator.ts`) to improve type safety in high-impact code paths.
4. Split oversized Go files, beginning with `pkg/services/featuremgmt/registry.go`, `pkg/setting/setting.go`, and `pkg/services/dashboards/service/dashboard_service.go`.
5. Migrate legacy `IsEnabled` / `IsEnabledGlobally` call sites to OpenFeature patterns documented under `pkg/services/featuremgmt/`.
6. Address plugin datasource debt in `public/app/plugins/datasource/`, where comment density and legacy patterns remain high.

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

### 2026-05-07 (current scan)

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
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 162 | 0 |

**Resolved since last scan:**
- 5 fewer @deprecated apis
- 16 fewer frontend todo/fixme/hack
- 1 fewer nolint directives
- 1 fewer oversized go files (>800 loc)

**New since last scan:**
- None
