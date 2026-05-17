# Tech Debt Report — all — 2026-05-17

## Hotspots (high debt × high churn)

Priority score = debt signals × log2(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|----------------------|----------------|
| 1 | `pkg/registry/apis/` | 270 | 458 | 2387.43 |
| 2 | `public/app/plugins/datasource/` | 285 | 155 | 2076.34 |
| 3 | `pkg/storage/unified/` | 205 | 309 | 1696.61 |
| 4 | `pkg/services/ngalert/` | 211 | 171 | 1566.94 |
| 5 | `pkg/tests/api/` | 187 | 59 | 1104.59 |
| 6 | `pkg/tests/apis/` | 126 | 414 | 1095.82 |
| 7 | `public/app/features/dashboard/` | 151 | 145 | 1085.66 |
| 8 | `public/app/features/alerting/` | 133 | 233 | 1046.76 |
| 9 | `public/app/plugins/panel/` | 115 | 152 | 834.6 |
| 10 | `pkg/api/` | 113 | 127 | 791.0 |

## Frontend Modernization

- **Class components**: 61 files
  - Top areas: `public/app/plugins/datasource/` (12), `public/app/plugins/panel/` (11), `public/app/features/dashboard/` (10), `public/app/features/explore/` (8), `public/app/core/` (4), `public/app/features/variables/` (4)
- **connect() HOC**: 41 files
  - Top areas: `public/app/features/dashboard/` (9), `public/app/features/explore/` (8), `public/app/features/admin/` (5), `public/app/features/variables/` (4), `public/app/features/auth-config/` (3), `public/app/features/serviceaccounts/` (2)
- **Unsafe lifecycles**: 1 files
  - `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`
- **stylesFactory**: 16 files
  - Top areas: `public/app/features/explore/` (7), `public/app/plugins/panel/` (4), `public/app/features/dashboard/` (2), `public/app/plugins/datasource/` (1), `public/app/features/query/` (1), `public/app/features/inspector/` (1)

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
  - `public/app/features/dashboard/state/DashboardModel.ts` — 23
  - `public/app/core/time_series2.ts` — 19
  - `public/app/plugins/datasource/opentsdb/datasource.ts` — 16
  - `public/app/features/dashboard/state/DashboardMigrator.ts` — 16
  - `public/app/features/dashboard/state/PanelModel.ts` — 13
  - `public/app/plugins/datasource/influxdb/query_part.ts` — 12
  - `public/app/plugins/datasource/influxdb/datasource.ts` — 11
  - `public/app/features/dashboard/state/DashboardMigrator.test.ts` — 10
  - `public/app/features/alerting/state/query_part.ts` — 10
  - `public/app/plugins/datasource/graphite/graphite_query.ts` — 9
- **@deprecated APIs**: 47 files
  - `public/app/api/clients/playlist/v1/index.ts`
  - `public/app/core/components/RolePicker/api.ts`
  - `public/app/core/history/richHistoryLocalStorageUtils.ts`
  - `public/app/core/services/__mocks__/backend_srv.ts`
  - `public/app/core/services/backend_srv.ts`
  - `public/app/core/time_series2.ts`
  - `public/app/core/utils/kbn.ts`
  - `public/app/core/utils/richHistoryTypes.ts`
  - `public/app/features/alerting/unified/components/contact-points/mocks/mimirFlavoredServer.ts`
  - `public/app/features/alerting/unified/hooks/useAbilities.ts`

## Comment Debt

- **Frontend TODO/FIXME/HACK**: 602 occurrences
  - `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
  - `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
  - `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
  - `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
  - `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10
  - `public/app/features/panel/panellinks/specs/link_srv.test.ts` — 8
  - `public/app/plugins/panel/xychart/SeriesEditor.tsx` — 7
  - `public/app/plugins/datasource/azuremonitor/components/MetricsQueryEditor/AdvancedResourcePicker.tsx` — 7
- **Backend TODO/FIXME/HACK**: 851 occurrences
  - `pkg/storage/secret/metadata/query.go` — 17
  - `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
  - `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
  - `pkg/storage/unified/resource/datastore.go` — 10
  - `pkg/services/org/orgimpl/org.go` — 10
  - `pkg/registry/apis/provisioning/register.go` — 10
  - `pkg/storage/unified/sql/queries.go` — 9
  - `pkg/registry/apis/provisioning/resources/dualwriter.go` — 8

## Go Quality

- **nolint directives**: 1275 occurrences
  - `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
  - `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
  - `pkg/services/dashboards/service/dashboard_service.go` — 26
  - `pkg/tests/api/alerting/api_prometheus_test.go` — 25
  - `pkg/tests/api/alerting/api_ruler_test.go` — 25
  - `pkg/tests/api/annotations/annotations_test.go` — 19
  - `pkg/services/libraryelements/libraryelements_patch_test.go` — 19
  - `pkg/services/preference/prefimpl/store_test.go` — 17
- **Oversized files (>800 loc)**: 66 files
  - `pkg/services/featuremgmt/registry.go` — 2828 lines
  - `pkg/setting/setting.go` — 2432 lines
  - `pkg/services/dashboards/service/dashboard_service.go` — 2410 lines
  - `pkg/storage/unified/search/bleve.go` — 2192 lines
  - `pkg/storage/unified/resource/storage_backend.go` — 2189 lines
  - `pkg/util/xorm/core/core.go` — 2176 lines
  - `pkg/storage/unified/resource/server.go` — 1941 lines
  - `pkg/services/ngalert/store/alert_rule.go` — 1873 lines
  - `pkg/services/ngalert/models/testing.go` — 1650 lines
  - `pkg/registry/apis/provisioning/register.go` — 1579 lines
  - `pkg/storage/unified/resource/search.go` — 1551 lines
  - `pkg/services/live/live.go` — 1477 lines
  - `pkg/storage/unified/sql/backend.go` — 1426 lines
  - `pkg/services/ngalert/api/prometheus/api_prometheus.go` — 1395 lines
  - `pkg/services/ngalert/models/alert_rule.go` — 1322 lines
- **Deprecated Go APIs**: 58 files

## Feature Toggles

- **Deprecated toggles with active registry entries**:
  - `prometheusAzureOverrideAudience` — Deprecated. Allow override default AAD audience for Azure Prometheus endpoint. Enabled by default. This feature should no longer be used and will be removed in the future.
  - `localeFormatPreference` — Specifies the locale so the correct format for numbers and dates can be shown
  - `prometheusTypeMigration` — Checks for deprecated Prometheus authentication methods (SigV4 and Azure), installs the relevant data source, and migrates the Prometheus data sources
- **Old IsEnabled API call sites**: 161 files

## Recommended Actions

1. **Modernize dashboard React legacy patterns** (`public/app/features/dashboard/`) — convert class components + `connect()` usage using the `migrate-class-components` skill.
2. **Refactor datasource plugins with high debt/churn** (`public/app/plugins/datasource/`) — prioritize class components and `any` hotspots in InfluxDB/OpenTSDB/AzureMonitor.
3. **Address backend hotspot debt in `pkg/registry/apis/` and `pkg/storage/unified/`** — reduce TODO/FIXME density and remove unnecessary `nolint` suppressions in frequently changed paths.
4. **Split oversized backend files** (`pkg/services/featuremgmt/registry.go`, `pkg/setting/setting.go`, `pkg/services/dashboards/service/dashboard_service.go`, `pkg/storage/unified/resource/storage_backend.go`).
5. **Continue feature toggle migration** — remove deprecated toggles and migrate remaining `IsEnabled`/`IsEnabledGlobally` call sites to OpenFeature (`pkg/services/featuremgmt/`).
6. **Reduce explicit `any` in top offender files** — start with `DashboardModel.ts`, `time_series2.ts`, `DashboardMigrator.ts`, and `opentsdb/datasource.ts`.

## Change Log

### 2026-05-17 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | 0 |
| connect() HOC | 41 | 41 | 0 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory | 16 | 16 | 0 |
| Explicit `any` | 393 | 393 | 0 |
| `any` files | 137 | 137 | 0 |
| @deprecated APIs | 47 | 47 | 0 |
| Frontend TODO/FIXME/HACK | 602 | 602 | 0 |
| Backend TODO/FIXME/HACK | 851 | 851 | 0 |
| nolint directives | 1275 | 1275 | 0 |
| Oversized Go files (>800 loc) | 66 | 66 | 0 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 161 | 161 | 0 |

**Resolved since last scan:**
- None

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
