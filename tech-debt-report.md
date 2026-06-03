# Tech Debt Report — all — 2026-06-03

## Hotspots (high debt x high churn)

Priority score = debt signals x log2(commits + 1)

| Rank | Area | Debt Signals | Commits (6 months) | Priority Score |
|------|------|--------------|--------------------|----------------|
| 1 | `pkg/registry/` | 327 | 500 | 2932.75 |
| 2 | `pkg/tests/` | 322 | 454 | 2843.17 |
| 3 | `public/app/plugins/datasource/` | 285 | 140 | 2034.77 |
| 4 | `pkg/storage/` | 240 | 307 | 1984.03 |
| 5 | `pkg/services/ngalert/` | 211 | 148 | 1523.24 |
| 6 | `public/app/features/dashboard/` | 151 | 125 | 1053.57 |
| 7 | `public/app/features/alerting/` | 132 | 206 | 1015.54 |
| 8 | `public/app/plugins/panel/` | 115 | 140 | 821.05 |
| 9 | `pkg/api/` | 113 | 112 | 770.68 |
| 10 | `pkg/services/libraryelements/` | 122 | 12 | 451.45 |

## Frontend Modernization

### Class Components: 61 files

Top areas by file count:
- `plugins/datasource/` — 12
- `plugins/panel/` — 11
- `features/dashboard/` — 10
- `features/explore/` — 8
- `features/variables/` — 4
- `core/` — 4

### connect() HOC (Redux): 41 files

Top areas by file count:
- `features/dashboard/` — 9
- `features/explore/` — 8
- `features/admin/` — 5
- `features/variables/` — 4
- `features/auth-config/` — 3

### Unsafe Lifecycle Methods: 1 file

- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`

### Legacy `stylesFactory`: 16 files

Top areas by file count:
- `features/explore/` — 7
- `plugins/panel/` — 4
- `features/dashboard/` — 2
- `features/inspector/` — 1
- `features/query/` — 1
- `plugins/datasource/` — 1

## Type Safety

### Explicit `any`: 393 occurrences across 137 files

Worst offenders:
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

### `@deprecated` APIs: 46 files (non-generated)

Representative files:
- `public/app/core/services/backend_srv.ts`
- `public/app/core/time_series2.ts`
- `public/app/core/utils/kbn.ts`
- `public/app/features/alerting/unified/hooks/useAbilities.ts`
- `public/app/api/clients/playlist/v1/index.ts`

## Comment Debt

### Frontend TODO/FIXME/HACK/XXX: 602 occurrences

Highest-density files (sample):
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18

### Backend TODO/FIXME/HACK/XXX: 894 occurrences

Highest-density files (sample):
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tsdb/cloudwatch/kinds/dataquery/types_dataquery_gen.go` — 13
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/storage/unified/resource/datastore.go` — 10
- `pkg/registry/apis/provisioning/register.go` — 10

## Go Quality

### `nolint` Directives: 1,274 occurrences

Highest-density files:
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25
- `pkg/tests/api/alerting/api_ruler_test.go` — 25

### Oversized Non-Test Go Files (>800 loc): 66 files

Top actionable files (excluding generated headers and `_test.go`):

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
| `pkg/registry/apis/provisioning/register.go` | 1579 |
| `pkg/storage/unified/resource/search.go` | 1551 |
| `pkg/services/live/live.go` | 1477 |
| `pkg/storage/unified/sql/backend.go` | 1426 |
| `pkg/services/ngalert/api/prometheus/api_prometheus.go` | 1395 |
| `pkg/services/ngalert/models/alert_rule.go` | 1322 |
| `pkg/api/dashboard.go` | 1290 |

### Deprecated Go APIs: 65 files (non-generated)

## Feature Toggles

### Deprecated Toggles with active call sites

| Toggle Name | Call sites | Files | Notes |
|---|---:|---:|---|
| `prometheusAzureOverrideAudience` | 2 | 2 | Deprecated. Allow override default AAD audience for Azure Prometheus endpoint. |
| `localeFormatPreference` | 1 | 1 | Locale-driven date/number formatting feature flagged for removal. |
| `prometheusTypeMigration` | 1 | 1 | Deprecated migration toggle for Prometheus auth methods. |

### Old `IsEnabled`/`IsEnabledGlobally` API: 162 files

These call sites should migrate to OpenFeature interfaces (see `pkg/services/featuremgmt/`).

## Recommended Actions

1. **Migrate Dashboard legacy React patterns**  
   `public/app/features/dashboard/` remains high-churn and high-debt. Prioritize class components + `connect()` migration using the `migrate-class-components` skill.

2. **Modernize Explore TraceView lifecycle + styles stack**  
   `TraceView` still holds the lone unsafe lifecycle usage and most `stylesFactory` use. Convert this subtree as one batch.

3. **Split largest high-churn backend files**  
   Prioritize `registry.go`, `setting.go`, `dashboard_service.go`, and `storage_backend.go` into smaller units to reduce review and regression risk.

4. **Reduce tech debt concentration in datasource and panel plugins**  
   `public/app/plugins/datasource/` and `public/app/plugins/panel/` remain top frontend hotspots for class components, TODOs, and `any`.

5. **Continue strict-typing campaign on top `any` offenders**  
   Start with the top 10 files by `any` occurrence to maximize type-safety impact per file changed.

6. **Finish feature toggle cleanup and OpenFeature migration**  
   Remove deprecated toggle usage and migrate old `IsEnabled` call sites in `pkg/` to OpenFeature APIs (`pkg/services/featuremgmt/`).

## Change Log

### 2026-06-03 (current scan)

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
| Oversized Go files (>800 loc) | 67 | 66 | -1 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 162 | 0 |

**Resolved since last scan:**
- 5 fewer files with `@deprecated` API markers
- 16 frontend TODO/FIXME/HACK/XXX comments removed
- 1 `nolint` directive removed
- 1 oversized Go file removed from the >800 LOC set (generated-header filtering retained)

**New since last scan:**
- No net-new debt signals in tracked top-line metrics.

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
