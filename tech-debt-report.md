# Tech Debt Report — all — 2026-05-23

## Hotspots (high debt × high churn)

Priority score = debt signals × log2(commits + 1), lookback = 6 months ago

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|-------------------|----------------|
| 1 | `pkg/registry/` | 327 | 521 | 2952.13 |
| 2 | `pkg/tests/` | 322 | 469 | 2858.24 |
| 3 | `public/app/plugins/datasource/` | 285 | 147 | 2054.69 |
| 4 | `pkg/storage/` | 240 | 320 | 1998.34 |
| 5 | `pkg/services/ngalert/` | 211 | 160 | 1546.82 |
| 6 | `public/app/features/dashboard/` | 151 | 135 | 1070.21 |
| 7 | `public/app/features/alerting/` | 132 | 223 | 1030.57 |
| 8 | `pkg/services/libraryelements/` | 122 | 12 | 451.45 |
| 9 | `public/app/plugins/panel/` | 115 | 145 | 826.83 |
| 10 | `pkg/api/` | 113 | 119 | 780.48 |

## Frontend Modernization

- **Class components**: 61 files
  - Top areas: `public/app/plugins/datasource/` (12), `public/app/plugins/panel/` (11), `public/app/features/dashboard/` (10), `public/app/features/explore/` (8), `public/app/core/` (4), `public/app/features/variables/` (4)
- **connect() HOC**: 41 files
  - Top areas: `public/app/features/dashboard/` (9), `public/app/features/explore/` (8), `public/app/features/admin/` (5), `public/app/features/variables/` (4), `public/app/features/auth-config/` (3), `public/app/features/org/` (2)
- **Unsafe lifecycles**: 1 file
  - `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`
- **stylesFactory**: 16 files
  - Top areas: `public/app/features/explore/` (7), `public/app/plugins/panel/` (4), `public/app/features/dashboard/` (2), `public/app/features/inspector/` (1), `public/app/features/query/` (1), `public/app/plugins/datasource/` (1)

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
- Top files by count:
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
- **@deprecated APIs**: 46 files

## Comment Debt

- **Frontend TODO/FIXME/HACK/XXX**: 602 occurrences
  - `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
  - `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
  - `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
  - `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
  - `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10
- **Backend TODO/FIXME/HACK/XXX**: 894 occurrences
  - `pkg/storage/secret/metadata/query.go` — 17
  - `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
  - `pkg/tsdb/cloudwatch/kinds/dataquery/types_dataquery_gen.go` — 13
  - `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
  - `pkg/storage/unified/resource/datastore.go` — 10

## Go Quality

- **nolint directives**: 1274 occurrences
  - `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
  - `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
  - `pkg/services/dashboards/service/dashboard_service.go` — 26
  - `pkg/tests/api/alerting/api_prometheus_test.go` — 25
  - `pkg/tests/api/alerting/api_ruler_test.go` — 25
- **Oversized files (>800 loc)**: 67 files

| File | Lines |
|------|-------|
| `pkg/tests/apis/provisioning/common/testing.go` | 2836 |
| `pkg/services/featuremgmt/registry.go` | 2829 |
| `pkg/storage/unified/testing/storage_backend_sql_compatibility.go` | 2675 |
| `pkg/apiserver/storage/testing/store_tests.go` | 2668 |
| `pkg/setting/setting.go` | 2433 |
| `pkg/services/dashboards/service/dashboard_service.go` | 2411 |
| `pkg/storage/unified/search/bleve.go` | 2193 |
| `pkg/storage/unified/resource/storage_backend.go` | 2190 |
| `pkg/util/xorm/core/core.go` | 2177 |
| `pkg/storage/unified/testing/storage_backend.go` | 2088 |
| `pkg/storage/unified/resource/server.go` | 1942 |
| `pkg/services/ngalert/store/alert_rule.go` | 1874 |
| `pkg/tests/api/alerting/testing.go` | 1690 |
| `pkg/services/ngalert/models/testing.go` | 1651 |
| `pkg/apiserver/storage/testing/watcher_tests.go` | 1640 |

- **Deprecated Go APIs**: 65 files

## Feature Toggles

- **Deprecated toggles with active call sites**:
  - `prometheusAzureOverrideAudience` — Deprecated. Allow override default AAD audience for Azure Prometheus endpoint. Enabled by default. This feature should no longer be used and will be removed in the future.
  - `localeFormatPreference` — Specifies the locale so the correct format for numbers and dates can be shown
  - `prometheusTypeMigration` — Checks for deprecated Prometheus authentication methods (SigV4 and Azure), installs the relevant data source, and migrates the Prometheus data sources
- **Old IsEnabled API call sites**: 162 files

## Recommended Actions

1. **[Tech Debt] Reduce registry/storage backend suppressions and TODO debt** — Target `pkg/registry/` and `pkg/storage/`, which are the highest combined debt+churn hotspots.
2. **[Tech Debt] Modernize datasource plugins** — Address legacy React patterns and comment density in `public/app/plugins/datasource/` (high-priority frontend hotspot).
3. **[Tech Debt] Migrate dashboard class/connect patterns** — Use the `migrate-class-components` skill to reduce class + `connect()` usage in `public/app/features/dashboard/`.
4. **[Tech Debt] Split oversized backend files** — Start with `pkg/services/featuremgmt/registry.go`, `pkg/setting/setting.go`, and `pkg/services/dashboards/service/dashboard_service.go`.
5. **[Tech Debt] Migrate old IsEnabled APIs to OpenFeature** — Remove remaining call sites under `pkg/` and clean deprecated toggles in `pkg/services/featuremgmt/`.
6. **[Tech Debt] Reduce top explicit any hotspots** — Focus on Dashboard state and datasource files with the highest `any` concentrations.

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

### 2026-05-23 (current scan)

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
- `@deprecated APIs` decreased by 5 (51 -> 46)
- `Frontend TODO/FIXME/HACK` decreased by 16 (618 -> 602)
- `nolint directives` decreased by 1 (1275 -> 1274)

**New since last scan:**
- None detected in tracked headline metrics.
