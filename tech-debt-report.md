# Tech Debt Report — all — 2026-05-27

## Hotspots (high debt × high churn)

Priority score = debt signals × log₂(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|----------------------|----------------|
| 1 | `pkg/registry/` | 327 | 510 | 2,942.08 |
| 2 | `pkg/tests/` | 318 | 464 | 2,817.83 |
| 3 | `public/app/plugins/datasource/` | 285 | 142 | 2,040.56 |
| 4 | `pkg/storage/` | 237 | 313 | 1,965.83 |
| 5 | `pkg/services/ngalert/` | 211 | 153 | 1,533.29 |
| 6 | `public/app/features/dashboard/` | 151 | 133 | 1,066.98 |
| 7 | `public/app/features/alerting/` | 132 | 215 | 1,023.65 |
| 8 | `public/app/plugins/panel/` | 115 | 142 | 823.39 |
| 9 | `pkg/api/` | 113 | 116 | 776.35 |
| 10 | `pkg/services/libraryelements/` | 122 | 12 | 451.45 |

## Frontend Modernization

- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 files
- **stylesFactory**: 16 files

Top areas (class components):
- `public/app/plugins/datasource/` - 12 files
- `public/app/plugins/panel/` - 11 files
- `public/app/features/dashboard/` - 10 files
- `public/app/features/explore/` - 8 files
- `public/app/core/` - 4 files

Top areas (connect HOC):
- `public/app/features/dashboard/` - 9 files
- `public/app/features/explore/` - 8 files
- `public/app/features/admin/` - 5 files
- `public/app/features/variables/` - 4 files
- `public/app/features/auth-config/` - 3 files

Top areas (stylesFactory):
- `public/app/features/explore/` - 7 files
- `public/app/plugins/panel/` - 4 files
- `public/app/features/dashboard/` - 2 files
- `public/app/features/inspector/` - 1 files
- `public/app/features/query/` - 1 files

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 46 files

Top explicit `any` files:
- `public/app/features/dashboard/state/DashboardModel.ts` - 23 occurrences
- `public/app/core/time_series2.ts` - 19 occurrences
- `public/app/features/dashboard/state/DashboardMigrator.ts` - 16 occurrences
- `public/app/plugins/datasource/opentsdb/datasource.ts` - 16 occurrences
- `public/app/features/dashboard/state/PanelModel.ts` - 13 occurrences
- `public/app/plugins/datasource/influxdb/query_part.ts` - 12 occurrences
- `public/app/plugins/datasource/influxdb/datasource.ts` - 11 occurrences
- `public/app/features/alerting/state/query_part.ts` - 10 occurrences
- `public/app/features/dashboard/state/DashboardMigrator.test.ts` - 10 occurrences
- `public/app/features/explore/TraceView/components/model/link-patterns.tsx` - 9 occurrences

## Comment Debt

- **Frontend TODO/FIXME/HACK/XXX**: 602 occurrences
- **Backend TODO/FIXME/HACK/XXX**: 853 occurrences

Highest-density frontend files:
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` - 36 occurrences
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` - 27 occurrences
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` - 27 occurrences
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` - 18 occurrences
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` - 10 occurrences
- `public/app/features/panel/panellinks/specs/link_srv.test.ts` - 8 occurrences
- `public/app/plugins/datasource/azuremonitor/components/MetricsQueryEditor/AdvancedResourcePicker.tsx` - 7 occurrences
- `public/app/plugins/panel/xychart/SeriesEditor.tsx` - 7 occurrences

Highest-density backend files:
- `pkg/storage/secret/metadata/query.go` - 17 occurrences
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` - 16 occurrences
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` - 12 occurrences
- `pkg/registry/apis/provisioning/register.go` - 10 occurrences
- `pkg/services/org/orgimpl/org.go` - 10 occurrences
- `pkg/storage/unified/resource/datastore.go` - 10 occurrences
- `pkg/storage/unified/sql/queries.go` - 9 occurrences
- `pkg/registry/apis/provisioning/resources/dualwriter.go` - 8 occurrences

## Go Quality

- **nolint directives**: 1,274 occurrences
- **Oversized files (>800 loc)**: 57 files
- **Deprecated Go APIs**: 62 files

Highest-density `nolint` files:
- `pkg/services/libraryelements/libraryelements_get_all_test.go` - 42 occurrences
- `pkg/tests/api/dashboards/api_dashboards_test.go` - 42 occurrences
- `pkg/services/dashboards/service/dashboard_service.go` - 26 occurrences
- `pkg/tests/api/alerting/api_prometheus_test.go` - 25 occurrences
- `pkg/tests/api/alerting/api_ruler_test.go` - 25 occurrences
- `pkg/services/libraryelements/libraryelements_patch_test.go` - 19 occurrences
- `pkg/tests/api/annotations/annotations_test.go` - 19 occurrences
- `pkg/services/annotations/annotationsimpl/xorm_store_test.go` - 17 occurrences

Top oversized non-test Go files:

| File | Lines |
|------|-------|
| `pkg/services/featuremgmt/registry.go` | 2,828 |
| `pkg/setting/setting.go` | 2,432 |
| `pkg/services/dashboards/service/dashboard_service.go` | 2,410 |
| `pkg/storage/unified/search/bleve.go` | 2,192 |
| `pkg/storage/unified/resource/storage_backend.go` | 2,189 |
| `pkg/util/xorm/core/core.go` | 2,176 |
| `pkg/storage/unified/resource/server.go` | 1,941 |
| `pkg/services/ngalert/store/alert_rule.go` | 1,873 |
| `pkg/services/ngalert/models/testing.go` | 1,650 |
| `pkg/registry/apis/provisioning/register.go` | 1,579 |
| `pkg/storage/unified/resource/search.go` | 1,551 |
| `pkg/services/live/live.go` | 1,477 |
| `pkg/storage/unified/sql/backend.go` | 1,426 |
| `pkg/services/ngalert/api/prometheus/api_prometheus.go` | 1,395 |
| `pkg/services/ngalert/models/alert_rule.go` | 1,322 |

## Feature Toggles

- **Deprecated toggles with active call sites**:
- `localeFormatPreference`
- `prometheusAzureOverrideAudience`
- `prometheusTypeMigration`
- **Old IsEnabled/IsEnabledGlobally API call sites**: 162 files

## Recommended Actions

1. **Reduce high-churn backend debt in `pkg/registry/` and `pkg/storage/`** (TODO/nolint concentration + high commit volume).
2. **Modernize datasource plugins under `public/app/plugins/datasource/`** (class components + `any` + comment debt).
3. **Refactor oversized Go files** beginning with `pkg/services/featuremgmt/registry.go`, `pkg/setting/setting.go`, and `pkg/services/dashboards/service/dashboard_service.go`.
4. **Migrate old feature toggle call sites** (`IsEnabled`/`IsEnabledGlobally`) to OpenFeature and remove deprecated toggles.
5. **Target strict typing in top frontend offenders** (Dashboard model/state files, core time-series, datasource query layers).
6. **Continue dashboard React modernization** using the `migrate-class-components` skill to retire class components/connect HOCs.

## Change Log

### 2026-05-27 (current scan)

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
| Backend TODO/FIXME/HACK | 894 | 853 | -41 |
| nolint directives | 1,275 | 1,274 | -1 |
| Oversized Go files (>800 loc) | 67 | 57 | -10 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 162 | 0 |

**Resolved since last scan:**
- @deprecated APIs reduced by 5 (51 -> 46)
- Frontend TODO/FIXME/HACK reduced by 16 (618 -> 602)
- Backend TODO/FIXME/HACK reduced by 41 (894 -> 853)
- nolint directives reduced by 1 (1,275 -> 1,274)
- Oversized Go files (>800 loc) reduced by 10 (67 -> 57)

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
