# Tech Debt Report — All Scopes — 2026-05-30

## Hotspots (high debt × high churn)

Priority score = debt signals × log2(commits + 1)

| Rank | Area | Signals | Commits (6mo) | Priority Score |
|------|------|---------|----------------|----------------|
| 1 | `pkg/registry/` | 327 | 505 | 2937.44 |
| 2 | `pkg/tests/` | 322 | 461 | 2850.26 |
| 3 | `public/app/plugins/datasource/` | 285 | 141 | 2037.68 |
| 4 | `pkg/storage/` | 240 | 309 | 1986.27 |
| 5 | `pkg/services/ngalert/` | 211 | 151 | 1529.31 |
| 6 | `public/app/features/dashboard/` | 151 | 128 | 1058.70 |
| 7 | `public/app/features/alerting/` | 132 | 212 | 1020.98 |
| 8 | `pkg/services/libraryelements/` | 122 | 12 | 451.45 |
| 9 | `public/app/plugins/panel/` | 115 | 141 | 822.22 |
| 10 | `pkg/api/` | 113 | 116 | 776.35 |

## Frontend Modernization

### Class Components: 61 files

Top areas:
- `public/app/plugins/datasource/` — 12 files
- `public/app/plugins/panel/` — 11 files
- `public/app/features/dashboard/` — 10 files
- `public/app/features/explore/` — 8 files
- `public/app/features/variables/` — 4 files

### connect() HOC (Redux): 41 files

Top areas:
- `public/app/features/dashboard/` — 9 files
- `public/app/features/explore/` — 8 files
- `public/app/features/admin/` — 5 files
- `public/app/features/variables/` — 4 files
- `public/app/features/auth-config/` — 3 files

### Unsafe Lifecycle Methods: 1 file

- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx` — uses `UNSAFE_componentWillReceiveProps`

### Legacy `stylesFactory`: 16 files

Top areas:
- `public/app/features/explore/` — 7 files
- `public/app/plugins/panel/` — 4 files
- `public/app/features/dashboard/` — 2 files
- `public/app/features/query/` — 1 file
- `public/app/features/inspector/` — 1 file
- `public/app/plugins/datasource/` — 1 file

## Type Safety

### Explicit `any`: 393 occurrences across 137 files

Worst offenders (by occurrence count):
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

### `@deprecated` APIs: 46 files (non-generated)

## Comment Debt

### Frontend TODO/FIXME/HACK/XXX: 602 occurrences across 327 files

Highest-density files (sampled):
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18

### Backend TODO/FIXME/HACK/XXX: 851 occurrences across 441 files

Highest-density files (sampled):
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/registry/apis/provisioning/register.go` — 10
- `pkg/services/org/orgimpl/org.go` — 10
- `pkg/storage/unified/resource/datastore.go` — 10

## Go Quality

### `nolint` Directives: 1,274 occurrences across 486 files

Highest-density files:
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25
- `pkg/tests/api/alerting/api_ruler_test.go` — 25

### Oversized Non-Test Go Files (>800 loc): 66 files

Top actionable files (excluding generated files):

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
| `pkg/tests/api/alerting/testing.go` | 1689 |

### Deprecated Go APIs: 58 files (non-generated)

## Feature Toggles

### Deprecated Toggles (3 active in registry)

| Toggle Name | Registry Line |
|---|---|
| `prometheusAzureOverrideAudience` | 1191 |
| `localeFormatPreference` | 1689 |
| `prometheusTypeMigration` | 2125 |

### Old `IsEnabled`/`IsEnabledGlobally` API: 160 files

These call sites should migrate to the OpenFeature interface (per deprecation notice in `pkg/services/featuremgmt/models.go`).

## Recommended Actions

### Priority 1: Registry and Provisioning Debt Reduction (`pkg/registry/`)
The top hotspot has 327 debt signals and 505 commits in the lookback window. Focus on TODO/FIXME cleanup and `nolint` reduction in provisioning registration flows.

### Priority 2: Plugin Datasource Legacy React Modernization
`public/app/plugins/datasource/` has 12 class components and high comment/type debt. Convert to function components/hooks and replace legacy patterns as part of plugin maintenance.

### Priority 3: Dashboard + Explore Class/connect Cleanup
`features/dashboard/` and `features/explore/` remain concentrated with class components, `connect()`, and all unsafe lifecycle usage. Use the **`migrate-class-components` skill** for phased conversion.

### Priority 4: Split Oversized Go Modules
Break up `registry.go`, `setting.go`, and `dashboard_service.go` into smaller units to reduce merge conflicts and simplify testing.

### Priority 5: Feature Toggle Migration
Remove 3 deprecated toggles and continue migrating 160 old `IsEnabled` call sites to OpenFeature (`pkg/services/featuremgmt/` migration path).

### Priority 6: Reduce Explicit `any` in Top 10 Files
Constrain type debt where concentration is highest (DashboardModel, DashboardMigrator, time_series2, OpenTSDB/InfluxDB datasource code) to improve compile-time guarantees.

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
| @deprecated APIs | ~58 | ~51 | -7 |
| Frontend TODO/FIXME/HACK | ~515 | ~618 | +103 |
| Backend TODO/FIXME/HACK | ~913 | ~894 | -19 |
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

### 2026-05-30 (current scan)

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
| nolint directives | 1,275 | 1,274 | -1 |
| Oversized Go files (>800 loc) | 67 | 66 | -1 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 160 | -2 |

**Resolved since last scan:**
- 5 files no longer define `@deprecated` APIs
- 16 frontend TODO/FIXME/HACK/XXX comments were removed
- 43 backend TODO/FIXME/HACK/XXX comments were removed
- 1 `nolint` directive was removed
- 1 oversized non-test Go file moved below the >800 LOC threshold
- 2 files no longer use old `IsEnabled`/`IsEnabledGlobally` APIs

**New since last scan:**
- No metric increased in this scan
- Scan now explicitly filters generated Go files by header markers (`Code generated`, `DO NOT EDIT`) to avoid inflated backend counts
