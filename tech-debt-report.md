# Tech Debt Report -- All Scopes -- 2026-04-16

## Hotspots (high debt x high churn)

Priority score = debt signals x log2(commits + 1)

| Rank | Area | Debt Signals | Commits (6mo) | Priority Score |
|------|------|--------------|---------------|----------------|
| 1 | `pkg/registry/` | 155 | 628 | 1441 |
| 2 | `public/app/plugins/` | 153 | 364 | 1302 |
| 3 | `pkg/services/ngalert/` | 122 | 185 | 920 |
| 4 | `pkg/storage/` | 81 | 369 | 691 |
| 5 | `public/app/features/alerting/` | 76 | 270 | 614 |
| 6 | `pkg/api/` | 64 | 148 | 462 |
| 7 | `public/app/features/dashboard/` | 52 | 170 | 386 |
| 8 | `public/app/features/explore/` | 47 | 107 | 317 |
| 9 | `public/app/core/` | 40 | 188 | 302 |
| 10 | `public/app/features/dashboard-scene/` | 30 | 550 | 273 |

## Frontend Modernization

### Class Components: 60 files

Top areas:
- `public/app/plugins/` -- 22 files, including legacy datasource editors and panel implementations.
- `public/app/features/dashboard/` -- 10 files, led by `DashboardPage`, `DashboardPanel`, `DashboardGrid`, `PanelEditor`, and `SubMenu`.
- `public/app/features/explore/` -- 8 files, including TraceView and log/table containers.
- `public/app/core/` -- 4 files, including older shared controls such as `GraphNG` and `SharedPreferencesOld`.

### connect() HOC (Redux): 44 files

The remaining `connect()` usage is concentrated in `public/app/features/explore/` (10 files) and `public/app/features/dashboard/` (9 files), with additional holdouts in `admin/` and `auth-config/`.

### Unsafe Lifecycle Methods: 1 file

- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx` still uses `UNSAFE_componentWillReceiveProps`.

### Legacy `stylesFactory`: 16 files

- `public/app/features/explore/TraceView/` -- 7 files
- `public/app/plugins/` -- 5 files
- `public/app/features/dashboard/` -- 2 files
- `public/app/features/query/` -- 1 file
- `public/app/features/inspector/` -- 1 file

## Type Safety

### Explicit `any`: 397 occurrences across 140 files

Worst offenders (by occurrence count):
- `public/app/features/dashboard/state/DashboardModel.ts` -- 23
- `public/app/core/time_series2.ts` -- 19
- `public/app/features/dashboard/state/DashboardMigrator.ts` -- 16
- `public/app/plugins/datasource/opentsdb/datasource.ts` -- 16
- `public/app/features/dashboard/state/PanelModel.ts` -- 13
- `public/app/plugins/datasource/influxdb/query_part.ts` -- 12
- `public/app/plugins/datasource/influxdb/datasource.ts` -- 11
- `public/app/features/alerting/state/query_part.ts` -- 10
- `public/app/features/dashboard/state/DashboardMigrator.test.ts` -- 10
- `public/app/features/explore/TraceView/components/model/link-patterns.tsx` -- 9

### `@deprecated` APIs: 46 files

Representative files with deprecated frontend APIs still present:
- `public/app/core/services/backend_srv.ts`
- `public/app/core/time_series2.ts`
- `public/app/features/alerting/unified/hooks/useAbilities.ts`
- `public/app/features/dashboard/state/DashboardModel.ts`
- `public/app/features/dashboard-scene/mutation-api/commands/schemas.ts`

## Comment Debt

### Frontend TODO/FIXME/HACK/XXX: 472 occurrences

Highest-density files (sampled):
- `public/app/features/panel/panellinks/specs/link_srv.test.ts` -- 8
- `public/app/plugins/panel/xychart/SeriesEditor.tsx` -- 7
- `public/app/features/browse-dashboards/api/browseDashboardsAPI.ts` -- 6
- `public/app/features/search/service/unified.ts` -- 6
- `public/app/plugins/panel/geomap/layers/data/networkLayer.tsx` -- 6

### Backend TODO/FIXME/HACK/XXX: 846 occurrences

Highest-density files (sampled):
- `pkg/storage/secret/metadata/query.go` -- 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` -- 16
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` -- 12
- `pkg/registry/apis/provisioning/register.go` -- 10
- `pkg/services/org/orgimpl/org.go` -- 10

## Go Quality

### `nolint` Directives: 1,274 occurrences

Highest-density files:
- `pkg/services/libraryelements/libraryelements_get_all_test.go` -- 42
- `pkg/tests/api/dashboards/api_dashboards_test.go` -- 42
- `pkg/services/dashboards/service/dashboard_service.go` -- 26
- `pkg/tests/api/alerting/api_prometheus_test.go` -- 25
- `pkg/tests/api/alerting/api_ruler_test.go` -- 25

### Oversized Non-Test Go Files (>800 loc): 66 files

Top actionable files (generated code filtered out; helper-style `testing.go` files omitted for prioritization):

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
| `pkg/tsdb/grafana-testdata-datasource/scenarios.go` | 1318 |

### Deprecated Go APIs: 58 files

Representative files:
- `pkg/api/api.go`
- `pkg/api/dashboard.go`
- `pkg/api/datasources.go`
- `pkg/registry/apis/provisioning/register.go`
- `pkg/services/dashboardimport/dashboardimport.go`

## Feature Toggles

### Deprecated Toggles (3 active in registry)

| Toggle Name | Active Callsite Files | Notes |
|-------------|-----------------------|-------|
| `prometheusAzureOverrideAudience` | 3 | Still referenced in `pkg/tsdb/prometheus/azureauth/azure.go`, `pkg/tsdb/prometheus/azureauth/azure_test.go`, and `pkg/tsdb/prometheus/prometheus.go` |
| `localeFormatPreference` | 0 | Still registered as deprecated but no current backend call sites were found |
| `prometheusTypeMigration` | 0 | Still registered as deprecated but no current backend call sites were found |

### Old `IsEnabled` / `IsEnabledGlobally` API: 160 files

Legacy feature-flag checks are still common in `pkg/registry/`, `pkg/api/`, and `pkg/services/ngalert/`. These call sites should migrate to the OpenFeature interface described in `pkg/services/featuremgmt/models.go`.

## Recommended Actions

1. Reduce debt concentration in `pkg/registry/` by tackling the 155 file-scoped signals across 114 non-test files, starting with provisioning registration paths, long-lived TODOs, and remaining `IsEnabled` usage.
2. Reduce debt concentration in `public/app/plugins/` by modernizing class components, replacing `stylesFactory`, and shrinking the `any` / deprecated API footprint in heavily used datasource and panel plugins.
3. Reduce debt concentration in `pkg/storage/` by splitting oversized `resource/` and `search/` files, auditing `nolint` suppressions, and cleaning up legacy feature-flag checks.
4. Keep driving `pkg/services/ngalert/` cleanup; it remains the largest tracked backend hotspot with 122 file-scoped signals across 78 non-test files.
5. Use the `migrate-class-components` skill on `public/app/features/dashboard/`, where 10 class components and 9 `connect()` HOCs remain in one of the highest-churn frontend areas.
6. Modernize `public/app/features/explore/TraceView/`, which still contains 4 class components, 7 `stylesFactory` usages, and the only unsafe React lifecycle in the tree.
7. Continue the feature-toggle cleanup by removing deprecated registry entries and migrating the remaining 160 legacy `IsEnabled` / `IsEnabledGlobally` call sites to OpenFeature.
8. Reduce explicit `any` in the top 10 frontend files, with `DashboardModel.ts`, `time_series2.ts`, `DashboardMigrator.ts`, and `opentsdb/datasource.ts` still dominating the count.
9. Split the largest non-generated Go files such as `registry.go`, `setting.go`, `dashboard_service.go`, and `storage_backend.go` into smaller modules.

## Change Log

### 2026-04-16 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 60 | -1 |
| connect() HOC | 41 | 44 | +3 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory | 16 | 16 | 0 |
| Explicit `any` | ~393 | 397 | +4 |
| `any` files | ~137 | 140 | +3 |
| `@deprecated` APIs | ~51 | 46 | -5 |
| Frontend TODO/FIXME/HACK | ~618 | 472 | -146 |
| Backend TODO/FIXME/HACK | ~894 | 846 | -48 |
| `nolint` directives | ~1,275 | 1,274 | -1 |
| Oversized Go files (>800 loc) | 67 | 66 | -1 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | ~162 | 160 | -2 |

Methodology notes:
- `connect()` detection now requires both a `react-redux` import and a `connect()` call, which surfaced three files that were missed by the previous narrower pattern.
- Go scans now consistently exclude `_gen.go`, `zz_generated*.go`, and other code-generated files, which lowered some backend totals while preserving the same hotspot ordering.

**Resolved since last scan:**
- 1 class component left the scan.
- 5 frontend files no longer expose `@deprecated` APIs.
- 2 files no longer use the legacy `IsEnabled` / `IsEnabledGlobally` APIs.
- 1 non-generated Go file dropped below the oversized-file threshold.

**New since last scan:**
- 4 explicit `any` annotations were added across 3 files.
- 3 additional `connect()` HOC files were surfaced by the refined detector.


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
