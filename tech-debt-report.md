# Tech Debt Report — all — 2026-05-28

## Hotspots (high debt × high churn)

Priority score = debt signals × log2(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|-------------------|----------------|
| 1 | `pkg/registry/` | 328 | 507 | 2948.29 |
| 2 | `pkg/tests/` | 322 | 462 | 2851.27 |
| 3 | `public/app/plugins/datasource/` | 285 | 142 | 2040.56 |
| 4 | `pkg/storage/` | 241 | 310 | 1995.67 |
| 5 | `pkg/services/ngalert/` | 213 | 151 | 1543.81 |
| 6 | `public/app/features/dashboard/` | 151 | 131 | 1063.7 |
| 7 | `public/app/features/alerting/` | 132 | 214 | 1022.76 |
| 8 | `pkg/services/libraryelements/` | 122 | 12 | 451.45 |
| 9 | `public/app/plugins/panel/` | 115 | 142 | 823.39 |
| 10 | `pkg/api/` | 113 | 116 | 776.35 |

## Frontend Modernization

- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 files
- **stylesFactory**: 16 files

Top class component areas:
- `features/dashboard/` — 10 files
- `features/explore/` — 8 files
- `features/variables/` — 4 files
- `features/query/` — 3 files
- `features/inspector/` — 2 files
- `plugins/datasource/` — 12 files
- `plugins/panel/` — 11 files

Top connect() areas:
- `features/dashboard/` — 9 files
- `features/explore/` — 8 files
- `features/admin/` — 5 files
- `features/variables/` — 4 files
- `features/auth-config/` — 3 files
- `features/org/` — 2 files

Top stylesFactory areas:
- `features/explore/` — 7 files
- `features/dashboard/` — 2 files
- `features/inspector/` — 1 files
- `features/query/` — 1 files
- `plugins/panel/` — 4 files
- `plugins/datasource/` — 1 files

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 46 files

Top explicit `any` files:
- `public/app/features/dashboard/state/DashboardModel.ts` — 23
- `public/app/core/time_series2.ts` — 19
- `public/app/features/dashboard/state/DashboardMigrator.ts` — 16
- `public/app/plugins/datasource/opentsdb/datasource.ts` — 16
- `public/app/features/dashboard/state/PanelModel.ts` — 13
- `public/app/plugins/datasource/influxdb/query_part.ts` — 12
- `public/app/plugins/datasource/influxdb/datasource.ts` — 11
- `public/app/features/dashboard/state/DashboardMigrator.test.ts` — 10
- `public/app/features/alerting/state/query_part.ts` — 10
- `public/app/features/explore/TraceView/components/model/link-patterns.tsx` — 9

## Comment Debt

- **Frontend TODO/FIXME/HACK**: 602 occurrences
- **Backend TODO/FIXME/HACK**: 894 occurrences

Top frontend comment-density files:
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10
- `public/app/features/panel/panellinks/specs/link_srv.test.ts` — 8

Top backend comment-density files (non-generated):
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/storage/unified/resource/datastore.go` — 10
- `pkg/services/org/orgimpl/org.go` — 10
- `pkg/registry/apis/provisioning/register.go` — 10

## Go Quality

- **nolint directives**: 1274 occurrences
- **Oversized files (>800 loc)**: 78 files
- **Deprecated Go APIs**: 65 files

Top nolint-density files:
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_ruler_test.go` — 25
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25
- `pkg/tests/api/annotations/annotations_test.go` — 19
- `pkg/services/libraryelements/libraryelements_patch_test.go` — 19
- `pkg/services/annotations/annotationsimpl/xorm_store_test.go` — 17

Top oversized non-test Go files (non-generated):

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

- **Deprecated toggles with active call sites:**
- `prometheusAzureOverrideAudience` - 3 active non-generated call-site files
- `localeFormatPreference` - 0 active non-generated call-site files
- `prometheusTypeMigration` - 0 active non-generated call-site files
- **Old IsEnabled API call sites**: 162 files

## Recommended Actions
1. **Migrate dashboard class components to function components** — Dashboard has 10 class components and 9 connect() usages in a high-churn area. Use the `migrate-class-components` skill to migrate the top files in `public/app/features/dashboard/`.
2. **Modernize Explore TraceView (stylesFactory + unsafe lifecycle)** — TraceView contains 7 stylesFactory usages, 1 unsafe lifecycle usage, 4 class component(s), and 0 connect() usage(s). Refactor together to avoid partial regressions.
3. **Split oversized Go files (setting.go, dashboard_service.go, storage_backend.go)** — Break up the biggest non-generated Go files in active areas into smaller modules to reduce review and change risk.
4. **Migrate IsEnabled API call sites to OpenFeature** — There are 162 files still using IsEnabled/IsEnabledGlobally. Migrate by package in batches via featuremgmt OpenFeature interfaces.
5. **Reduce explicit any in top 10 frontend files** — Explicit any appears 393 times across 137 files. Start with the top 10 offenders for highest leverage.
6. **Clean up deprecated feature toggles** — 3 toggles remain at FeatureStageDeprecated; remove or hard-code behavior and clean call sites.

Remediation links:
- Class components / connect(): `migrate-class-components` skill
- Feature toggle migration docs: `pkg/services/featuremgmt/`

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

### 2026-05-28 (current scan)

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
| nolint directives | 1275 | 1274 | -1 |
| Oversized Go files (>800 loc) | 67 | 78 | +11 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 162 | 0 |

**Resolved since last scan:**
- @deprecated APIs decreased by 5 (51 -> 46).
- Frontend TODO/FIXME/HACK decreased by 16 (618 -> 602).
- nolint directives decreased by 1 (1275 -> 1274).

**New since last scan:**
- Oversized Go files (>800 loc) increased by 11 (67 -> 78).
