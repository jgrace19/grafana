# Tech Debt Report — All Scopes — 2026-04-28

## Hotspots (high debt × high churn)

Priority score = debt signals × log₂(commits + 1)

| Rank | Area | Debt Signals | Commits (6mo) | Priority Score |
|------|------|--------------|----------------|----------------|
| 1 | `public/app/plugins/datasource/` | 285 | 180 | 2137.46 |
| 2 | `pkg/services/ngalert/` | 211 | 180 | 1582.47 |
| 3 | `public/app/features/dashboard/` | 151 | 160 | 1106.97 |
| 4 | `public/app/features/alerting/` | 132 | 259 | 1058.95 |
| 5 | `public/app/plugins/panel/` | 115 | 166 | 849.13 |
| 6 | `pkg/api/` | 113 | 142 | 809.07 |
| 7 | `public/app/core/` | 82 | 171 | 608.95 |
| 8 | `pkg/services/libraryelements/` | 122 | 16 | 498.67 |
| 9 | `public/app/features/dashboard-scene/` | 55 | 530 | 497.89 |
| 10 | `public/app/features/explore/` | 57 | 100 | 379.52 |

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

### Explicit `any`: 393 occurrences across 137 files

Top offenders:
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

### `@deprecated` APIs: 46 files

Key files with deprecated APIs still defined:
- `public/app/api/clients/playlist/v1/index.ts`
- `public/app/core/components/RolePicker/api.ts`
- `public/app/core/history/richHistoryLocalStorageUtils.ts`
- `public/app/core/services/__mocks__/backend_srv.ts`
- `public/app/core/services/backend_srv.ts`
- `public/app/core/time_series2.ts`
- `public/app/core/utils/kbn.ts`
- `public/app/core/utils/richHistoryTypes.ts`

## Comment Debt

### Frontend TODO/FIXME/HACK/XXX: 602 occurrences across 327 files

Highest-density files (sampled):
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10
- `public/app/features/panel/panellinks/specs/link_srv.test.ts` — 8
- `public/app/plugins/datasource/azuremonitor/components/MetricsQueryEditor/AdvancedResourcePicker.tsx` — 7
- `public/app/plugins/panel/xychart/SeriesEditor.tsx` — 7

### Backend TODO/FIXME/HACK/XXX: 851 occurrences across 441 files

Highest-density files (sampled):
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/registry/apis/provisioning/register.go` — 10
- `pkg/services/org/orgimpl/org.go` — 10
- `pkg/storage/unified/resource/datastore.go` — 10
- `pkg/storage/unified/sql/queries.go` — 9
- `pkg/registry/apis/provisioning/resources/dualwriter.go` — 8

## Go Quality

### `nolint` Directives: 1274 occurrences across 486 files

Highest-density files (sampled):
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25
- `pkg/tests/api/alerting/api_ruler_test.go` — 25
- `pkg/services/libraryelements/libraryelements_patch_test.go` — 19
- `pkg/tests/api/annotations/annotations_test.go` — 19
- `pkg/services/annotations/annotationsimpl/xorm_store_test.go` — 17
- `pkg/services/preference/prefimpl/store_test.go` — 17
- `pkg/services/preference/prefimpl/pref_test.go` — 16

### Oversized Non-Test Go Files (>800 loc): 66 files

Top actionable files (excluding test and generated files):

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

### Deprecated Go APIs: 58 files (non-generated)

## Feature Toggles

### Deprecated Toggles in Registry: 3
- `localeFormatPreference`
- `prometheusAzureOverrideAudience`
- `prometheusTypeMigration`

### Deprecated toggles with active non-test call sites
- `prometheusAzureOverrideAudience` — 2 file(s): `pkg/tsdb/prometheus/azureauth/azure.go`, `pkg/tsdb/prometheus/prometheus.go`

### Old `IsEnabled`/`IsEnabledGlobally` API: 161 files

These call sites should migrate to OpenFeature (see `pkg/services/featuremgmt/models.go`).

## Recommended Actions

1. **Modernize dashboard class/connect code** — Prioritize `public/app/features/dashboard/` (151 signals, 160 commits). Use the `migrate-class-components` skill to migrate class components and remove `connect()` usage.
2. **Reduce datasource plugin debt** — `public/app/plugins/datasource/` remains the highest frontend hotspot (285 signals, 180 commits) with class components, TODO density, and `any` usage concentrated in editor code.
3. **Refactor ngalert backend hotspot** — `pkg/services/ngalert/` has 211 signals and high churn; target TODO/nolint cleanup and OpenFeature migration work in the same sweep.
4. **Split oversized Go files in active services** — Start with `pkg/setting/setting.go`, `pkg/services/dashboards/service/dashboard_service.go`, and `pkg/services/ngalert/store/alert_rule.go`.
5. **Finish feature toggle migration** — Remove deprecated toggle call sites and migrate remaining `IsEnabled` usage to OpenFeature. Reference `pkg/services/featuremgmt/` for migration patterns.
6. **Drive `any` reduction in top offenders** — Focus first on `DashboardModel.ts`, `time_series2.ts`, and `DashboardMigrator.ts` where explicit `any` density is highest.

## Change Log

### 2026-04-28 (current scan)

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
- @deprecated APIs decreased (51 → 46)
- Frontend TODO/FIXME/HACK decreased (618 → 602)
- Backend TODO/FIXME/HACK decreased (894 → 851)
- nolint directives decreased (1275 → 1274)
- Oversized Go files (>800 loc) decreased (67 → 66)
- Old IsEnabled API files decreased (162 → 161)

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
