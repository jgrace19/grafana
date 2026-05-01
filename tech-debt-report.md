# Tech Debt Report — all — 2026-05-01

## Hotspots (high debt × high churn)

Priority score = debt signals × log2(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|-------------------|----------------|
| 1 | `public/app/plugins/datasource/` | 285 | 172 | 2118.87 |
| 2 | `pkg/registry/apis/` | 270 | 493 | 2416.06 |
| 3 | `pkg/services/ngalert/` | 211 | 178 | 1579.09 |
| 4 | `pkg/storage/unified/` | 205 | 319 | 1706.0 |
| 5 | `pkg/tests/api/` | 187 | 61 | 1113.43 |
| 6 | `public/app/features/dashboard/` | 151 | 156 | 1101.49 |
| 7 | `public/app/features/alerting/` | 133 | 249 | 1059.45 |
| 8 | `pkg/tests/apis/` | 126 | 433 | 1103.96 |
| 9 | `pkg/services/libraryelements/` | 122 | 14 | 476.64 |
| 10 | `public/app/plugins/panel/` | 115 | 159 | 842.02 |

## Frontend Modernization

- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 files
- **stylesFactory**: 16 files

Notable unsafe lifecycle file(s):
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 47 files

Top explicit `any` files:
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

## Comment Debt

- **Frontend TODO/FIXME/HACK**: 602 occurrences
- **Backend TODO/FIXME/HACK**: 851 occurrences

Highest-density frontend files (sample):
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10
- `public/app/features/panel/panellinks/specs/link_srv.test.ts` — 8

Highest-density backend files (sample):
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/storage/unified/resource/datastore.go` — 10
- `pkg/services/org/orgimpl/org.go` — 10
- `pkg/registry/apis/provisioning/register.go` — 10

## Go Quality

- **nolint directives**: 1275 occurrences
- **Oversized files (>800 loc)**: 66 files
- **Deprecated Go APIs**: 58 files

Highest-density `nolint` files:
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25
- `pkg/tests/api/alerting/api_ruler_test.go` — 25
- `pkg/services/libraryelements/libraryelements_patch_test.go` — 19
- `pkg/tests/api/annotations/annotations_test.go` — 19

Top oversized non-generated, non-test Go files:

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

- **Deprecated toggles with active call sites**: 3
| Toggle Name | Description |
|---|---|
| `localeFormatPreference` | Specifies the locale so the correct format for numbers and dates can be shown |
| `prometheusAzureOverrideAudience` | Deprecated. Allow override default AAD audience for Azure Prometheus endpoint. Enabled by default. This feature should no longer be used and will be removed in the future. |
| `prometheusTypeMigration` | Checks for deprecated Prometheus authentication methods (SigV4 and Azure), installs the relevant data source, and migrates the Prometheus data sources |

- **Old IsEnabled API call sites**: 161 files

## Recommended Actions
1. **Dashboard modernization**: continue migrating `public/app/features/dashboard/` class components and `connect()` usage via the `migrate-class-components` skill.
2. **Datasource plugin debt reduction**: prioritize `public/app/plugins/datasource/` where comment debt and explicit `any` usage remain highest.
3. **Explore TraceView cleanup**: remove the remaining unsafe lifecycle and convert remaining `stylesFactory` call sites to `useStyles2`.
4. **Oversized Go module splits**: split `pkg/setting/setting.go`, `pkg/services/dashboards/service/dashboard_service.go`, and `pkg/storage/unified/resource/storage_backend.go` into focused files.
5. **Feature toggle migration**: remove deprecated toggles and migrate remaining `IsEnabled` call sites to OpenFeature (`pkg/services/featuremgmt/`).
6. **Type-safety pass**: reduce explicit `any` in top offender files first (DashboardModel, time_series2, DashboardMigrator, PanelModel, OpenTSDB datasource).

## Change Log

### 2026-05-01 (current scan)

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
- 4 fewer in **@deprecated APIs**
- 16 fewer in **Frontend TODO/FIXME/HACK**
- 43 fewer in **Backend TODO/FIXME/HACK**
- 1 fewer in **Oversized Go files (>800 loc)**
- 1 fewer in **Old IsEnabled API files**

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
