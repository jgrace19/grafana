# Tech Debt Report — All Scopes — 2026-04-27

## Hotspots (high debt × high churn)

Priority score = debt signals × log2(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|----------------------|----------------|
| 1 | `pkg/registry/` | 327 | 598 | 3017.04 |
| 2 | `pkg/tests/` | 322 | 507 | 2894.36 |
| 3 | `public/app/plugins/datasource/` | 285 | 181 | 2139.72 |
| 4 | `pkg/storage/` | 240 | 356 | 2035.15 |
| 5 | `pkg/services/ngalert/` | 211 | 182 | 1585.81 |
| 6 | `public/app/features/dashboard/` | 151 | 161 | 1108.32 |
| 7 | `public/app/features/alerting/` | 132 | 262 | 1061.14 |
| 8 | `pkg/services/libraryelements/` | 122 | 16 | 498.67 |
| 9 | `public/app/plugins/panel/` | 115 | 166 | 849.13 |
| 10 | `pkg/api/` | 113 | 142 | 809.07 |

## Frontend Modernization

- **Class components**: 61 files
  - Top areas: `plugins/datasource` (12), `plugins/panel` (11), `features/dashboard` (10), `features/explore` (8), `core` (4)
- **connect() HOC**: 41 files
  - Top areas: `features/dashboard` (9), `features/explore` (8), `features/admin` (5), `features/variables` (4), `features/auth-config` (3)
- **Unsafe lifecycles**: 1 files
  - `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`
- **stylesFactory**: 16 files
  - Top areas: `features/explore` (7), `plugins/panel` (4), `features/dashboard` (2), `features/inspector` (1), `features/query` (1)

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files

Top offenders:
- `public/app/features/dashboard/state/DashboardModel.ts` — 23
- `public/app/core/time_series2.ts` — 19
- `public/app/plugins/datasource/opentsdb/datasource.ts` — 16
- `public/app/features/dashboard/state/DashboardMigrator.ts` — 16
- `public/app/features/dashboard/state/PanelModel.ts` — 13
- `public/app/plugins/datasource/influxdb/query_part.ts` — 12
- `public/app/plugins/datasource/influxdb/datasource.ts` — 11
- `public/app/features/alerting/state/query_part.ts` — 10
- `public/app/features/dashboard/state/DashboardMigrator.test.ts` — 10
- `public/app/features/explore/TraceView/components/model/link-patterns.tsx` — 9

- **@deprecated APIs**: 46 files

## Comment Debt

- **Frontend TODO/FIXME/HACK/XXX**: 602 occurrences
- **Backend TODO/FIXME/HACK/XXX**: 894 occurrences

Top frontend comment-debt files:
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10

Top backend comment-debt files:
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tsdb/cloudwatch/kinds/dataquery/types_dataquery_gen.go` — 13
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/registry/apis/provisioning/register.go` — 10

## Go Quality

- **nolint directives**: 1274 occurrences
- **Oversized files (>800 loc, non-generated, non-test)**: 66 files
- **Deprecated Go APIs**: 65 files

Top `nolint` files:
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_ruler_test.go` — 25
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25

Top oversized actionable files:
- `pkg/services/featuremgmt/registry.go` — 2828 loc
- `pkg/setting/setting.go` — 2432 loc
- `pkg/services/dashboards/service/dashboard_service.go` — 2410 loc
- `pkg/storage/unified/search/bleve.go` — 2192 loc
- `pkg/storage/unified/resource/storage_backend.go` — 2189 loc
- `pkg/util/xorm/core/core.go` — 2176 loc
- `pkg/storage/unified/resource/server.go` — 1941 loc
- `pkg/services/ngalert/store/alert_rule.go` — 1873 loc

## Feature Toggles

- **Deprecated toggles in registry**: 3
- **Old IsEnabled API call sites**: 162 files

Deprecated toggle list:
- `prometheusAzureOverrideAudience` — Deprecated. Allow override default AAD audience for Azure Prometheus endpoint. Enabled by default. This feature should no longer be used and will be removed in the future.
- `localeFormatPreference` — Specifies the locale so the correct format for numbers and dates can be shown
- `prometheusTypeMigration` — Checks for deprecated Prometheus authentication methods (SigV4 and Azure), installs the relevant data source, and migrates the Prometheus data sources

## Recommended Actions

1. **Tackle `pkg/registry/` debt hotspot first** (327 signals, 598 commits): reduce TODO/FIXME and `nolint` suppressions, and migrate old feature checks where possible.
2. **Modernize datasource plugin frontend debt** (285 signals): class components + TODO clusters in datasource editors; use the `migrate-class-components` skill for class/connect refactors.
3. **Modularize oversized backend files**: prioritize `pkg/setting/setting.go`, `pkg/services/dashboards/service/dashboard_service.go`, and `pkg/storage/unified/resource/storage_backend.go`.
4. **Continue deprecation cleanup**: finish reducing `@deprecated` frontend APIs (now 46 files, down from 51).
5. **Migrate old feature-gating APIs**: move 162 `IsEnabled`/`IsEnabledGlobally` call sites to OpenFeature (`pkg/services/featuremgmt/` docs).
6. **Address high-churn backend hotspots**: `pkg/storage/` and `pkg/services/ngalert/` should get targeted debt cleanup in parallel with active feature work.

## Change Log

### 2026-04-27 (current scan)

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
| Oversized Go files (>800 loc) | 67 | 66 | -1 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 162 | 0 |

**Resolved since last scan:**
- Removed 5 frontend files containing `@deprecated` markers.
- Removed 16 frontend TODO/FIXME/HACK/XXX occurrences.
- Removed 1 backend `nolint` directive occurrences.
- Reduced oversized Go files by 1 (non-generated, non-test).

**New since last scan:**
- No new debt signals in tracked aggregate metrics.


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
