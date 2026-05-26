# Tech Debt Report — All Scopes — 2026-05-26

## Hotspots (high debt × high churn)

Priority score = debt signals × log2(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|--------------------|----------------|
| 1 | `pkg/registry/` | 177 | 515 | 1594.99 |
| 2 | `pkg/services/ngalert/` | 142 | 154 | 1033.21 |
| 3 | `pkg/storage/` | 107 | 315 | 888.5 |
| 4 | `public/app/features/alerting/` | 90 | 219 | 700.32 |
| 5 | `pkg/tests/` | 73 | 466 | 647.31 |
| 6 | `public/app/plugins/datasource/` | 87 | 143 | 623.78 |
| 7 | `public/app/plugins/panel/` | 76 | 144 | 545.67 |
| 8 | `pkg/api/` | 73 | 117 | 502.43 |
| 9 | `public/app/features/dashboard/` | 64 | 134 | 452.92 |
| 10 | `public/app/features/explore/` | 47 | 84 | 301.24 |

## Frontend Modernization

- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 file
- **stylesFactory**: 16 files

Top class-component areas:
- `public/app/plugins/datasource/` — 12 files
- `public/app/plugins/panel/` — 11 files
- `public/app/features/dashboard/` — 10 files
- `public/app/features/explore/` — 8 files
- `public/app/core/` — 4 files
- `public/app/features/variables/` — 4 files
- `public/app/features/query/` — 3 files
- `public/app/features/inspector/` — 2 files

Top connect() areas:
- `public/app/features/dashboard/` — 9 files
- `public/app/features/explore/` — 8 files
- `public/app/features/admin/` — 5 files
- `public/app/features/variables/` — 4 files
- `public/app/features/auth-config/` — 3 files
- `public/app/features/org/` — 2 files
- `public/app/features/profile/` — 2 files
- `public/app/features/serviceaccounts/` — 2 files

Top stylesFactory areas:
- `public/app/features/explore/` — 7 files
- `public/app/plugins/panel/` — 4 files
- `public/app/features/dashboard/` — 2 files
- `public/app/features/inspector/` — 1 file
- `public/app/features/query/` — 1 file
- `public/app/plugins/datasource/` — 1 file

Unsafe lifecycle file:
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 45 files

Top explicit `any` offenders:
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

Sample `@deprecated` files:
- `public/app/api/clients/playlist/v1/index.ts`
- `public/app/core/components/RolePicker/api.ts`
- `public/app/core/history/richHistoryLocalStorageUtils.ts`
- `public/app/core/services/backend_srv.ts`
- `public/app/core/time_series2.ts`
- `public/app/core/utils/kbn.ts`
- `public/app/core/utils/richHistoryTypes.ts`
- `public/app/features/alerting/unified/hooks/useAbilities.ts`
- `public/app/features/alerting/unified/hooks/useHasRuler.ts`
- `public/app/features/alerting/unified/hooks/useUnifiedAlertingSelector.ts`

## Comment Debt

- **Frontend TODO/FIXME/HACK/XXX**: 602 occurrences
- **Backend TODO/FIXME/HACK/XXX**: 894 occurrences

Top frontend comment-density files:
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10
- `public/app/features/panel/panellinks/specs/link_srv.test.ts` — 8
- `public/app/plugins/panel/xychart/SeriesEditor.tsx` — 7
- `public/app/plugins/datasource/azuremonitor/components/MetricsQueryEditor/AdvancedResourcePicker.tsx` — 7
- `public/app/plugins/panel/geomap/layers/data/networkLayer.tsx` — 6
- `public/app/features/search/service/unified.ts` — 6

Top backend comment-density files (non-generated samples):
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/services/org/orgimpl/org.go` — 10
- `pkg/storage/unified/resource/datastore.go` — 10
- `pkg/registry/apis/provisioning/register.go` — 10
- `pkg/storage/unified/sql/queries.go` — 9
- `pkg/registry/apis/provisioning/resources/dualwriter.go` — 8
- `pkg/services/team/teamimpl/team.go` — 7
- `pkg/registry/apps/dashvalidator/register_test.go` — 7

## Go Quality

- **nolint directives**: 1274 occurrences
- **Oversized files (>800 loc, non-generated, non-_test.go)**: 66 files
- **Deprecated Go APIs**: 58 files

Top nolint-density files:
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_ruler_test.go` — 25
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25
- `pkg/tests/api/annotations/annotations_test.go` — 19
- `pkg/services/libraryelements/libraryelements_patch_test.go` — 19
- `pkg/services/annotations/annotationsimpl/xorm_store_test.go` — 17
- `pkg/services/preference/prefimpl/store_test.go` — 17
- `pkg/storage/unified/testing/kv.go` — 16

Top oversized Go files:
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

Sample deprecated Go API files:
- `pkg/api/api.go`
- `pkg/api/dashboard.go`
- `pkg/api/dashboard_permission.go`
- `pkg/api/dataproxy.go`
- `pkg/api/datasource/connections.go`
- `pkg/api/datasources.go`
- `pkg/api/dtos/dashboard.go`
- `pkg/api/dtos/folder.go`
- `pkg/api/dtos/frontend_settings.go`
- `pkg/api/dtos/prefs.go`

## Feature Toggles

- **Deprecated toggles in registry**: 3
- **Old IsEnabled/IsEnabledGlobally call sites**: 161 files

Deprecated toggles with active call sites:
| Toggle | Active non-generated call-site files | Sample call sites |
|--------|--------------------------------------|-------------------|
| `localeFormatPreference` | 0 | None (non-generated call sites not found) |
| `prometheusAzureOverrideAudience` | 3 | `pkg/tsdb/prometheus/azureauth/azure.go`, `pkg/tsdb/prometheus/azureauth/azure_test.go`, `pkg/tsdb/prometheus/prometheus.go` |
| `prometheusTypeMigration` | 0 | None (non-generated call sites not found) |

Top old IsEnabled call-site areas:
- `pkg/registry/` — 21 files
- `pkg/services/authn/` — 19 files
- `pkg/services/ngalert/` — 16 files
- `pkg/api/` — 15 files
- `pkg/services/publicdashboards/` — 10 files
- `pkg/tsdb/cloudwatch/` — 8 files
- `pkg/services/pluginsintegration/` — 7 files
- `pkg/services/accesscontrol/` — 5 files
- `pkg/services/featuremgmt/` — 5 files
- `pkg/storage/` — 5 files
- `pkg/expr/` — 4 files
- `pkg/services/apiserver/` — 3 files

## Recommended Actions

1. **Modernize remaining class/connect legacy React in dashboard/explore/plugins** using the `migrate-class-components` skill, starting with `public/app/features/dashboard/` and `public/app/features/explore/`.
2. **Finish TraceView modernization** by removing the last unsafe lifecycle and `stylesFactory` usage cluster in `public/app/features/explore/TraceView/`.
3. **Split oversized backend files in high-churn services** (`pkg/services/featuremgmt/registry.go`, `pkg/setting/setting.go`, `pkg/services/dashboards/service/dashboard_service.go`, `pkg/services/ngalert/store/alert_rule.go`).
4. **Reduce explicit `any` in top 10 offenders**, especially dashboard state and datasource modules.
5. **Prioritize backend debt cleanup in hotspot packages** (`pkg/registry/`, `pkg/services/ngalert/`, `pkg/storage/`, `pkg/api/`) by burning down TODO/FIXME/HACK and targeted nolint suppressions.
6. **Continue feature-toggle migration to OpenFeature**: remove remaining `IsEnabled` call sites and clean deprecated toggles under `pkg/services/featuremgmt/` docs and APIs.

## Change Log

### 2026-05-26 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | 0 |
| connect() HOC | 41 | 41 | 0 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory | 16 | 16 | 0 |
| Explicit `any` | 393 | 393 | 0 |
| `any` files | 137 | 137 | 0 |
| @deprecated APIs | 51 | 45 | -6 |
| Frontend TODO/FIXME/HACK | 618 | 602 | -16 |
| Backend TODO/FIXME/HACK | 894 | 894 | 0 |
| nolint directives | 1275 | 1274 | -1 |
| Oversized Go files (>800 loc) | 67 | 66 | -1 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 161 | -1 |

**Resolved since last scan:**
- 6 fewer in **@deprecated APIs** (51 -> 45)
- 16 fewer in **Frontend TODO/FIXME/HACK** (618 -> 602)
- 1 fewer in **nolint directives** (1275 -> 1274)
- 1 fewer in **Oversized Go files (>800 loc)** (67 -> 66)
- 1 fewer in **Old IsEnabled API files** (162 -> 161)

**New since last scan:**
- None

- Note: prior reports stored mostly summary metrics rather than full per-check file inventories, so resolved/new bullets are tracked at metric granularity for this run.


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
