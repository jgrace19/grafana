# Tech Debt Report — all — 2026-06-05

## Hotspots (high debt × high churn)

Priority score = debt signals × log2(commits + 1), lookback 6 months ago.

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|-------------------|----------------|
| 1 | `pkg/registry/` | 327 | 488 | 2921.3 |
| 2 | `pkg/tests/` | 322 | 450 | 2839.1 |
| 3 | `public/app/plugins/datasource/` | 285 | 132 | 2010.8 |
| 4 | `pkg/storage/` | 240 | 302 | 1978.4 |
| 5 | `pkg/services/ngalert/` | 211 | 148 | 1523.2 |
| 6 | `public/app/features/dashboard/` | 151 | 120 | 1044.7 |
| 7 | `public/app/features/alerting/` | 132 | 203 | 1012.8 |
| 8 | `pkg/services/libraryelements/` | 122 | 12 | 451.5 |
| 9 | `public/app/plugins/panel/` | 115 | 139 | 819.9 |
| 10 | `pkg/api/` | 113 | 109 | 766.3 |

## Frontend modernization

- **Class components**: 61 files
  - Top areas: `public/app/plugins/datasource/` (12), `public/app/plugins/panel/` (11), `public/app/features/dashboard/` (10), `public/app/features/explore/` (8), `public/app/core/` (4), `public/app/features/variables/` (4)
- **connect() HOC**: 41 files
  - Top areas: `public/app/features/dashboard/` (9), `public/app/features/explore/` (8), `public/app/features/admin/` (5), `public/app/features/variables/` (4), `public/app/features/auth-config/` (3), `public/app/features/serviceaccounts/` (2)
- **Unsafe lifecycles**: 1 files
  - Files: `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`
- **stylesFactory**: 16 files
  - Top areas: `public/app/features/explore/` (7), `public/app/plugins/panel/` (4), `public/app/features/dashboard/` (2), `public/app/features/inspector/` (1), `public/app/plugins/datasource/` (1), `public/app/features/query/` (1)

## Type safety

- **Explicit `any`**: 393 occurrences across 137 files
  - Top files: `public/app/features/dashboard/state/DashboardModel.ts` (23), `public/app/core/time_series2.ts` (19), `public/app/plugins/datasource/opentsdb/datasource.ts` (16), `public/app/features/dashboard/state/DashboardMigrator.ts` (16), `public/app/features/dashboard/state/PanelModel.ts` (13), `public/app/plugins/datasource/influxdb/query_part.ts` (12), `public/app/plugins/datasource/influxdb/datasource.ts` (11), `public/app/features/alerting/state/query_part.ts` (10), `public/app/features/dashboard/state/DashboardMigrator.test.ts` (10), `public/app/features/explore/TraceView/components/model/link-patterns.tsx` (9)
- **@deprecated APIs**: 46 files

## Comment debt

- **Frontend TODO/FIXME/HACK**: 602 occurrences
  - Top files: `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` (36), `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` (27), `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` (27), `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` (18), `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` (10), `public/app/features/panel/panellinks/specs/link_srv.test.ts` (8)
- **Backend TODO/FIXME/HACK**: 894 occurrences
  - Top files: `pkg/storage/secret/metadata/query.go` (17), `pkg/tests/apis/dashboard/integration/api_validation_test.go` (16), `pkg/tsdb/cloudwatch/kinds/dataquery/types_dataquery_gen.go` (13), `pkg/tests/apis/provisioning/jobs/deletejob_test.go` (12), `pkg/storage/unified/resource/datastore.go` (10), `pkg/registry/apis/provisioning/register.go` (10)

## Go quality

- **nolint directives**: 1274 occurrences
  - Top files: `pkg/services/libraryelements/libraryelements_get_all_test.go` (42), `pkg/tests/api/dashboards/api_dashboards_test.go` (42), `pkg/services/dashboards/service/dashboard_service.go` (26), `pkg/tests/api/alerting/api_ruler_test.go` (25), `pkg/tests/api/alerting/api_prometheus_test.go` (25), `pkg/services/libraryelements/libraryelements_patch_test.go` (19)
- **Oversized files (>800 loc)**: 66 files
  - Largest files: `pkg/tests/apis/provisioning/common/testing.go` (2835), `pkg/services/featuremgmt/registry.go` (2828), `pkg/storage/unified/testing/storage_backend_sql_compatibility.go` (2674), `pkg/apiserver/storage/testing/store_tests.go` (2667), `pkg/setting/setting.go` (2432), `pkg/services/dashboards/service/dashboard_service.go` (2410), `pkg/storage/unified/search/bleve.go` (2192), `pkg/storage/unified/resource/storage_backend.go` (2189), `pkg/util/xorm/core/core.go` (2176), `pkg/storage/unified/testing/storage_backend.go` (2087)
- **Deprecated Go APIs**: 65 files

## Feature toggles

- **Deprecated toggles with active call sites**:
  - `azureMonitorLogsBuilderEditor`: 1 files
  - `azureResourcePickerUpdates`: 0 files
  - `cloudWatchRoundUpEndTime`: 3 files
  - `dataplaneAggregator`: 1 files
  - `pluginContainers`: 1 files
  - `unifiedStorageGrpcConnectionPool`: 1 files
- **Old IsEnabled API call sites**: 162 files

## Recommended actions

1. **Migrate dashboard class components to function components**
   - What: Legacy class/connect patterns in public/app/features/dashboard/
   - Why: 10 class files and 9 connect() files remain.
   - How: Use the migrate-class-components skill and replace connect() HOC with hooks.
   - Scope: about 15 files
   - Estimate rationale: Cross-cutting work in one subsystem across more than 10 files.
2. **Modernize Explore TraceView (stylesFactory + unsafe lifecycle)**
   - What: TraceView subtree under public/app/features/explore/TraceView/
   - Why: Only unsafe lifecycle lives here; 7 stylesFactory files in the same area.
   - How: Convert class lifecycle usage to hooks and migrate stylesFactory to useStyles2.
   - Scope: about 7 files
   - Estimate rationale: Single feature refactor with tightly-coupled files.
3. **Split oversized Go files (setting.go, dashboard_service.go, storage_backend.go)**
   - What: Largest non-test Go files over 2000 lines.
   - Why: 66 non-test Go files exceed 800 LOC; top files are 2000+ LOC.
   - How: Extract cohesive submodules by responsibility and keep behavior unchanged.
   - Scope: about 3 files
   - Estimate rationale: High-risk refactor in core backend services.
4. **Clean up deprecated feature toggles**
   - What: Deprecated toggles in pkg/services/featuremgmt/registry.go and call sites.
   - Why: 6 deprecated toggles still present, with active references in code.
   - How: Remove deprecated flags and clean call sites after validating no runtime dependency.
   - Scope: about 7 files
   - Estimate rationale: Localized cleanup expected in a small set of files.
5. **Reduce explicit any in top 10 files**
   - What: Top offenders in explicit any usage across frontend TypeScript files.
   - Why: 393 explicit any occurrences across 137 files.
   - How: Introduce concrete interfaces and narrow unknown values incrementally.
   - Scope: about 10 files
   - Estimate rationale: Cross-cutting type cleanup across multiple high-complexity files.
6. **Migrate IsEnabled API to OpenFeature**
   - What: Old IsEnabled/IsEnabledGlobally call sites in backend packages.
   - Why: 162 files still use deprecated IsEnabled API.
   - How: Migrate call sites package-by-package to OpenFeature-backed API.
   - Scope: about 162 files
   - Estimate rationale: Large migration spanning many files and teams; should be split by package.

Remediation links: `migrate-class-components` skill for class/connect migration, and `pkg/services/featuremgmt/` docs for OpenFeature migration details.

## Change Log

### 2026-06-05 (current scan)

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
| Deprecated feature toggles | 3 | 6 | +3 |
| Old IsEnabled API files | 162 | 162 | 0 |

**Resolved since last scan:**
- 5 fewer @deprecated APIs signals
- 16 fewer frontend TODO/FIXME/HACK signals
- 1 fewer nolint directives signals
- 1 fewer oversized Go files (>800 loc) signals

**New since last scan:**
- 3 additional deprecated feature toggles signals

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
