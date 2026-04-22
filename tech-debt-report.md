# Tech Debt Report — all — 2026-04-22

## Hotspots (high debt × high churn)

Priority score = debt signals × log₂(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|-------------------|----------------|
| 1 | `public/app/plugins/datasource/` | 285 | 187 | 2153.06 |
| 2 | `pkg/services/ngalert/` | 211 | 184 | 1589.12 |
| 3 | `public/app/features/dashboard/` | 151 | 165 | 1113.63 |
| 4 | `public/app/features/alerting/` | 132 | 266 | 1064.01 |
| 5 | `public/app/plugins/panel/` | 115 | 173 | 855.94 |
| 6 | `pkg/api/` | 113 | 146 | 813.56 |
| 7 | `public/app/core/` | 82 | 184 | 617.57 |
| 8 | `public/app/features/dashboard-scene/` | 55 | 543 | 499.81 |
| 9 | `pkg/services/libraryelements/` | 122 | 16 | 498.67 |
| 10 | `public/app/features/explore/` | 57 | 102 | 381.13 |

## Frontend Modernization

### Class Components: 61 files

Top areas:
- `public/app/plugins/datasource/` — 12 files
- `public/app/plugins/panel/` — 11 files
- `public/app/features/dashboard/` — 10 files
- `public/app/features/explore/` — 8 files
- `public/app/core/` — 4 files
- `public/app/features/variables/` — 4 files
- `public/app/features/query/` — 3 files

### connect() HOC (Redux): 41 files

Top areas:
- `public/app/features/dashboard/` — 9 files
- `public/app/features/explore/` — 8 files
- `public/app/features/admin/` — 5 files
- `public/app/features/variables/` — 4 files
- `public/app/features/auth-config/` — 3 files
- `public/app/features/org/` — 2 files
- `public/app/features/profile/` — 2 files

### Unsafe Lifecycle Methods: 1 file

- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`

### Legacy `stylesFactory`: 16 files

Top areas:
- `public/app/features/explore/` — 7 files
- `public/app/plugins/panel/` — 4 files
- `public/app/features/dashboard/` — 2 files
- `public/app/features/inspector/` — 1 files
- `public/app/features/query/` — 1 files
- `public/app/plugins/datasource/` — 1 files

## Type Safety

### Explicit `any`: ~393 occurrences across ~137 files

Worst offenders (by occurrence count):
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
- `public/app/plugins/datasource/graphite/graphite_query.ts` — 9
- `public/app/features/templating/template_srv.ts` — 8

### `@deprecated` APIs: ~46 files (non-generated)

Key files with deprecated APIs still defined (sample):
- `public/app/api/clients/playlist/v1/index.ts`
- `public/app/core/components/RolePicker/api.ts`
- `public/app/core/history/richHistoryLocalStorageUtils.ts`
- `public/app/core/services/__mocks__/backend_srv.ts`
- `public/app/core/services/backend_srv.ts`
- `public/app/core/time_series2.ts`
- `public/app/core/utils/kbn.ts`
- `public/app/core/utils/richHistoryTypes.ts`

## Comment Debt

### Frontend TODO/FIXME/HACK/XXX: ~602 occurrences

### Backend TODO/FIXME/HACK/XXX: ~894 occurrences

## Go Quality

### `nolint` Directives: ~1274 occurrences

### Oversized Non-Test Go Files (>800 loc): 66 files

Top actionable files (excluding obvious generated outputs):

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

### Deprecated Go APIs: ~65 files (non-generated)

## Feature Toggles

### Deprecated Toggles (3 active in registry)

- `localeFormatPreference`
- `prometheusAzureOverrideAudience`
- `prometheusTypeMigration`

### Old `IsEnabled`/`IsEnabledGlobally` API: ~162 files

These call sites should migrate to the OpenFeature interface (per deprecation notice in `pkg/services/featuremgmt/models.go`).

## Recommended Actions

1. **Migrate datasource plugin class components/connect usage** — `public/app/plugins/datasource/` has the highest priority score and leading class-component debt; use the `migrate-class-components` skill for targeted conversions.
2. **Reduce ngalert backend debt concentration** — `pkg/services/ngalert/` combines high TODO/nolint density with high churn; prioritize API/store/model cleanup splits.
3. **Continue dashboard/frontend modernization** — `public/app/features/dashboard/` and `public/app/features/alerting/` remain heavy debt + churn hotspots.
4. **Split oversized Go modules** — start with `pkg/services/featuremgmt/registry.go`, `pkg/setting/setting.go`, and `pkg/services/dashboards/service/dashboard_service.go`.
5. **Migrate old feature-flag APIs to OpenFeature** — replace `IsEnabled`/`IsEnabledGlobally` call sites and remove deprecated toggles; see `pkg/services/featuremgmt/` for migration context.
6. **Drive explicit `any` reductions in top offenders** — focus on dashboard state models, time-series core helpers, and datasource query implementations.

## Change Log

### 2026-04-22 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | 0 |
| connect() HOC | 41 | 41 | 0 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory | 16 | 16 | 0 |
| Explicit any | 393 | 393 | 0 |
| any files | 137 | 137 | 0 |
| @deprecated APIs | 51 | 46 | -5 |
| Frontend TODO/FIXME/HACK | 618 | 602 | -16 |
| Backend TODO/FIXME/HACK | 894 | 894 | 0 |
| nolint directives | 1275 | 1274 | -1 |
| Oversized Go files (>800 loc) | 67 | 66 | -1 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 162 | 0 |

**Resolved since last scan:**
- 5 files with `@deprecated` API references were removed
- 16 frontend TODO/FIXME/HACK/XXX comments were resolved
- 1 `nolint` directives were removed
- 1 oversized Go file(s) no longer exceed 800 LOC

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
