# Tech Debt Report — all — 2026-04-29

## Hotspots (high debt × high churn)

Priority score = debt signals × log2(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|----------------------|----------------|
| 1 | `pkg/registry/` | 327 | 594 | 3013.88 |
| 2 | `pkg/tests/` | 322 | 506 | 2893.44 |
| 3 | `public/app/plugins/datasource/` | 285 | 177 | 2130.58 |
| 4 | `pkg/storage/` | 240 | 350 | 2029.28 |
| 5 | `pkg/services/ngalert/` | 211 | 179 | 1580.78 |
| 6 | `public/app/features/dashboard/` | 151 | 160 | 1106.97 |
| 7 | `public/app/features/alerting/` | 132 | 257 | 1057.48 |
| 8 | `public/app/plugins/panel/` | 119 | 165 | 877.63 |
| 9 | `pkg/api/` | 113 | 140 | 806.77 |
| 10 | `pkg/services/libraryelements/` | 122 | 15 | 488.0 |

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
- `features/variables/` — 4 files

Top connect() areas:
- `features/dashboard/` — 9 files
- `features/explore/` — 8 files
- `features/admin/` — 5 files
- `features/variables/` — 4 files
- `features/auth-config/` — 3 files
- `features/org/` — 2 files

Top stylesFactory areas:
- `features/explore/` — 7 files
- `plugins/panel/` — 4 files
- `features/dashboard/` — 2 files
- `features/inspector/` — 1 files
- `features/query/` — 1 files
- `plugins/datasource/` — 1 files

Unsafe lifecycle call sites:
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`

## Type Safety

- **Explicit `any`**: 397 occurrences across 140 files
- **@deprecated APIs**: 46 files

Worst `any` offenders:
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

Sample files with `@deprecated` markers:
- `public/app/api/clients/playlist/v1/index.ts`
- `public/app/core/components/RolePicker/api.ts`
- `public/app/core/history/richHistoryLocalStorageUtils.ts`
- `public/app/core/services/__mocks__/backend_srv.ts`
- `public/app/core/services/backend_srv.ts`
- `public/app/core/time_series2.ts`
- `public/app/core/utils/kbn.ts`
- `public/app/core/utils/richHistoryTypes.ts`

## Comment Debt

- **Frontend TODO/FIXME/HACK/XXX**: 602 occurrences across 327 files
- **Backend TODO/FIXME/HACK/XXX**: 851 occurrences across 441 files

Highest-density frontend files (sample):
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10
- `public/app/features/panel/panellinks/specs/link_srv.test.ts` — 8

Highest-density backend files (sample):
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/registry/apis/provisioning/register.go` — 10
- `pkg/services/org/orgimpl/org.go` — 10
- `pkg/storage/unified/resource/datastore.go` — 10

## Go Quality

- **nolint directives**: 1274 occurrences across 486 files
- **Oversized files (>800 loc)**: 66 non-test files
- **Deprecated Go APIs**: 58 files

Highest-density nolint files (sample):
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25
- `pkg/tests/api/alerting/api_ruler_test.go` — 25
- `pkg/services/libraryelements/libraryelements_patch_test.go` — 19

Top actionable oversized files:

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

## Feature Toggles

- **Deprecated toggles in registry**: 3
- **Old IsEnabled API call sites**: 160 files

Deprecated toggles with active call sites:
- `localeFormatPreference` — no active non-registry call sites detected
- `prometheusAzureOverrideAudience` — active call sites: `pkg/tsdb/prometheus/prometheus.go`
- `prometheusTypeMigration` — no active non-registry call sites detected

## Recommended Actions

1. **Dashboard + Explore React modernization (Priority 1)**
   - Migrate remaining class components/connect() usage in `public/app/features/dashboard/` and `public/app/features/explore/`.
   - Use the **`migrate-class-components`** skill for the class/connect migrations.
2. **Datasource plugin debt reduction (Priority 1)**
   - Focus `public/app/plugins/datasource/` (285 signals, high churn): class components, TODO density, and explicit `any` in top offender files.
3. **Registry/storage backend cleanup (Priority 2)**
   - Tackle `pkg/registry/` and `pkg/storage/` hotspots: TODO/nolint cleanup and large-file decomposition in high-churn code paths.
4. **Alerting backend hardening (Priority 2)**
   - Reduce suppression density and oversized-file risk in `pkg/services/ngalert/` while preserving behavior and coverage.
5. **OpenFeature migration for old IsEnabled APIs (Priority 2)**
   - Migrate the remaining 160 files using `IsEnabled`/`IsEnabledGlobally` (highest concentration: `pkg/registry/`, `pkg/services/authn/`, `pkg/services/ngalert/`).
   - Follow `pkg/services/featuremgmt/` migration guidance.
6. **Top-offender strict typing sweep (Priority 3)**
   - Remove explicit `any` from the top 10 offender files first (DashboardModel, time_series2, DashboardMigrator, opentsdb datasource, PanelModel, etc.).

## Change Log

### 2026-04-29 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | 0 |
| connect() HOC | 41 | 41 | 0 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory | 16 | 16 | 0 |
| Explicit `any` | ~393 | 397 | +4 |
| `any` files | ~137 | 140 | +3 |
| @deprecated APIs | ~51 | 46 | -5 |
| Frontend TODO/FIXME/HACK | ~618 | 602 | -16 |
| Backend TODO/FIXME/HACK | ~894 | 851 | -43 |
| nolint directives | ~1275 | 1274 | -1 |
| Oversized Go files (>800 loc) | 67 | 66 | -1 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | ~162 | 160 | -2 |

**Resolved since last scan:**
- `@deprecated` API surface decreased by 5 files
- Frontend comment debt decreased by 16 occurrences
- Backend comment debt decreased by 43 occurrences
- 2 files no longer use old `IsEnabled` APIs
- 1 oversized non-test Go file dropped below 800 LOC

**New since last scan:**
- 4 new explicit `any` occurrences were introduced across 3 additional files


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
