# Tech Debt Report - All Scopes - 2026-04-19

Methodology note: this scan excludes generated code, mocks, vendor/testdata paths, and testing-only helpers from hotspot ranking. `connect()` counts now require a matching `react-redux` import, so some deltas reflect improved signal quality rather than source edits alone.

## Hotspots (high debt x high churn)

Priority score = debt signals x log2(commits + 1)

| Rank | Area | Debt Signals | Commits (6mo) | Priority Score |
|------|------|--------------|---------------|----------------|
| 1 | `public/app/features/alerting/` | 76 | 270 | 614 |
| 2 | `pkg/api/` | 64 | 147 | 461 |
| 3 | `public/app/features/dashboard/` | 52 | 170 | 386 |
| 4 | `public/app/features/explore/` | 47 | 106 | 317 |
| 5 | `pkg/registry/apis/provisioning/` | 42 | 194 | 320 |
| 6 | `pkg/services/ngalert/api/` | 40 | 89 | 260 |
| 7 | `public/app/core/` | 40 | 187 | 302 |
| 8 | `pkg/registry/apis/iam/` | 33 | 143 | 237 |
| 9 | `pkg/storage/unified/resource/` | 31 | 188 | 234 |
| 10 | `public/app/features/dashboard-scene/` | 30 | 548 | 273 |

## Frontend Modernization

### Class Components: 60 files

Top areas:
- `public/app/features/dashboard/` - 10 files
- `public/app/features/explore/` - 8 files
- `public/app/core/` - 4 files
- `public/app/features/variables/` - 4 files
- `public/app/features/query/` - 3 files
- `public/app/plugins/datasource/influxdb/` - 3 files
- `public/app/plugins/panel/debug/` - 3 files
- `public/app/plugins/panel/geomap/` - 3 files

### connect() HOC (Redux): 44 files

Top areas:
- `public/app/features/explore/` - 10 files
- `public/app/features/dashboard/` - 9 files
- `public/app/features/admin/` - 5 files
- `public/app/features/variables/` - 4 files
- `public/app/features/auth-config/` - 3 files
- `public/app/features/org/` - 3 files
- `public/app/features/profile/` - 2 files
- `public/app/features/serviceaccounts/` - 2 files

### Unsafe Lifecycle Methods: 1 file

- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`

### Legacy `stylesFactory`: 16 files

- `public/app/features/explore/` - 7 files
- `public/app/features/dashboard/` - 2 files
- `public/app/plugins/panel/live/` - 2 files
- `public/app/features/inspector/` - 1 file
- `public/app/features/query/` - 1 file
- `public/app/plugins/datasource/graphite/` - 1 file
- `public/app/plugins/panel/annolist/` - 1 file
- `public/app/plugins/panel/gettingstarted/` - 1 file

## Type Safety

### Explicit `any`: 397 occurrences across 140 files

Worst offenders (by occurrence count):
- `public/app/features/dashboard/state/DashboardModel.ts` - 23
- `public/app/core/time_series2.ts` - 19
- `public/app/features/dashboard/state/DashboardMigrator.ts` - 16
- `public/app/plugins/datasource/opentsdb/datasource.ts` - 16
- `public/app/features/dashboard/state/PanelModel.ts` - 13
- `public/app/plugins/datasource/influxdb/query_part.ts` - 12
- `public/app/plugins/datasource/influxdb/datasource.ts` - 11
- `public/app/features/alerting/state/query_part.ts` - 10
- `public/app/features/dashboard/state/DashboardMigrator.test.ts` - 10
- `public/app/features/explore/TraceView/components/model/link-patterns.tsx` - 9

### `@deprecated` APIs: 46 files

Top areas:
- `public/app/core/` - 7 files
- `public/app/features/alerting/` - 7 files
- `public/app/types/` - 3 files
- `public/app/plugins/panel/nodeGraph/` - 3 files
- `public/app/features/search/` - 2 files
- `public/app/features/dashboard-scene/` - 2 files
- `public/app/features/explore/` - 2 files
- `public/app/plugins/datasource/influxdb/` - 2 files

## Comment Debt

### Frontend TODO/FIXME/HACK/XXX: 472 occurrences across 320 files

Highest-density files (sampled):
- `public/app/features/panel/panellinks/specs/link_srv.test.ts` - 8
- `public/app/plugins/panel/xychart/SeriesEditor.tsx` - 7
- `public/app/features/browse-dashboards/api/browseDashboardsAPI.ts` - 6
- `public/app/features/search/service/unified.ts` - 6
- `public/app/plugins/panel/geomap/layers/data/networkLayer.tsx` - 6
- `public/app/api/clients/folder/v1beta1/hooks.ts` - 5
- `public/app/features/transformers/calculateHeatmap/heatmap.ts` - 5
- `public/app/plugins/panel/barchart/utils.ts` - 5

### Backend TODO/FIXME/HACK/XXX: 846 occurrences across 439 files

Highest-density files (sampled):
- `pkg/storage/secret/metadata/query.go` - 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` - 16
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` - 12
- `pkg/registry/apis/provisioning/register.go` - 10
- `pkg/services/org/orgimpl/org.go` - 10
- `pkg/storage/unified/resource/datastore.go` - 10
- `pkg/storage/unified/sql/queries.go` - 9
- `pkg/registry/apis/provisioning/resources/dualwriter.go` - 8

## Go Quality

### `nolint` Directives: 1274 occurrences across 486 files

Highest-density files:
- `pkg/services/libraryelements/libraryelements_get_all_test.go` - 42
- `pkg/tests/api/dashboards/api_dashboards_test.go` - 42
- `pkg/services/dashboards/service/dashboard_service.go` - 26
- `pkg/tests/api/alerting/api_prometheus_test.go` - 25
- `pkg/tests/api/alerting/api_ruler_test.go` - 25
- `pkg/services/libraryelements/libraryelements_patch_test.go` - 19
- `pkg/tests/api/annotations/annotations_test.go` - 19
- `pkg/services/annotations/annotationsimpl/xorm_store_test.go` - 17

### Oversized Non-Test Go Files (>800 loc): 57 files

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

### Deprecated Go APIs: 58 files

Top areas:
- `pkg/api/` - 14 files
- `pkg/services/ngalert/api/` - 6 files
- `pkg/setting/` - 3 files
- `pkg/apimachinery/utils/` - 2 files
- `pkg/web/` - 1 file
- `pkg/apimachinery/identity/` - 1 file
- `pkg/apis/iam/` - 1 file
- `pkg/plugins/repo/` - 1 file

## Feature Toggles

### Deprecated Toggles (3 active in registry)

| Toggle Name | Description |
|-------------|-------------|
| `prometheusAzureOverrideAudience` | Deprecated. Allow override default AAD audience for Azure Prometheus endpoint. Enabled by default. This feature should no longer be used and will be removed in the future. |
| `localeFormatPreference` | Specifies the locale so the correct format for numbers and dates can be shown |
| `prometheusTypeMigration` | Checks for deprecated Prometheus authentication methods (SigV4 and Azure), installs the relevant data source, and migrates the Prometheus data sources |

### Old `IsEnabled`/`IsEnabledGlobally` API: 160 files

Top areas:
- `pkg/api/` - 15 files
- `pkg/services/authn/clients/` - 12 files
- `pkg/registry/apis/iam/` - 6 files
- `pkg/services/ngalert/api/` - 5 files
- `pkg/services/authn/authnimpl/` - 4 files
- `pkg/services/ngalert/notifier/` - 4 files
- `pkg/services/publicdashboards/service/` - 4 files
- `pkg/registry/apis/dashboard/` - 3 files

## Recommended Actions

### Priority 1: Dashboard Legacy Code
`public/app/features/dashboard/` still carries 10 class components, 9 `connect()` usages, and 17 `any`-bearing files in a high-churn area. Use the `migrate-class-components` skill to continue converting `DashboardPage`, `DashboardPanel`, `DashboardGrid`, `PanelEditor`, and `SubMenu`.

### Priority 2: Explore TraceView Modernization
`public/app/features/explore/` remains the only unsafe lifecycle hotspot, with 7 `stylesFactory` files, 8 class components, and 10 Redux `connect()` wrappers. These should still be modernized as one coordinated batch.

### Priority 3: Alerting Frontend Cleanup
`public/app/features/alerting/` is now the highest-scoring frontend hotspot: 57 production files with TODO/FIXME/HACK markers, 11 files with explicit `any`, and 7 files exposing deprecated APIs. Focus on `unified/` API helpers, notification-policy components, and legacy alerting state models.

### Priority 4: `pkg/api/` Deprecation and Suppression Cleanup
`pkg/api/` combines 14 deprecated Go API files, 15 old feature-toggle call sites, 25 files with `nolint`, and 4 oversized handlers. Start with `dashboard.go`, `datasources.go`, `frontendsettings.go`, and the DTO layer.

### Priority 5: Provisioning API Decomposition
`pkg/registry/apis/provisioning/` now ranks in the top five hotspots, led by `register.go` (1579 loc, 10 TODO/FIXME/HACK markers, deprecated annotations, and old toggle APIs) plus parser/dualwriter debt. Break the package into smaller registration and resource modules.

### Priority 6: Oversized Go File Split Program
57 non-test Go files still exceed 800 lines. The most urgent splits remain `pkg/services/featuremgmt/registry.go`, `pkg/setting/setting.go`, `pkg/services/dashboards/service/dashboard_service.go`, and `pkg/storage/unified/resource/storage_backend.go`.

### Priority 7: Feature Toggle Cleanup
Remove the 3 deprecated toggles from the registry and migrate 160 files off `IsEnabled`/`IsEnabledGlobally` to the OpenFeature-based APIs.

### Priority 8: Strict Typing in Core and Scene Paths
The largest remaining `any` concentrations outside dashboard legacy code now sit in `public/app/core/` and `public/app/features/dashboard-scene/`. Target `time_series2.ts`, `DashboardModel.ts`, `DashboardMigrator.ts`, and the scene serialization helpers.

## Change Log

### 2026-04-19 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 60 | -1 |
| connect() HOC | 41 | 44 | +3 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory | 16 | 16 | 0 |
| Explicit `any` | 393 | 397 | +4 |
| `any` files | 137 | 140 | +3 |
| @deprecated APIs | 51 | 46 | -5 |
| Frontend TODO/FIXME/HACK | 618 | 472 | -146 |
| Backend TODO/FIXME/HACK | 894 | 846 | -48 |
| nolint directives | 1275 | 1274 | -1 |
| Oversized Go files (>800 loc) | 67 | 57 | -10 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 160 | -2 |

**Resolved since last scan:**
- No code-backed resolutions were promoted automatically from the previous report because the prior scan stored only summary inventories.
- Several downward deltas come from tighter exclusions for generated files, mocks, and testing-only helpers in this run.

**New since last scan:**
- `public/app/features/alerting/` became the highest-priority frontend hotspot in the production-only ranking.
- `pkg/api/` and `pkg/registry/apis/provisioning/` now both score as top-five backend hotspots and warrant dedicated remediation tickets.
- Explicit `any` usage still increased by 4 annotations across 3 additional files even after the tighter exclusions.

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
