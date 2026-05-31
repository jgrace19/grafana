# Tech Debt Report — All Scopes — 2026-05-31

## Hotspots (high debt × high churn)

Priority score = debt signals × log₂(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|-------------------|----------------|
| 1 | `pkg/registry/` | 327 | 505 | 2937.44 |
| 2 | `pkg/tests/` | 322 | 461 | 2850.26 |
| 3 | `public/app/plugins/datasource/` | 285 | 141 | 2037.68 |
| 4 | `pkg/storage/` | 240 | 309 | 1986.27 |
| 5 | `pkg/services/ngalert/` | 211 | 151 | 1529.31 |
| 6 | `public/app/features/dashboard/` | 151 | 128 | 1058.70 |
| 7 | `public/app/features/alerting/` | 132 | 212 | 1020.98 |
| 8 | `public/app/plugins/panel/` | 115 | 141 | 822.22 |
| 9 | `pkg/api/` | 113 | 116 | 776.35 |
| 10 | `pkg/services/libraryelements/` | 122 | 12 | 451.45 |

## Frontend Modernization

- **Class components**: 61 files
- `public/app/plugins/datasource/` — 12 files
- `public/app/plugins/panel/` — 11 files
- `public/app/features/dashboard/` — 10 files
- `public/app/features/explore/` — 8 files
- `public/app/features/variables/` — 4 files
- `public/app/core/` — 4 files
- `public/app/features/query/` — 3 files

- **connect() HOC**: 41 files
- `public/app/features/dashboard/` — 9 files
- `public/app/features/explore/` — 8 files
- `public/app/features/admin/` — 5 files
- `public/app/features/variables/` — 4 files
- `public/app/features/auth-config/` — 3 files
- `public/app/features/users/` — 2 files

- **Unsafe lifecycles**: 1 files
  - `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`

- **stylesFactory**: 16 files
- `public/app/features/explore/` — 7 files
- `public/app/plugins/panel/` — 4 files
- `public/app/features/dashboard/` — 2 files
- `public/app/features/inspector/` — 1 files
- `public/app/plugins/datasource/` — 1 files
- `public/app/features/query/` — 1 files

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
- Top files:
  - `public/app/features/dashboard/state/DashboardModel.ts` — 23
  - `public/app/core/time_series2.ts` — 19
  - `public/app/plugins/datasource/opentsdb/datasource.ts` — 16
  - `public/app/features/dashboard/state/DashboardMigrator.ts` — 16
  - `public/app/features/dashboard/state/PanelModel.ts` — 13
  - `public/app/plugins/datasource/influxdb/query_part.ts` — 12
  - `public/app/plugins/datasource/influxdb/datasource.ts` — 11
  - `public/app/features/alerting/state/query_part.ts` — 10
  - `public/app/features/dashboard/state/DashboardMigrator.test.ts` — 10
  - `public/app/plugins/datasource/graphite/graphite_query.ts` — 9

- **@deprecated APIs**: 46 files
  - `public/app/types/events.ts`
  - `public/app/types/unified-alerting.ts`
  - `public/app/types/folders.ts`
  - `public/app/api/clients/playlist/v1/index.ts`
  - `public/app/core/utils/richHistoryTypes.ts`
  - `public/app/core/utils/kbn.ts`
  - `public/app/core/time_series2.ts`
  - `public/app/features/library-panels/types.ts`

## Comment Debt

- **Frontend TODO/FIXME/HACK/XXX**: 602 occurrences
- Top files:
  - `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
  - `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
  - `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
  - `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
  - `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10
  - `public/app/features/panel/panellinks/specs/link_srv.test.ts` — 8
  - `public/app/plugins/panel/xychart/SeriesEditor.tsx` — 7
  - `public/app/plugins/datasource/azuremonitor/components/MetricsQueryEditor/AdvancedResourcePicker.tsx` — 7

- **Backend TODO/FIXME/HACK/XXX**: 894 occurrences
- Top files:
  - `pkg/storage/secret/metadata/query.go` — 17
  - `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
  - `pkg/tsdb/cloudwatch/kinds/dataquery/types_dataquery_gen.go` — 13
  - `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
  - `pkg/registry/apis/provisioning/register.go` — 10
  - `pkg/services/org/orgimpl/org.go` — 10
  - `pkg/storage/unified/resource/datastore.go` — 10
  - `pkg/storage/unified/sql/queries.go` — 9

## Go Quality

- **nolint directives**: 1274 occurrences
- Top files:
  - `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
  - `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
  - `pkg/services/dashboards/service/dashboard_service.go` — 26
  - `pkg/tests/api/alerting/api_ruler_test.go` — 25
  - `pkg/tests/api/alerting/api_prometheus_test.go` — 25
  - `pkg/services/libraryelements/libraryelements_patch_test.go` — 19
  - `pkg/tests/api/annotations/annotations_test.go` — 19
  - `pkg/services/annotations/annotationsimpl/xorm_store_test.go` — 17

- **Oversized files (>800 loc)**: 68 files
- Top actionable files (non-test, non-generated):
  - `pkg/services/featuremgmt/registry.go` — 2828 LOC
  - `pkg/setting/setting.go` — 2432 LOC
  - `pkg/services/dashboards/service/dashboard_service.go` — 2410 LOC
  - `pkg/storage/unified/search/bleve.go` — 2192 LOC
  - `pkg/storage/unified/resource/storage_backend.go` — 2189 LOC
  - `pkg/util/xorm/core/core.go` — 2176 LOC
  - `pkg/storage/unified/resource/server.go` — 1941 LOC
  - `pkg/services/ngalert/store/alert_rule.go` — 1873 LOC
  - `pkg/services/ngalert/models/testing.go` — 1650 LOC
  - `pkg/registry/apis/provisioning/register.go` — 1579 LOC
  - `pkg/storage/unified/resource/search.go` — 1551 LOC
  - `pkg/services/live/live.go` — 1477 LOC

- **Deprecated Go APIs**: 65 files

## Feature Toggles

- **Deprecated toggles with active call sites**:
- `prometheusAzureOverrideAudience` — 3 runtime files (sample: pkg/tsdb/prometheus/prometheus.go, pkg/tsdb/prometheus/azureauth/azure_test.go, pkg/tsdb/prometheus/azureauth/azure.go)
- `localeFormatPreference` — no runtime call sites found outside generated accessor file
- `prometheusTypeMigration` — no runtime call sites found outside generated accessor file

- **Old IsEnabled API call sites**: 161 files

## Recommended Actions

1. **Migrate dashboard class components and connect() HOCs to hooks** — Dashboard legacy React footprint: 10 class component files and 9 connect() files under public/app/features/dashboard/. Dashboard is a top debt/churn hotspot in the latest scan. Uses the **`migrate-class-components`** remediation skill.
2. **Modernize Explore TraceView legacy styling/lifecycle patterns** — TraceView still has 10 files with class/connect/stylesFactory/unsafe lifecycle signals. Contains unsafe lifecycle usage and concentrated stylesFactory debt.
3. **Split oversized Go files in high-impact backend services** — Largest actionable files include `pkg/services/featuremgmt/registry.go` (2828 LOC), `pkg/setting/setting.go` (2432 LOC), `pkg/services/dashboards/service/dashboard_service.go` (2410 LOC), and `pkg/storage/unified/resource/storage_backend.go` (2189 LOC). There are 68 oversized Go files over 800 LOC; prioritize non-test, non-generated files first.
4. **Migrate old IsEnabled API call sites to OpenFeature and remove deprecated toggles** — 161 files still call IsEnabled/IsEnabledGlobally and 3 toggles are marked deprecated. OpenFeature is the supported path; legacy APIs increase cleanup burden. Reference: `pkg/services/featuremgmt/` migration docs.
5. **Reduce explicit any in top TypeScript offenders** — Found 393 explicit any occurrences across 137 files. High any usage weakens type guarantees and increases runtime risk.
6. **Reduce backend TODO/FIXME/HACK and nolint density in top-churn packages** — Backend scan found 894 TODO/FIXME/HACK/XXX markers and 1274 nolint directives. Concentrated suppressions and backlog comments hide maintenance risk in active code.

## Change Log

### 2026-05-31 (current scan)

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
| nolint directives | 1,275 | 1,274 | -1 |
| Oversized Go files (>800 loc) | 67 | 68 | +1 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 161 | -1 |

**Resolved since last scan:**
- @deprecated APIs: 51 → 46 (-5)
- Frontend TODO/FIXME/HACK: 618 → 602 (-16)
- nolint directives: 1,275 → 1,274 (-1)
- Old IsEnabled API files: 162 → 161 (-1)

**New since last scan:**
- Oversized Go files (>800 loc): 67 → 68 (+1)

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
