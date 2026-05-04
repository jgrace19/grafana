# Tech Debt Report — All Scopes — 2026-05-04

## Hotspots (high debt × high churn)

Priority score = debt signals × log2(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|---------------------|----------------|
| 1 | `pkg/registry/` | 327 | 578 | 3001.02 |
| 2 | `pkg/tests/` | 322 | 496 | 2884.19 |
| 3 | `public/app/plugins/datasource/` | 285 | 172 | 2118.87 |
| 4 | `pkg/storage/` | 241 | 346 | 2033.75 |
| 5 | `pkg/services/ngalert/` | 211 | 176 | 1575.66 |
| 6 | `public/app/features/dashboard/` | 151 | 156 | 1101.49 |
| 7 | `public/app/features/alerting/` | 133 | 249 | 1059.45 |
| 8 | `public/app/plugins/panel/` | 115 | 159 | 842.02 |
| 9 | `pkg/api/` | 113 | 136 | 802.08 |
| 10 | `public/app/core/` | 82 | 164 | 604.04 |

## Frontend Modernization

- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 files
- **stylesFactory**: 16 files

Top buckets:
- Class components: `public/app/plugins/datasource/` (12 files)
- Class components: `public/app/plugins/panel/` (11 files)
- Class components: `public/app/features/dashboard/` (10 files)
- connect() HOC: `public/app/features/dashboard/` (9 files)
- connect() HOC: `public/app/features/explore/` (8 files)
- connect() HOC: `public/app/features/admin/` (5 files)
- stylesFactory: `public/app/features/explore/` (7 files)
- stylesFactory: `public/app/plugins/panel/` (4 files)
- stylesFactory: `public/app/features/dashboard/` (2 files)

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 47 files

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
- `public/app/plugins/datasource/graphite/graphite_query.ts` — 9

## Comment Debt

- **Frontend TODO/FIXME/HACK/XXX**: 602 occurrences
- **Backend TODO/FIXME/HACK/XXX**: 851 occurrences

Highest-density frontend comment files:
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10
- `public/app/features/panel/panellinks/specs/link_srv.test.ts` — 8
- `public/app/plugins/panel/xychart/SeriesEditor.tsx` — 7
- `public/app/plugins/datasource/azuremonitor/components/MetricsQueryEditor/AdvancedResourcePicker.tsx` — 7

Highest-density backend comment files:
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/storage/unified/resource/datastore.go` — 10
- `pkg/registry/apis/provisioning/register.go` — 10
- `pkg/services/org/orgimpl/org.go` — 10
- `pkg/storage/unified/sql/queries.go` — 9
- `pkg/registry/apis/provisioning/resources/dualwriter.go` — 8

## Go Quality

- **nolint directives**: 1275 occurrences
- **Oversized files (>800 LOC)**: 66 files
- **Deprecated Go APIs**: 58 files

Top nolint density files:
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_ruler_test.go` — 25
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25
- `pkg/services/libraryelements/libraryelements_patch_test.go` — 19
- `pkg/tests/api/annotations/annotations_test.go` — 19
- `pkg/services/preference/prefimpl/store_test.go` — 17

Largest actionable Go files (excluding generated/test files):
- `pkg/tests/apis/provisioning/common/testing.go` — 2835 lines
- `pkg/services/featuremgmt/registry.go` — 2828 lines
- `pkg/storage/unified/testing/storage_backend_sql_compatibility.go` — 2674 lines
- `pkg/apiserver/storage/testing/store_tests.go` — 2667 lines
- `pkg/setting/setting.go` — 2432 lines
- `pkg/services/dashboards/service/dashboard_service.go` — 2410 lines
- `pkg/storage/unified/search/bleve.go` — 2192 lines
- `pkg/storage/unified/resource/storage_backend.go` — 2189 lines
- `pkg/util/xorm/core/core.go` — 2176 lines
- `pkg/storage/unified/testing/storage_backend.go` — 2087 lines
- `pkg/storage/unified/resource/server.go` — 1941 lines
- `pkg/services/ngalert/store/alert_rule.go` — 1873 lines

## Feature Toggles

- **Deprecated toggles with active call sites**:
  - `prometheusAzureOverrideAudience` — 3 active file(s)
  - `localeFormatPreference` — 0 active file(s)
  - `prometheusTypeMigration` — 0 active file(s)
- **Old IsEnabled API call sites**: 161 files

## Recommended Actions
1. **Migrate legacy React patterns in dashboard and explore** using the `migrate-class-components` skill (targets: class components, `connect()` HOC, and `stylesFactory` in `public/app/features/dashboard/` and `public/app/features/explore/`).
2. **Reduce explicit `any` in highest-impact files** (start with `DashboardModel.ts`, `time_series2.ts`, `DashboardMigrator.ts`, and datasource editors under `public/app/plugins/datasource/`).
3. **Trim frontend TODO/FIXME backlog in datasource and panel plugins** by converting open TODOs into tickets or implementing quick wins (highest density in Azure/MSSQL/Prometheus credential forms).
4. **Address backend hotspot debt in `pkg/registry/`, `pkg/storage/`, and `pkg/services/ngalert/`** by reducing TODO/FIXME and `nolint` suppressions in actively changing files.
5. **Split oversized Go files (>800 LOC)**, prioritizing non-generated, non-test files like `pkg/services/featuremgmt/registry.go`, `pkg/setting/setting.go`, and `pkg/services/dashboards/service/dashboard_service.go`.
6. **Continue OpenFeature migration** by removing old `IsEnabled`/`IsEnabledGlobally` call sites (`161` files remain) and cleaning deprecated toggles in `pkg/services/featuremgmt/` docs/code.

## Change Log

### 2026-05-04 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | 0 |
| connect() HOC | 41 | 41 | 0 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory | 16 | 16 | 0 |
| Explicit `any` | 393 | 393 | 0 |
| `any` files | 137 | 137 | 0 |
| @deprecated APIs | 51 | 47 | -4 |
| Frontend TODO/FIXME/HACK | 618 | 602 | -16 |
| Backend TODO/FIXME/HACK | 894 | 851 | -43 |
| nolint directives | 1275 | 1275 | 0 |
| Oversized Go files (>800 loc) | 67 | 66 | -1 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 161 | -1 |

**Resolved since last scan:**
- @deprecated APIs decreased (51 → 47, -4)
- Frontend TODO/FIXME/HACK decreased (618 → 602, -16)
- Backend TODO/FIXME/HACK decreased (894 → 851, -43)
- Oversized Go files (>800 loc) decreased (67 → 66, -1)
- Old IsEnabled API files decreased (162 → 161, -1)

**New since last scan:**
- None detected from metric-level diff

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
