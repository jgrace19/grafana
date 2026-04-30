# Tech Debt Report — all — 2026-04-30

## Hotspots (high debt × high churn)

Priority score = debt signals × log2(commits + 1); churn window = 6 months.

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|-------------------|----------------|
| 1 | `pkg/registry/` | 177 | 592 | 1630.5 |
| 2 | `pkg/services/ngalert/` | 142 | 178 | 1062.7 |
| 3 | `pkg/storage/` | 107 | 350 | 904.72 |
| 4 | `public/app/features/alerting/` | 90 | 256 | 720.51 |
| 5 | `pkg/tests/` | 73 | 505 | 655.76 |
| 6 | `pkg/api/` | 73 | 139 | 520.44 |
| 7 | `public/app/features/dashboard/` | 64 | 159 | 468.6 |
| 8 | `public/app/features/explore/` | 47 | 100 | 312.94 |
| 9 | `public/app/core/` | 47 | 168 | 347.84 |
| 10 | `public/app/features/dashboard-scene/` | 34 | 524 | 307.23 |

## Frontend Modernization
- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 files
- **stylesFactory**: 16 files

Top buckets:
- Class components — `public/app/features/dashboard/`: 10 files
- Class components — `public/app/features/explore/`: 8 files
- Class components — `public/app/core/`: 4 files
- connect() HOC — `public/app/features/dashboard/`: 9 files
- connect() HOC — `public/app/features/explore/`: 8 files
- connect() HOC — `public/app/features/admin/`: 5 files
- stylesFactory — `public/app/features/explore/`: 7 files
- stylesFactory — `public/app/plugins/panel/live/`: 2 files
- stylesFactory — `public/app/features/dashboard/`: 2 files

## Type Safety
- **Explicit `any`**: 397 occurrences across 140 files
- **@deprecated APIs**: 46 files

Highest explicit `any` files:
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
- **Frontend TODO/FIXME/HACK/XXX**: 602 occurrences
- **Backend TODO/FIXME/HACK/XXX**: 851 occurrences

Top frontend comment-density files:
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10

Top backend comment-density files:
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/registry/apis/provisioning/register.go` — 10
- `pkg/services/org/orgimpl/org.go` — 10

## Go Quality
- **nolint directives**: 1274 occurrences
- **Oversized files (>800 loc)**: 66 files
- **Deprecated Go APIs**: 58 files

Top oversized non-test Go files:

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
- **Deprecated toggles with active call sites**: 3 in registry

| Toggle Name | Description |
|---|---|
| `prometheusAzureOverrideAudience` | Deprecated. Allow override default AAD audience for Azure Prometheus endpoint. Enabled by default. This feature should no longer be used and will be removed in the future. |
| `localeFormatPreference` | Specifies the locale so the correct format for numbers and dates can be shown |
| `prometheusTypeMigration` | Checks for deprecated Prometheus authentication methods (SigV4 and Azure), installs the relevant data source, and migrates the Prometheus data sources |

- **Old IsEnabled API call sites**: 161 files

## Recommended Actions
1. Migrate dashboard class components and connect() wrappers (migrate-class-components skill)
2. Modernize Explore TraceView legacy React + stylesFactory
3. Reduce explicit any usage in top 10 frontend files
4. Split top oversized Go files in setting, dashboards, and unified storage
5. Migrate old IsEnabled API call sites to OpenFeature
6. Retire deprecated feature toggles in registry and call sites

Remediation references:
- Class component/connect migrations: `/workspace/.cursor/skills/migrate-class-components/SKILL.md`
- Feature toggle migration guidance: `pkg/services/featuremgmt/` and OpenFeature deprecation notes in `pkg/services/featuremgmt/models.go`

## Change Log

### 2026-04-30 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | 0 |
| connect() HOC | 41 | 41 | 0 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory | 16 | 16 | 0 |
| Explicit `any` | 393 | 397 | +4 |
| `any` files | 137 | 140 | +3 |
| @deprecated APIs | 51 | 46 | -5 |
| Frontend TODO/FIXME/HACK/XXX | 618 | 602 | -16 |
| Backend TODO/FIXME/HACK/XXX | 894 | 851 | -43 |
| nolint directives | 1275 | 1274 | -1 |
| Oversized Go files (>800 loc) | 67 | 66 | -1 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 161 | -1 |

**Resolved since last scan:**
- 5 fewer @deprecated API files
- 16 fewer frontend TODO/FIXME/HACK/XXX comments
- 43 fewer backend TODO/FIXME/HACK/XXX comments
- 1 fewer nolint directives
- 1 fewer oversized Go files (>800 loc)
- 1 fewer old IsEnabled API files

**New since last scan:**
- 4 additional explicit `any` usages
- 3 additional `any`-bearing files

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
