# Tech Debt Report — all — 2026-05-13

## Hotspots (high debt × high churn)

Priority score = debt signals × log2(commits + 1), lookback = 6 months

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|-------------------|----------------|
| 1 | `pkg/registry/` | 177 | 546 | 1609.89 |
| 2 | `pkg/services/ngalert/` | 142 | 174 | 1058.07 |
| 3 | `pkg/storage/` | 107 | 336 | 898.44 |
| 4 | `public/app/features/alerting/` | 90 | 239 | 711.62 |
| 5 | `public/app/plugins/datasource/` | 87 | 164 | 640.87 |
| 6 | `public/app/plugins/panel/` | 76 | 155 | 553.69 |
| 7 | `pkg/tests/` | 73 | 480 | 650.42 |
| 8 | `pkg/api/` | 73 | 128 | 511.82 |
| 9 | `public/app/features/dashboard/` | 64 | 148 | 462.03 |
| 10 | `public/app/core/` | 47 | 157 | 343.28 |

## Frontend Modernization

- **Class components**: 61 files
  - `public/app/plugins/datasource/`: 12
  - `public/app/plugins/panel/`: 11
  - `public/app/features/dashboard/`: 10
  - `public/app/features/explore/`: 8
  - `public/app/core/`: 4
  - `public/app/features/variables/`: 4
- **connect() HOC**: 41 files
  - `public/app/features/dashboard/`: 9
  - `public/app/features/explore/`: 8
  - `public/app/features/admin/`: 5
  - `public/app/features/variables/`: 4
  - `public/app/features/auth-config/`: 3
  - `public/app/features/org/`: 2
- **Unsafe lifecycles**: 1 files
  - `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`
- **stylesFactory**: 16 files
  - `public/app/features/explore/`: 7
  - `public/app/plugins/panel/`: 4
  - `public/app/features/dashboard/`: 2
  - `public/app/features/inspector/`: 1
  - `public/app/features/query/`: 1
  - `public/app/plugins/datasource/`: 1

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
  - `public/app/features/dashboard/state/DashboardModel.ts`: 23
  - `public/app/core/time_series2.ts`: 19
  - `public/app/features/dashboard/state/DashboardMigrator.ts`: 16
  - `public/app/plugins/datasource/opentsdb/datasource.ts`: 16
  - `public/app/features/dashboard/state/PanelModel.ts`: 13
  - `public/app/plugins/datasource/influxdb/query_part.ts`: 12
  - `public/app/plugins/datasource/influxdb/datasource.ts`: 11
  - `public/app/features/alerting/state/query_part.ts`: 10
  - `public/app/features/dashboard/state/DashboardMigrator.test.ts`: 10
  - `public/app/features/explore/TraceView/components/model/link-patterns.tsx`: 9
- **@deprecated APIs**: 46 files
  - `public/app/api/clients/playlist/v1/index.ts`
  - `public/app/core/components/RolePicker/api.ts`
  - `public/app/core/history/richHistoryLocalStorageUtils.ts`
  - `public/app/core/services/__mocks__/backend_srv.ts`
  - `public/app/core/services/backend_srv.ts`
  - `public/app/core/time_series2.ts`
  - `public/app/core/utils/kbn.ts`
  - `public/app/core/utils/richHistoryTypes.ts`
  - `public/app/features/alerting/unified/hooks/useAbilities.ts`
  - `public/app/features/alerting/unified/hooks/useHasRuler.ts`

## Comment Debt

- **Frontend TODO/FIXME/HACK/XXX**: 602 occurrences
  - `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx`: 36
  - `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx`: 27
  - `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx`: 27
  - `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts`: 18
  - `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts`: 10
  - `public/app/features/panel/panellinks/specs/link_srv.test.ts`: 8
  - `public/app/plugins/panel/xychart/SeriesEditor.tsx`: 7
  - `public/app/plugins/datasource/azuremonitor/components/MetricsQueryEditor/AdvancedResourcePicker.tsx`: 7
  - `public/app/plugins/panel/geomap/layers/data/networkLayer.tsx`: 6
  - `public/app/features/browse-dashboards/api/browseDashboardsAPI.ts`: 6
- **Backend TODO/FIXME/HACK/XXX**: 851 occurrences
  - `pkg/storage/secret/metadata/query.go`: 17
  - `pkg/tests/apis/dashboard/integration/api_validation_test.go`: 16
  - `pkg/tests/apis/provisioning/jobs/deletejob_test.go`: 12
  - `pkg/registry/apis/provisioning/register.go`: 10
  - `pkg/services/org/orgimpl/org.go`: 10
  - `pkg/storage/unified/resource/datastore.go`: 10
  - `pkg/storage/unified/sql/queries.go`: 9
  - `pkg/registry/apis/provisioning/resources/dualwriter.go`: 8
  - `pkg/services/team/teamimpl/team.go`: 7
  - `pkg/registry/apps/dashvalidator/register_test.go`: 7

## Go Quality

- **nolint directives**: 1274 occurrences
  - `pkg/services/libraryelements/libraryelements_get_all_test.go`: 42
  - `pkg/tests/api/dashboards/api_dashboards_test.go`: 42
  - `pkg/services/dashboards/service/dashboard_service.go`: 26
  - `pkg/tests/api/alerting/api_ruler_test.go`: 25
  - `pkg/tests/api/alerting/api_prometheus_test.go`: 25
  - `pkg/services/libraryelements/libraryelements_patch_test.go`: 19
  - `pkg/tests/api/annotations/annotations_test.go`: 19
  - `pkg/services/preference/prefimpl/store_test.go`: 17
  - `pkg/services/annotations/annotationsimpl/xorm_store_test.go`: 17
  - `pkg/storage/unified/testing/kv.go`: 16
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

- **Deprecated toggles with active call sites**:

| Toggle | Active call-site files |
|--------|------------------------|
| `prometheusAzureOverrideAudience` | 3 |
| `localeFormatPreference` | 0 |
| `prometheusTypeMigration` | 0 |
- **Old IsEnabled API call sites**: 161 files

## Recommended Actions

1. **Migrate dashboard and Explore legacy React components** using the `migrate-class-components` skill (class + connect + stylesFactory + unsafe lifecycle concentrated in high-churn areas).
2. **Modernize plugin datasource and panel frontends** to reduce legacy React patterns and comment debt in `public/app/plugins/`.
3. **Split oversized backend files** (`pkg/services/featuremgmt/registry.go`, `pkg/setting/setting.go`, `pkg/services/dashboards/service/dashboard_service.go`) into smaller modules.
4. **Migrate old `IsEnabled` APIs to OpenFeature** across `pkg/` and remove remaining deprecated toggles in `pkg/services/featuremgmt/registry.go`.
5. **Reduce explicit `any` in top offenders** (`DashboardModel.ts`, `time_series2.ts`, `DashboardMigrator.ts`, datasource files).
6. **Prioritize backend cleanup in high-churn hotspots** (`pkg/registry/`, `pkg/services/ngalert/`, `pkg/storage/`) where TODO/nolint density is highest.

## Change Log

### 2026-05-13 (current scan)

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
- @deprecated APIs decreased by 5 (51 -> 46)
- Frontend TODO/FIXME/HACK decreased by 16 (618 -> 602)
- Backend TODO/FIXME/HACK decreased by 43 (894 -> 851)
- nolint directives decreased by 1 (1275 -> 1274)
- Oversized Go files (>800 loc) decreased by 1 (67 -> 66)
- Old IsEnabled API files decreased by 1 (162 -> 161)

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
