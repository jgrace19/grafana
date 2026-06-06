# Tech Debt Report — all — 2026-06-06

## Hotspots (high debt × high churn)

Priority score = debt signals × log₂(commits + 1), lookback = 6 months.

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|--------------------|----------------|
| 1 | `pkg/registry/` | 327 (134 files) | 487 | 2920.35 |
| 2 | `pkg/tests/` | 322 (62 files) | 449 | 2838.04 |
| 3 | `public/app/plugins/datasource/` | 285 (75 files) | 128 | 1998.2 |
| 4 | `pkg/storage/` | 240 (72 files) | 302 | 1978.36 |
| 5 | `pkg/services/ngalert/` | 211 (95 files) | 146 | 1519.13 |
| 6 | `public/app/features/dashboard/` | 151 (52 files) | 120 | 1044.75 |
| 7 | `public/app/features/alerting/` | 132 (88 files) | 202 | 1011.82 |
| 8 | `pkg/services/libraryelements/` | 122 (14 files) | 12 | 451.45 |
| 9 | `public/app/plugins/panel/` | 115 (68 files) | 138 | 818.68 |
| 10 | `pkg/api/` | 113 (38 files) | 109 | 766.29 |

## Frontend Modernization

- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 files
- **stylesFactory**: 16 files

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 46 files

Top explicit `any` files (current scan):
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

## Comment Debt

- **Frontend TODO/FIXME/HACK**: 602 occurrences
- **Backend TODO/FIXME/HACK**: 851 occurrences

Highest-density frontend files:
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10

Highest-density backend files:
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/services/org/orgimpl/org.go` — 10
- `pkg/registry/apis/provisioning/register.go` — 10

## Go Quality

- **nolint directives**: 1,274 occurrences
- **Oversized files (>800 loc)**: 66 files
- **Deprecated Go APIs**: 58 files

Highest-density `nolint` files:
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_ruler_test.go` — 25
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25

Top oversized non-test Go files:
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

- **Deprecated toggles with active call sites**:
  - `prometheusAzureOverrideAudience` — 3 active callsite files
  - `localeFormatPreference` — 0 active callsite files
  - `prometheusTypeMigration` — 0 active callsite files
- **Old IsEnabled API call sites**: 161 files

## Recommended Actions

1. **Migrate dashboard class components and connect() HOCs** (use `migrate-class-components` skill)
   - Scope: `public/app/features/dashboard/` (~15 files)
   - Why: 10 class components and 9 connect() usages in a top hotspot
   - How: Use migrate-class-components skill to convert class/connect patterns to hooks
2. **Modernize Explore TraceView legacy React patterns**
   - Scope: `public/app/features/explore/` (~7 files)
   - Why: 7 stylesFactory files and 1 unsafe lifecycle files
   - How: Replace stylesFactory with useStyles2 and remove unsafe lifecycle usage
3. **Reduce explicit any usage in highest-churn frontend areas**
   - Scope: `public/app/features/dashboard/` (~25 files)
   - Why: 393 explicit any occurrences across 137 files
   - How: Prioritize top offenders and replace any with concrete or generic-safe types
4. **Split oversized Go files in actively changed services**
   - Scope: `pkg/services/` (~20 files)
   - Why: 66 non-test Go files exceed 800 LOC
   - How: Extract cohesive modules from large files; keep behavior unchanged
5. **Migrate old IsEnabled APIs to OpenFeature interfaces** (see `pkg/services/featuremgmt/` migration docs)
   - Scope: `pkg/` (~161 files)
   - Why: 161 files still call IsEnabled/IsEnabledGlobally
   - How: Follow pkg/services/featuremgmt OpenFeature migration path
6. **Clean up deprecated feature toggles and residual call sites** (see `pkg/services/featuremgmt/` migration docs)
   - Scope: `pkg/services/featuremgmt/` (~3 files)
   - Why: 3 toggles marked FeatureStageDeprecated
   - How: Remove deprecated toggles and update dependent call sites before removal

## Change Log

### 2026-06-06 (current scan)

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
| Old IsEnabled API files | 162 | 161 | -1 |

**Resolved since last scan:**
- deprecated_api_files: 5 fewer
- frontend_comment_debt: 16 fewer
- backend_comment_debt: 43 fewer
- nolint_count: 1 fewer
- oversized_go_files: 1 fewer
- old_isenabled_files: 1 fewer

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
