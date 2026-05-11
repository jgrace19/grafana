# Tech Debt Report — all — 2026-05-11

## Hotspots (high debt × high churn)
| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|----------------------|----------------|
| 1 | `pkg/registry/` | 177 | 552 | 1612.7 |
| 2 | `pkg/services/ngalert/` | 142 | 175 | 1059.2 |
| 3 | `pkg/storage/` | 107 | 340 | 900.3 |
| 4 | `public/app/features/alerting/` | 90 | 242 | 713.2 |
| 5 | `pkg/tests/` | 73 | 482 | 650.9 |
| 6 | `public/app/plugins/datasource/` | 87 | 166 | 642.4 |
| 7 | `public/app/plugins/panel/` | 76 | 157 | 555.1 |
| 8 | `pkg/api/` | 73 | 130 | 513.4 |
| 9 | `public/app/features/dashboard/` | 64 | 151 | 463.9 |
| 10 | `public/app/features/explore/` | 47 | 95 | 309.5 |

## Frontend Modernization
- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 files
- **stylesFactory**: 16 files

Top class-component areas:
- `features/dashboard`: 10
- `plugins/datasource`: 12
- `plugins/panel`: 11
- `features/explore`: 8

## Type Safety
- **Explicit `any`**: 393 occurrences across 137 files
- **`@deprecated` APIs**: 46 files

Top explicit `any` files:
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

## Comment Debt
- **Frontend TODO/FIXME/HACK/XXX**: 602 occurrences
- **Backend TODO/FIXME/HACK/XXX**: 851 occurrences

Frontend hotspots (sample):
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10
- `public/app/features/panel/panellinks/specs/link_srv.test.ts` — 8

Backend hotspots (sample):
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/registry/apis/provisioning/register.go` — 10
- `pkg/services/org/orgimpl/org.go` — 10
- `pkg/storage/unified/resource/datastore.go` — 10

## Go Quality
- **`nolint` directives**: 1274 occurrences
- **Oversized files (>800 loc)**: 66 files
- **Deprecated Go APIs**: 58 files

Top `nolint` files:
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_ruler_test.go` — 25
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25
- `pkg/tests/api/annotations/annotations_test.go` — 19

Top oversized non-generated files:
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

## Feature Toggles
- **Deprecated toggles in registry**: 3
- **Old IsEnabled API call sites**: 161 files

Deprecated toggles:
| Toggle Name | Description |
|---|---|
| `prometheusAzureOverrideAudience` | Deprecated. Allow override default AAD audience for Azure Prometheus endpoint. Enabled by default. This feature should no longer be used and will be removed in the future. |
| `localeFormatPreference` | Specifies the locale so the correct format for numbers and dates can be shown |
| `prometheusTypeMigration` | Checks for deprecated Prometheus authentication methods (SigV4 and Azure), installs the relevant data source, and migrates the Prometheus data sources |

## Recommended Actions
1. **Modernize dashboard legacy React patterns** (use `migrate-class-components` skill) — 10 class components and 9 connect() usages with 151 commits in 6 months.
2. **Modernize Explore TraceView styling and lifecycle usage** — 7 stylesFactory files and the only unsafe lifecycle callsite are in Explore TraceView.
3. **Split oversized high-churn Go files** — 66 non-generated files exceed 800 LOC, with several above 2000 LOC in high-churn areas.
4. **Migrate old IsEnabled API callsites** (see `pkg/services/featuremgmt/` docs) — Old APIs remain in 161 files and block feature toggle modernization.
5. **Reduce explicit any in top offenders** — 393 explicit any occurrences across 137 files.
6. **Reduce backend TODO and nolint in top hotspots** — pkg/registry (177 signals) and pkg/services/ngalert (142 signals) are highest-priority backend debt hotspots.

## Change Log

### 2026-05-11 (current scan)

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
| Backend TODO/FIXME/HACK | 894 | 851 | -43 |
| nolint directives | 1275 | 1274 | -1 |
| Oversized Go files (>800 loc) | 67 | 66 | -1 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 161 | -1 |

**Resolved since last scan:**
- No category fully resolved; class/connect/style counts are unchanged.

**New since last scan:**
- `@deprecated` frontend API files dropped to 46.
- Frontend TODO/FIXME/HACK markers dropped to 602.
- Backend TODO/FIXME/HACK markers dropped to 851.
- Old IsEnabled API files dropped to 161 (still high).

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
