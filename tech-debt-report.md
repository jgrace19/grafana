# Tech Debt Report — all — 2026-06-09

## Hotspots (high debt × high churn)

Priority score = debt signals × log₂(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|-------------------|----------------|
| 1 | `pkg/registry/` | 327 | 481 | 2914.51 |
| 2 | `pkg/tests/` | 322 | 446 | 2834.93 |
| 3 | `public/app/plugins/datasource/` | 285 | 128 | 1998.2 |
| 4 | `pkg/storage/` | 240 | 300 | 1976.07 |
| 5 | `pkg/services/ngalert/` | 211 | 146 | 1519.13 |
| 6 | `public/app/features/dashboard/` | 151 | 120 | 1044.75 |
| 7 | `public/app/features/alerting/` | 132 | 201 | 1010.88 |
| 8 | `public/app/plugins/panel/` | 115 | 137 | 817.48 |
| 9 | `pkg/api/` | 113 | 109 | 766.29 |
| 10 | `pkg/services/libraryelements/` | 122 | 12 | 451.45 |

## Frontend Modernization
- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 file
- **stylesFactory**: 16 files

## Type Safety
- **Explicit `any`**: 393 occurrences across 137 files
- **Top explicit `any` offenders:**
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
- **@deprecated APIs**: 46 files

## Comment Debt
- **Frontend TODO/FIXME/HACK**: 602 occurrences
- **Frontend top offenders:**
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10
- **Backend TODO/FIXME/HACK**: 851 occurrences
- **Backend top offenders:**
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/storage/unified/resource/datastore.go` — 10
- `pkg/registry/apis/provisioning/register.go` — 10

## Go Quality
- **nolint directives**: 1274 occurrences
- **Top nolint offenders:**
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_ruler_test.go` — 25
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25
- **Oversized files (>800 loc)**: 66 files
| File | Lines |
|------|-------|
| `pkg/tests/apis/provisioning/common/testing.go` | 2835 |
| `pkg/services/featuremgmt/registry.go` | 2828 |
| `pkg/storage/unified/testing/storage_backend_sql_compatibility.go` | 2674 |
| `pkg/apiserver/storage/testing/store_tests.go` | 2667 |
| `pkg/setting/setting.go` | 2432 |
| `pkg/services/dashboards/service/dashboard_service.go` | 2410 |
| `pkg/storage/unified/search/bleve.go` | 2192 |
| `pkg/storage/unified/resource/storage_backend.go` | 2189 |
| `pkg/util/xorm/core/core.go` | 2176 |
| `pkg/storage/unified/testing/storage_backend.go` | 2087 |
| `pkg/storage/unified/resource/server.go` | 1941 |
| `pkg/services/ngalert/store/alert_rule.go` | 1873 |
| `pkg/tests/api/alerting/testing.go` | 1689 |
| `pkg/services/ngalert/models/testing.go` | 1650 |
| `pkg/apiserver/storage/testing/watcher_tests.go` | 1639 |
- **Deprecated Go APIs**: 58 files

## Feature Toggles
- **Deprecated toggles with active call sites:**
- `localeFormatPreference` — no active call sites outside registry
- `prometheusAzureOverrideAudience` — 3 occurrences across 3 files
- `prometheusTypeMigration` — no active call sites outside registry
- **Old IsEnabled API call sites**: 161 files

## Recommended Actions
1. **Migrate dashboard and explore class/connect components** — Convert remaining class components and connect() HOCs in dashboard/explore to hooks and modern Redux usage. Use the migrate-class-components skill for class/connect migration and replace stylesFactory with useStyles2 in touched files.
2. **Modernize datasource plugin frontend debt hotspots** — Reduce class/connect/stylesFactory debt and explicit any in datasource plugins. Modernize plugin editors incrementally during plugin workspace maintenance cycles.
3. **Split oversized Go files in active backend services** — Decompose oversized non-test Go files into focused modules. Start with registry.go, setting.go, and dashboard_service.go; extract cohesive sub-packages.
4. **Migrate IsEnabled API call sites to OpenFeature** — Replace legacy IsEnabled/IsEnabledGlobally usage with OpenFeature APIs and remove deprecated toggles. Follow pkg/services/featuremgmt migration docs and remove stale toggles once call sites are migrated.
5. **Reduce explicit any in top frontend offenders** — Replace high-volume explicit any annotations with concrete types in top offenders. Prioritize the top 10 files by occurrence count and add narrow interfaces/types.
6. **Burn down backend TODO/FIXME and nolint debt in hotspots** — Address stale TODO/FIXME/HACK and remove unnecessary nolint directives in highest-signal backend packages. Focus on pkg/registry, pkg/tests, pkg/storage, and pkg/services/ngalert first.

## Change Log

### 2026-06-09 (current scan)

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
- `@deprecated APIs` decreased by 5
- `Frontend TODO/FIXME/HACK` decreased by 16
- `Backend TODO/FIXME/HACK` decreased by 43
- `nolint directives` decreased by 1
- `Oversized Go files (>800 loc)` decreased by 1
- `Old IsEnabled API files` decreased by 1

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
