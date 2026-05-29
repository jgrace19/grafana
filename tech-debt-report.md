# Tech Debt Report — all — 2026-05-29

## Hotspots (high debt × high churn)

Priority score = debt signals × log2(commits + 1), lookback = **6 months**

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|----------------------|----------------|
| 1 | `pkg/registry/` | 327 | 505 | 2937.44 |
| 2 | `pkg/tests/` | 322 | 461 | 2850.26 |
| 3 | `public/app/plugins/datasource/` | 285 | 141 | 2037.68 |
| 4 | `pkg/storage/` | 240 | 309 | 1986.27 |
| 5 | `pkg/services/ngalert/` | 211 | 151 | 1529.31 |
| 6 | `public/app/features/dashboard/` | 151 | 128 | 1058.7 |
| 7 | `public/app/features/alerting/` | 132 | 212 | 1020.98 |
| 8 | `pkg/services/libraryelements/` | 122 | 12 | 451.45 |
| 9 | `public/app/plugins/panel/` | 115 | 141 | 822.22 |
| 10 | `pkg/api/` | 113 | 116 | 776.35 |

## Frontend Modernization

- **Class components**: 61 files
  - Top areas: `public/app/plugins/datasource/` (12), `public/app/plugins/panel/` (11), `public/app/features/dashboard/` (10), `public/app/features/explore/` (8), `public/app/core/` (4)
- **connect() HOC**: 41 files
  - Top areas: `public/app/features/dashboard/` (9), `public/app/features/explore/` (8), `public/app/features/admin/` (5), `public/app/features/variables/` (4), `public/app/features/auth-config/` (3)
- **Unsafe lifecycles**: 1 files
  - `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`
- **stylesFactory**: 16 files
  - Top areas: `public/app/features/explore/` (7), `public/app/plugins/panel/` (4), `public/app/features/dashboard/` (2), `public/app/features/inspector/` (1), `public/app/features/query/` (1)

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
- Top 10 files by `any` occurrences:
  - `public/app/features/dashboard/state/DashboardModel.ts` — 23
  - `public/app/core/time_series2.ts` — 19
  - `public/app/plugins/datasource/opentsdb/datasource.ts` — 16
  - `public/app/features/dashboard/state/DashboardMigrator.ts` — 16
  - `public/app/features/dashboard/state/PanelModel.ts` — 13
  - `public/app/plugins/datasource/influxdb/query_part.ts` — 12
  - `public/app/plugins/datasource/influxdb/datasource.ts` — 11
  - `public/app/features/dashboard/state/DashboardMigrator.test.ts` — 10
  - `public/app/features/alerting/state/query_part.ts` — 10
  - `public/app/features/explore/TraceView/components/model/link-patterns.tsx` — 9
- **@deprecated APIs**: 46 files
  - `public/app/api/clients/playlist/v1/index.ts`
  - `public/app/core/components/RolePicker/api.ts`
  - `public/app/core/history/richHistoryLocalStorageUtils.ts`
  - `public/app/core/services/__mocks__/backend_srv.ts`
  - `public/app/core/services/backend_srv.ts`
  - `public/app/core/time_series2.ts`
  - `public/app/core/utils/kbn.ts`
  - `public/app/core/utils/richHistoryTypes.ts`

## Comment Debt

- **Frontend TODO/FIXME/HACK**: 602 occurrences
- Frontend high-density files:
  - `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
  - `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
  - `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
  - `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
  - `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10
  - `public/app/features/panel/panellinks/specs/link_srv.test.ts` — 8
- **Backend TODO/FIXME/HACK**: 894 occurrences
- Backend high-density files:
  - `pkg/storage/secret/metadata/query.go` — 17
  - `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
  - `pkg/tsdb/cloudwatch/kinds/dataquery/types_dataquery_gen.go` — 13
  - `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
  - `pkg/services/org/orgimpl/org.go` — 10
  - `pkg/storage/unified/resource/datastore.go` — 10

## Go Quality

- **nolint directives**: 1274 occurrences
- Highest-density files:
  - `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
  - `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
  - `pkg/services/dashboards/service/dashboard_service.go` — 26
  - `pkg/tests/api/alerting/api_ruler_test.go` — 25
  - `pkg/tests/api/alerting/api_prometheus_test.go` — 25
  - `pkg/tests/api/annotations/annotations_test.go` — 19
- **Oversized files (>800 loc)**: 67 files
- Top actionable oversized files (non-generated, non-test):

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

- **Deprecated Go APIs**: 65 files

## Feature Toggles

- **Deprecated toggles with active call sites**:
  - `prometheusAzureOverrideAudience` — Deprecated. Allow override default AAD audience for Azure Prometheus endpoint. Enabled by default. This feature should no longer be used and will be removed in the future. (active files: 4)
  - `localeFormatPreference` — Specifies the locale so the correct format for numbers and dates can be shown (active files: 1)
  - `prometheusTypeMigration` — Checks for deprecated Prometheus authentication methods (SigV4 and Azure), installs the relevant data source, and migrates the Prometheus data sources (active files: 1)
- **Old IsEnabled API call sites**: 162 files

## Recommended Actions

1. **Migrate dashboard class components to function components** — Dashboard bucket has 151 signals and 128 commits in 6 months. Use migrate-class-components skill to convert class components and replace connect() with hooks incrementally.
2. **Modernize datasource plugin frontend legacy patterns** — Datasource plugins are hotspot #3 with 285 signals and 141 commits. Prioritize high-churn datasource editors; migrate class/connect patterns and tighten top any offenders while preserving plugin behavior.
3. **Split oversized Go files in high-churn services** — 67 oversized files remain; key examples include setting.go (2432 LOC) and dashboard_service.go (2410 LOC). Extract cohesive modules by domain (validation, persistence, orchestration) and keep existing test coverage green.
4. **Migrate IsEnabled API call sites to OpenFeature** — 162 files still call deprecated feature toggle APIs. Plan staged migration by package family, using pkg/services/featuremgmt docs and compatibility wrappers where needed.
5. **Reduce explicit any in top 10 frontend files** — There are 393 explicit any occurrences across 137 files. Introduce narrow interfaces/type guards and replace broad any with domain types in highest-density files first.
6. **Clean up deprecated feature toggles with active call sites** — 3 deprecated toggles remain with active references. Delete obsolete checks and fallback paths once behavior is defaulted; validate affected auth/data-source flows.
- Remediation skill: `migrate-class-components`
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

### 2026-05-29 (current scan)

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
| Oversized Go files (>800 loc) | 67 | 67 | 0 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 162 | 0 |

**Resolved since last scan:**
- 5 fewer **@deprecated APIs**
- 16 fewer **Frontend TODO/FIXME/HACK**
- 1 fewer **nolint directives**

**New since last scan:**
- None
