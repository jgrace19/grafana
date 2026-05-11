# Tech Debt Report — all — 2026-05-11

## Hotspots (high debt × high churn)

Priority score = debt signals × log₂(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|--------------------|----------------|
| 1 | `pkg/registry/` | 327 | 553 | 2980.19 |
| 2 | `pkg/tests/` | 322 | 482 | 2870.91 |
| 3 | `public/app/plugins/datasource/` | 285 | 166 | 2104.36 |
| 4 | `pkg/storage/` | 240 | 340 | 2019.27 |
| 5 | `pkg/services/ngalert/` | 211 | 175 | 1573.94 |
| 6 | `public/app/features/dashboard/` | 151 | 152 | 1095.87 |
| 7 | `public/app/features/alerting/` | 132 | 242 | 1046.08 |
| 8 | `pkg/services/libraryelements/` | 122 | 13 | 464.5 |
| 9 | `public/app/plugins/panel/` | 115 | 157 | 839.93 |
| 10 | `pkg/api/` | 113 | 130 | 794.78 |

## Frontend Modernization

- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 files
- **stylesFactory**: 16 files

Top class-component areas: `public/app/plugins/datasource/` (12), `public/app/plugins/panel/` (11), `public/app/features/dashboard/` (10), `public/app/features/explore/` (8), `public/app/core/` (4), `public/app/features/variables/` (4), `public/app/features/query/` (3)

Top connect() areas: `public/app/features/dashboard/` (9), `public/app/features/explore/` (8), `public/app/features/admin/` (5), `public/app/features/variables/` (4), `public/app/features/auth-config/` (3), `public/app/features/org/` (2), `public/app/features/profile/` (2)

Top stylesFactory areas: `public/app/features/explore/` (7), `public/app/plugins/panel/` (4), `public/app/features/dashboard/` (2), `public/app/features/inspector/` (1), `public/app/features/query/` (1), `public/app/plugins/datasource/` (1)

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 46 files

Worst `any` offenders (top 10):
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

## Comment Debt

- **Frontend TODO/FIXME/HACK/XXX**: 602 occurrences
- **Backend TODO/FIXME/HACK/XXX**: 851 occurrences

Frontend highest-density files (sample):
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10
- `public/app/features/panel/panellinks/specs/link_srv.test.ts` — 8

Backend highest-density files (sample):
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/registry/apis/provisioning/register.go` — 10
- `pkg/services/org/orgimpl/org.go` — 10
- `pkg/storage/unified/resource/datastore.go` — 10

## Go Quality

- **nolint directives**: 1274 occurrences
- **Oversized files (>800 loc)**: 66 files
- **Deprecated Go APIs**: 58 files

Top `nolint` density files (sample):
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25
- `pkg/tests/api/alerting/api_ruler_test.go` — 25
- `pkg/services/libraryelements/libraryelements_patch_test.go` — 19

Top actionable oversized files (non-generated):

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


## Feature Toggles

- **Deprecated toggles in registry**: 3 (`alertingMigrationWizardUI`, `enableScopesInMetricsExplore`, `graphiteBackendMode`)
- **Deprecated toggles with active (non-registry, non-generated) call sites**: none detected
- **Old IsEnabled API call sites**: 161 files

Top IsEnabled migration buckets: `pkg/registry/` (21), `pkg/services/authn/` (19), `pkg/services/ngalert/` (16), `pkg/api/` (15), `pkg/services/publicdashboards/` (10), `pkg/tsdb/cloudwatch/` (8)

## Recommended Actions

1. **[Tech Debt] Reduce debt concentration in pkg/registry** — 327 signals, 553 commits in 6 months, and a 2980.19 priority score make this the highest ROI backend debt reduction target.
2. **[Tech Debt] Reduce debt concentration in public/app/plugins** — datasource and panel plugins still hold significant class-component, any, and TODO density in an actively changed area.
3. **[Tech Debt] Migrate dashboard class/connect components to hooks** — dashboard remains the highest frontend modernization target; use the `migrate-class-components` skill.
4. **[Tech Debt] Modernize Explore TraceView (stylesFactory + unsafe lifecycle)** — concentrated legacy styling + the repo’s only unsafe lifecycle call in a high-change area.
5. **[Tech Debt] Split oversized Go files (setting.go, dashboard_service.go, storage_backend.go)** — split high-LOC files into focused modules to improve maintainability and reviewability.
6. **[Tech Debt] Clean up deprecated feature toggles and migrate IsEnabled API** — remove deprecated registry toggles and continue migration from `IsEnabled`/`IsEnabledGlobally` to OpenFeature in hotspot buckets.
7. **[Tech Debt] Reduce explicit any in top 10 frontend files** — target the worst offenders first to improve type safety with limited scope.
8. **[Tech Debt] Clean up alerting/unified type debt and deprecated APIs** — alerting remains high-churn and carries notable TODO/any/deprecated density.

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

### 2026-05-11 (current scan)

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
| Backend TODO/FIXME/HACK | 894 | 851 | -43 |
| nolint directives | 1275 | 1274 | -1 |
| Oversized Go files (>800 loc) | 67 | 66 | -1 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 161 | -1 |

**Resolved since last scan:**
- 5 files with `@deprecated` TypeScript API markers were removed from the scan set.
- 16 frontend TODO/FIXME/HACK/XXX markers were removed.
- 43 backend TODO/FIXME/HACK/XXX markers were removed.
- 1 `nolint` suppression was removed.
- 1 Go file dropped below the oversized-file threshold.
- 1 file was removed from legacy `IsEnabled` API usage.

**New since last scan:**
- No aggregate metric increases were detected in this scan.
