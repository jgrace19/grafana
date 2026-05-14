# Tech Debt Report — all — 2026-05-14

## Hotspots (high debt × high churn)
| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|--------------------|----------------|
| 1 | `pkg/registry/` | 327 | 543 | 2971.6 |
| 2 | `pkg/tests/` | 318 | 479 | 2832.39 |
| 3 | `public/app/plugins/datasource/` | 285 | 160 | 2089.31 |
| 4 | `pkg/storage/` | 237 | 334 | 1987.96 |
| 5 | `pkg/services/ngalert/` | 211 | 172 | 1568.71 |
| 6 | `public/app/features/dashboard/` | 151 | 148 | 1090.09 |
| 7 | `public/app/features/alerting/` | 132 | 238 | 1042.91 |
| 8 | `pkg/services/libraryelements/` | 122 | 13 | 464.5 |
| 9 | `public/app/plugins/panel/` | 115 | 154 | 836.75 |
| 10 | `pkg/api/` | 113 | 127 | 791.0 |

## Frontend Modernization
- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 files
- **stylesFactory**: 16 files

Top class-component areas:
- `plugins/datasource/` — 12 files
- `plugins/panel/` — 11 files
- `features/dashboard/` — 10 files
- `features/explore/` — 8 files
- `core/` — 4 files

Top connect() areas:
- `features/dashboard/` — 9 files
- `features/explore/` — 8 files
- `features/admin/` — 5 files
- `features/variables/` — 4 files
- `features/auth-config/` — 3 files

Top stylesFactory areas:
- `features/explore/` — 7 files
- `plugins/panel/` — 4 files
- `features/dashboard/` — 2 files
- `features/query/` — 1 files
- `features/inspector/` — 1 files

## Type Safety
- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 46 files

Worst explicit `any` offenders:
- `public/app/features/dashboard/state/DashboardModel.ts` — 23
- `public/app/core/time_series2.ts` — 19
- `public/app/features/dashboard/state/DashboardMigrator.ts` — 16
- `public/app/plugins/datasource/opentsdb/datasource.ts` — 16
- `public/app/features/dashboard/state/PanelModel.ts` — 13
- `public/app/plugins/datasource/influxdb/query_part.ts` — 12
- `public/app/plugins/datasource/influxdb/datasource.ts` — 11
- `public/app/features/dashboard/state/DashboardMigrator.test.ts` — 10
- `public/app/features/alerting/state/query_part.ts` — 10
- `public/app/plugins/datasource/graphite/graphite_query.ts` — 9

## Comment Debt
- **Frontend TODO/FIXME/HACK**: 602 occurrences
- **Backend TODO/FIXME/HACK**: 851 occurrences

Frontend highest-density files:
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10

Backend highest-density files:
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/storage/unified/resource/datastore.go` — 10
- `pkg/registry/apis/provisioning/register.go` — 10

## Go Quality
- **nolint directives**: 1274 occurrences
- **Oversized files (>800 loc)**: 57 files
- **Deprecated Go APIs**: 58 files

Highest `nolint` density files:
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25
- `pkg/tests/api/alerting/api_ruler_test.go` — 25

Top oversized non-test Go files:
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
- **Deprecated toggles with active call sites**: 3
- **Old IsEnabled API call sites**: 161 files

Deprecated toggle names:
- `localeFormatPreference`
- `prometheusAzureOverrideAudience`
- `prometheusTypeMigration`

## Recommended Actions
1. **Migrate dashboard class/connect components to hooks** — Dashboard has 10 class components, 9 connect() HOCs, and 2 stylesFactory usages. (21 scoped files/signals)
2. **Modernize Explore TraceView legacy React patterns** — Explore/TraceView still has 1 unsafe lifecycle, 8 class components, 8 connect() usages, and 7 stylesFactory usages. (24 scoped files/signals)
3. **Split top oversized Go service files** — Top oversized files: pkg/services/featuremgmt/registry.go (2828 loc), pkg/setting/setting.go (2432 loc), pkg/services/dashboards/service/dashboard_service.go (2410 loc). (3 scoped files/signals)
4. **Clean up deprecated feature toggles** — Deprecated toggles still in registry: localeFormatPreference, prometheusAzureOverrideAudience, prometheusTypeMigration. (3 scoped files/signals)
5. **Migrate IsEnabled API call sites to OpenFeature** — Found 161 files using IsEnabled/IsEnabledGlobally. (161 scoped files/signals)
6. **Reduce explicit any in top frontend offenders** — Explicit any appears 393 times across 137 files. (10 scoped files/signals)

- Class/connect migration support skill: `migrate-class-components`
- Feature-toggle migration context: `pkg/services/featuremgmt/`

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

### 2026-05-14 (current scan)

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
| Oversized Go files (>800 loc) | 67 | 57 | -10 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 161 | -1 |

**Resolved since last scan:**
- @deprecated APIs: 5 fewer since last scan
- Frontend TODO/FIXME/HACK: 16 fewer since last scan
- Backend TODO/FIXME/HACK: 43 fewer since last scan
- nolint directives: 1 fewer since last scan
- Oversized Go files (>800 loc): 10 fewer since last scan
- Old IsEnabled API files: 1 fewer since last scan

**New since last scan:**
- None detected from metric deltas


