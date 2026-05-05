# Tech Debt Report — All Scopes — 2026-05-05

## Hotspots (high debt × high churn)

Priority score = debt signals × log₂(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|--------------------|----------------|
| 1 | `pkg/registry/` | 328 | 575 | 3007.74 |
| 2 | `pkg/tests/` | 324 | 494 | 2900.22 |
| 3 | `public/app/plugins/datasource/` | 285 | 172 | 2118.87 |
| 4 | `pkg/storage/` | 246 | 346 | 2075.94 |
| 5 | `pkg/services/ngalert/` | 213 | 176 | 1590.60 |
| 6 | `public/app/features/dashboard/` | 151 | 155 | 1100.10 |
| 7 | `public/app/features/alerting/` | 132 | 247 | 1049.95 |
| 8 | `public/app/plugins/panel/` | 115 | 159 | 842.02 |
| 9 | `pkg/api/` | 113 | 136 | 802.08 |
| 10 | `pkg/services/libraryelements/` | 122 | 14 | 476.64 |

## Frontend Modernization

- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 file
- **stylesFactory**: 16 files

Top areas:
- Class components: `public/app/plugins/datasource/` (12 files), `public/app/plugins/panel/` (11), `public/app/features/dashboard/` (10)
- connect() HOC: `public/app/features/dashboard/` (9 files), `public/app/features/explore/` (8), `public/app/features/admin/` (5)
- stylesFactory: `public/app/features/explore/` (7 files), `public/app/plugins/panel/` (4), `public/app/features/dashboard/` (2)

Unsafe lifecycle file:
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 46 files

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
- `public/app/features/explore/TraceView/components/model/link-patterns.tsx` — 9

## Comment Debt

- **Frontend TODO/FIXME/HACK/XXX**: 602 occurrences across 327 files
- **Backend TODO/FIXME/HACK/XXX**: 894 occurrences across 453 files

Highest-density frontend files:
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18

Highest-density backend files:
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/storage/unified/resource/datastore.go` — 10
- `pkg/registry/apis/provisioning/register.go` — 10

## Go Quality

- **nolint directives**: 1,274 occurrences across 486 files
- **Oversized files (>800 loc, non-test non-generated)**: 66 files
- **Deprecated Go APIs**: 58 files

Top actionable oversized Go files:

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
| `pkg/registry/apis/provisioning/register.go` | 1579 |
| `pkg/storage/unified/resource/search.go` | 1551 |
| `pkg/services/live/live.go` | 1477 |
| `pkg/storage/unified/sql/backend.go` | 1426 |
| `pkg/services/ngalert/api/prometheus/api_prometheus.go` | 1395 |
| `pkg/services/ngalert/models/alert_rule.go` | 1322 |
| `pkg/api/dashboard.go` | 1290 |

## Feature Toggles

### Deprecated toggles in registry

| Toggle Name | Description | Active Call Sites |
|---|---|---|
| `prometheusAzureOverrideAudience` | Deprecated override for AAD audience on Azure Prometheus endpoint | 4 files |
| `localeFormatPreference` | Locale-specific number/date formatting preference | 4 files |
| `prometheusTypeMigration` | Migration path for deprecated Prometheus auth methods | 0 files |

- **Old `IsEnabled`/`IsEnabledGlobally` API call sites**: 162 files

For migration guidance, see `pkg/services/featuremgmt/` and OpenFeature migration docs in the same package.

## Recommended Actions

1. **Modernize dashboard and explore React surfaces** using the `migrate-class-components` skill (class components + `connect()` + `stylesFactory`).
2. **Reduce explicit `any` in top offenders** (`DashboardModel.ts`, `time_series2.ts`, `DashboardMigrator.ts`, and datasource query/editor files).
3. **Burn down plugin datasource comment debt** (Azure/MSSQL/Prometheus auth forms and related tests are the highest-density frontend TODO hotspots).
4. **Address backend churn hotspots first** in `pkg/registry/`, `pkg/storage/`, and `pkg/services/ngalert/` where debt and recent commit volume are both high.
5. **Split oversized Go files** beginning with `registry.go`, `setting.go`, and `dashboard_service.go`.
6. **Continue feature-toggle cleanup** by removing remaining deprecated-toggle call sites and migrating the 162 old `IsEnabled` API call sites to OpenFeature.

## Change Log

### 2026-05-05 (current scan)

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
| Oversized Go files (>800 loc) | 67 | 66 | -1 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 162 | 0 |

**Resolved since last scan:**
- 5 fewer files now contain `@deprecated` API markers.
- 16 frontend TODO/FIXME/HACK/XXX occurrences were removed.
- 1 `nolint` suppression was removed.
- 1 oversized non-test, non-generated Go file dropped below the 800-line threshold.

**New since last scan:**
- No metric-level regressions detected.

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
