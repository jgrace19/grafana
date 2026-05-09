# Tech Debt Report — All Scopes — 2026-05-09

## Hotspots (high debt × high churn)

Priority score = debt signals × log₂(commits + 1)

| Rank | Area | Debt Signals | Commits (6mo) | Priority Score |
|------|------|--------------|---------------|----------------|
| 1 | `public/app/plugins/datasource/` | 286 | 167 | 2114.2 |
| 2 | `pkg/services/ngalert/` | 213 | 175 | 1588.9 |
| 3 | `public/app/features/dashboard/` | 153 | 153 | 1111.8 |
| 4 | `public/app/features/alerting/` | 132 | 242 | 1046.1 |
| 5 | `public/app/plugins/panel/` | 119 | 158 | 870.2 |
| 6 | `pkg/api/` | 113 | 133 | 798.5 |
| 7 | `public/app/core/` | 82 | 161 | 601.9 |
| 8 | `public/app/features/dashboard-scene/` | 55 | 507 | 494.4 |
| 9 | `pkg/services/libraryelements/` | 122 | 13 | 464.5 |
| 10 | `public/app/features/explore/` | 64 | 95 | 421.4 |

## Frontend Modernization

- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 file
- **stylesFactory**: 16 files

Unsafe lifecycle call site:
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 46 files

Worst explicit `any` offenders:
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
- `pkg/tsdb/cloudwatch/kinds/dataquery/types_dataquery_gen.go` — 13
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12

## Go Quality

- **nolint directives**: 1,274 occurrences across 486 files
- **Oversized files (>800 loc)**: 78 files
- **Deprecated Go APIs (`Deprecated:` markers)**: 65 files

Top oversized non-test Go files:

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

### Deprecated toggles with active call sites

| Toggle Name | Description |
|---|---|
| `localeFormatPreference` | Specifies the locale so the correct format for numbers and dates can be shown |
| `prometheusAzureOverrideAudience` | Deprecated. Allow override default AAD audience for Azure Prometheus endpoint. Enabled by default. This feature should no longer be used and will be removed in the future. |
| `prometheusTypeMigration` | Checks for deprecated Prometheus authentication methods (SigV4 and Azure), installs the relevant data source, and migrates the Prometheus data sources |

### Old `IsEnabled`/`IsEnabledGlobally` API call sites

- 162 files

These call sites should migrate to OpenFeature (`pkg/services/featuremgmt/models.go` deprecation guidance).

## Recommended Actions

1. **Modernize datasource plugins (`public/app/plugins/datasource/`)**
   - Highest priority hotspot by score and raw debt signals.
   - Focus class components, `any`, and comment debt in plugin editors.
   - Use the **`migrate-class-components`** skill for class/connect remediation.

2. **Reduce `ngalert` backend debt (`pkg/services/ngalert/`)**
   - High concentration of TODO/FIXME/HACK and `nolint` suppressions in high-churn code.
   - Prioritize production paths over test scaffolding.

3. **Continue dashboard modernization (`public/app/features/dashboard/`)**
   - Still one of the highest-churn frontend areas with persistent class/connect/`any` debt.
   - Target `DashboardModel`, migrator files, and panel editor components first.

4. **Split oversized backend files in active areas**
   - Start with `setting.go`, `dashboard_service.go`, and `ngalert`/unified storage large files.
   - Keep splits behavior-preserving and module-oriented.

5. **Clean up frontend deprecated API usage and high-density TODO clusters**
   - Prioritize alerting/datasource hot files where debt co-locates with churn.

6. **Complete feature-toggle migration work**
   - Remove remaining deprecated toggles and migrate old `IsEnabled` API call sites to OpenFeature.
   - Follow `pkg/services/featuremgmt/` migration patterns and service abstractions.

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

### 2026-05-09 (current scan)

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
| Oversized Go files (>800 loc) | 67 | 78 | +11 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 162 | 0 |

**Resolved since last scan:**
- 5 files with `@deprecated` markers were cleaned up
- 16 frontend TODO/FIXME/HACK comments were removed
- 1 `nolint` directive was removed

**New since last scan:**
- 11 additional non-test Go files now exceed 800 lines
