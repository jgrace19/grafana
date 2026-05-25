# Tech Debt Report — all — 2026-05-25

## Hotspots (high debt × high churn)

Priority score = debt signals × log₂(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|--------------------|----------------|
| 1 | `public/app/plugins/datasource/` | 285 | 143 | 2043.43 |
| 2 | `pkg/registry/apis/` | 270 | 437 | 2369.19 |
| 3 | `pkg/services/ngalert/` | 211 | 156 | 1539.16 |
| 4 | `pkg/storage/unified/` | 204 | 297 | 1676.71 |
| 5 | `pkg/tests/api/` | 187 | 56 | 1090.75 |
| 6 | `public/app/features/dashboard/` | 151 | 134 | 1068.60 |
| 7 | `public/app/features/alerting/` | 132 | 220 | 1028.00 |
| 8 | `pkg/tests/apis/` | 126 | 409 | 1093.61 |
| 9 | `pkg/services/libraryelements/` | 122 | 12 | 451.45 |
| 10 | `public/app/plugins/panel/` | 115 | 144 | 825.69 |

## Frontend Modernization
- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 files
- **stylesFactory**: 16 files

## Type Safety
- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 46 files

Top explicit `any` hotspots:
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
- **Frontend TODO/FIXME/HACK**: 602 occurrences
- **Backend TODO/FIXME/HACK**: 851 occurrences

Top frontend comment hotspots:
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10

Top backend comment hotspots:
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/registry/apis/provisioning/register.go` — 10
- `pkg/services/org/orgimpl/org.go` — 10

## Go Quality
- **nolint directives**: 1,274 occurrences
- **Oversized files (>800 loc)**: 66 files
- **Deprecated Go APIs**: 58 files

Top `nolint` hotspots:
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25
- `pkg/tests/api/alerting/api_ruler_test.go` — 25

Top oversized files:
| File | Lines |
|------|-------|
| `pkg/tests/apis/provisioning/common/testing.go` | 2,835 |
| `pkg/services/featuremgmt/registry.go` | 2,828 |
| `pkg/storage/unified/testing/storage_backend_sql_compatibility.go` | 2,674 |
| `pkg/apiserver/storage/testing/store_tests.go` | 2,667 |
| `pkg/setting/setting.go` | 2,432 |
| `pkg/services/dashboards/service/dashboard_service.go` | 2,410 |
| `pkg/storage/unified/search/bleve.go` | 2,192 |
| `pkg/storage/unified/resource/storage_backend.go` | 2,189 |
| `pkg/util/xorm/core/core.go` | 2,176 |
| `pkg/storage/unified/testing/storage_backend.go` | 2,087 |

## Feature Toggles
- **Deprecated toggles with active call sites**: 3
- **Old IsEnabled API call sites**: 160 files

Deprecated toggles:
- `localeFormatPreference`
- `prometheusAzureOverrideAudience`
- `prometheusTypeMigration`

## Recommended Actions
1. **Migrate dashboard class components to function components**
   - What: `public/app/features/dashboard/` has 10 class components and 9 `connect()` call sites.
   - Why: Dashboard remains one of the highest-churn frontend areas and still carries legacy React/Redux patterns.
   - How: Use the `migrate-class-components` skill to convert class/connect patterns incrementally by feature slice.
   - Suggested Linear title: `[Tech Debt] Migrate dashboard class components to function components` (priority 2, 5 pts)
2. **Modernize Explore TraceView legacy patterns**
   - What: Explore TraceView still has 7 `stylesFactory` files and 1 unsafe lifecycle file(s).
   - Why: This is the only remaining unsafe lifecycle cluster and a concentrated modernization target.
   - How: Migrate `stylesFactory` to `useStyles2` and replace unsafe lifecycle methods with hooks/effects.
   - Suggested Linear title: `[Tech Debt] Modernize Explore TraceView (stylesFactory + unsafe lifecycle)` (priority 2, 5 pts)
3. **Split oversized Go files in core services**
   - What: 66 non-test Go files exceed 800 LOC; largest include `pkg/services/featuremgmt/registry.go`, `pkg/setting/setting.go`, and `pkg/services/dashboards/service/dashboard_service.go`.
   - Why: Very large files increase review overhead and regression risk in frequently touched backend subsystems.
   - How: Extract cohesive modules (validation, transport handlers, persistence adapters) into focused files/packages.
   - Suggested Linear title: `[Tech Debt] Split oversized Go files (setting.go, dashboard_service.go, storage_backend.go)` (priority 3, 8 pts)
4. **Migrate old IsEnabled APIs to OpenFeature and remove deprecated toggles**
   - What: 160 files still use `IsEnabled`/`IsEnabledGlobally`, and 3 deprecated toggles remain in the registry.
   - Why: Legacy feature-flag APIs slow OpenFeature adoption and keep dead toggle paths alive.
   - How: Use `pkg/services/featuremgmt/` migration guidance to replace old checks and delete deprecated toggles once call sites are removed.
   - Suggested Linear title: `[Tech Debt] Migrate IsEnabled API to OpenFeature` (priority 3, 13 pts)
5. **Reduce explicit any in top files**
   - What: `any` appears 393 times across 137 files.
   - Why: High `any` density hides type regressions and weakens refactor safety in core UI/state code.
   - How: Prioritize top offenders first and replace `any` with discriminated unions/interfaces in high-churn files.
   - Suggested Linear title: `[Tech Debt] Reduce explicit any in top 10 files` (priority 4, 2 pts)
6. **Reduce TODO/FIXME and nolint debt in backend hotspots**
   - What: Backend has 851 TODO/FIXME/HACK markers and 1274 `nolint` directives.
   - Why: High suppression/comment debt in active service packages hides maintainability and quality issues.
   - How: Audit top hotspot buckets first, removing stale comments and replacing broad `nolint` usage with targeted fixes.
   - Suggested Linear title: `[Tech Debt] Reduce backend TODO/FIXME/nolint in top hotspot packages` (priority 4, 3 pts)

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

### 2026-05-25 (current scan)

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
| nolint directives | 1,275 | 1,274 | -1 |
| Oversized Go files (>800 loc) | 67 | 66 | -1 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 160 | -2 |

**Resolved since last scan:**
- 5 fewer @deprecated apis
- 16 fewer frontend todo/fixme/hack
- 43 fewer backend todo/fixme/hack
- 1 fewer nolint directives
- 1 fewer oversized go files (>800 loc)
- 2 fewer old isenabled api files

**New since last scan:**
- None detected
