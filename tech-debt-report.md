# Tech Debt Report — all — 2026-04-23

## Hotspots (high debt × high churn)

Priority score = debt signals × log2(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|--------------------|----------------|
| 1 | `public/app/plugins/datasource/` | 285 | 186 | 2150.86 |
| 2 | `pkg/services/ngalert/` | 211 | 184 | 1589.12 |
| 3 | `public/app/features/dashboard/` | 151 | 165 | 1113.63 |
| 4 | `public/app/features/alerting/` | 132 | 266 | 1064.01 |
| 5 | `public/app/plugins/panel/` | 115 | 171 | 854.02 |
| 6 | `pkg/api/` | 113 | 146 | 813.56 |
| 7 | `public/app/core/` | 82 | 183 | 616.93 |
| 8 | `public/app/features/dashboard-scene/` | 55 | 540 | 499.37 |
| 9 | `pkg/services/libraryelements/` | 122 | 16 | 498.67 |
| 10 | `public/app/features/explore/` | 57 | 101 | 380.33 |

## Frontend Modernization

- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 file
- **stylesFactory**: 16 files

Top class-component areas:
- `public/app/plugins/datasource/` — 12 files
- `public/app/plugins/panel/` — 11 files
- `public/app/features/dashboard/` — 10 files
- `public/app/features/explore/` — 8 files

Top connect() areas:
- `public/app/features/dashboard/` — 9 files
- `public/app/features/explore/` — 8 files
- `public/app/features/admin/` — 5 files
- `public/app/features/variables/` — 4 files

Unsafe lifecycle file:
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`

stylesFactory concentration:
- `public/app/features/explore/` — 7 files
- `public/app/plugins/panel/` — 4 files
- `public/app/features/dashboard/` — 2 files

Use the **`migrate-class-components`** skill for class/connect modernization.

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 46 files

Top `any` files:
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
- **Backend TODO/FIXME/HACK**: 853 occurrences

Top frontend comment-density files:
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18

Top backend comment-density files:
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/services/org/orgimpl/org.go` — 10

## Go Quality

- **nolint directives**: 1,274 occurrences
- **Oversized files (>800 loc)**: 66 files
- **Deprecated Go APIs**: 62 files

Top `nolint` files:
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_ruler_test.go` — 25

Top oversized non-test Go files:
- `pkg/services/featuremgmt/registry.go` — 2828
- `pkg/setting/setting.go` — 2432
- `pkg/services/dashboards/service/dashboard_service.go` — 2410
- `pkg/storage/unified/search/bleve.go` — 2192
- `pkg/storage/unified/resource/storage_backend.go` — 2189
- `pkg/util/xorm/core/core.go` — 2176
- `pkg/storage/unified/resource/server.go` — 1941
- `pkg/services/ngalert/store/alert_rule.go` — 1873
- `pkg/registry/apis/provisioning/register.go` — 1579
- `pkg/storage/unified/resource/search.go` — 1551

## Feature Toggles

- **Deprecated toggles with active call sites**:
  - `prometheusAzureOverrideAudience` — active in:
    - `pkg/tsdb/prometheus/prometheus.go`
    - `pkg/tsdb/prometheus/azureauth/azure.go`
    - `pkg/tsdb/prometheus/azureauth/azure_test.go`
  - `localeFormatPreference` — no active callsites outside registry
  - `prometheusTypeMigration` — no active callsites outside registry
- **Old IsEnabled API call sites**: 162 files

OpenFeature migration context: `pkg/services/featuremgmt/models.go` and `pkg/services/featuremgmt/`.

## Recommended Actions

1. **[P1] Modernize datasource and panel legacy React patterns**
   - Scope: `public/app/plugins/datasource/` and `public/app/plugins/panel/`
   - Why: highest hotspot score, 23 class components combined, dense TODO debt
   - How: apply `migrate-class-components` skill in prioritized batches

2. **[P2] Refactor ngalert and dashboard hotspots**
   - Scope: `pkg/services/ngalert/`, `public/app/features/dashboard/`, `public/app/features/alerting/`
   - Why: high debt + high churn; includes legacy React, TODO density, and large files
   - How: split large files and stage strict-typing improvements alongside behavior-safe cleanup

3. **[P3] Split oversized core Go files**
   - Scope: `setting.go`, `dashboard_service.go`, `storage_backend.go`, `registry.go`
   - Why: 66 oversized files with several high-impact, frequently touched modules
   - How: extract cohesive subpackages and move test helpers to dedicated files

4. **[P4] Remove deprecated feature toggles and migrate old IsEnabled API**
   - Scope: toggle cleanup + 162 `IsEnabled`/`IsEnabledGlobally` call sites
   - Why: deprecation debt and migration risk accumulate over time
   - How: migrate callers to OpenFeature APIs in `pkg/services/featuremgmt/`

5. **[P5] Reduce explicit `any` in top offender files**
   - Scope: top 10 `any` files (`DashboardModel`, `time_series2`, opentsdb/influx files, etc.)
   - Why: concentrated type-safety debt blocks safer refactors
   - How: replace `any` with narrowed domain types and utility generics

## Change Log

### 2026-04-23 (current scan)

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
| Backend TODO/FIXME/HACK | 894 | 853 | -41 |
| nolint directives | 1,275 | 1,274 | -1 |
| Oversized Go files (>800 loc) | 67 | 66 | -1 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 162 | 0 |

**Resolved since last scan:**
- 5 frontend files no longer contain `@deprecated` markers
- 16 frontend and 41 backend TODO/FIXME/HACK signals removed
- 1 oversized Go file moved below the >800-line threshold

**New since last scan:**
- No net new debt categories detected; top hotspots shifted toward plugin datasource and ngalert areas due to churn-weighted scoring updates

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
