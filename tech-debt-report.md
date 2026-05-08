# Tech Debt Report — all — 2026-05-08

## Hotspots (high debt × high churn)
Priority score = debt signals × log₂(commits + 1), churn window = 6 months.

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|-------------------|----------------|
| 1 | `pkg/registry/` | 177 | 558 | 1615.43 |
| 2 | `pkg/services/ngalert/` | 142 | 175 | 1059.24 |
| 3 | `pkg/storage/` | 107 | 340 | 900.26 |
| 4 | `public/app/features/alerting/` | 90 | 242 | 713.23 |
| 5 | `public/app/plugins/datasource/` | 87 | 167 | 643.13 |
| 6 | `public/app/plugins/panel/` | 76 | 158 | 555.78 |
| 7 | `pkg/api/` | 73 | 133 | 515.82 |
| 8 | `pkg/tests/` | 73 | 486 | 651.73 |
| 9 | `public/app/features/dashboard/` | 64 | 153 | 465.07 |
| 10 | `public/app/core/` | 47 | 161 | 344.97 |

## Frontend Modernization
- **Class components**: 61 files
- `public/app/plugins/datasource/` — 12 files
- `public/app/plugins/panel/` — 11 files
- `public/app/features/dashboard/` — 10 files
- `public/app/features/explore/` — 8 files
- `public/app/features/variables/` — 4 files
- `public/app/core/` — 4 files
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
- `public/app/plugins/datasource/` — 1 files
- `public/app/features/query/` — 1 files
- `public/app/features/inspector/` — 1 files

## Type Safety
- **Explicit `any`**: 393 occurrences across 137 files
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
- **@deprecated APIs**: 46 files
  - `public/app/api/clients/playlist/v1/index.ts`
  - `public/app/core/components/RolePicker/api.ts`
  - `public/app/core/history/richHistoryLocalStorageUtils.ts`
  - `public/app/core/services/__mocks__/backend_srv.ts`
  - `public/app/core/services/backend_srv.ts`
  - `public/app/core/time_series2.ts`
  - `public/app/core/utils/kbn.ts`
  - `public/app/core/utils/richHistoryTypes.ts`
  - `public/app/features/alerting/unified/hooks/useAbilities.ts`
  - `public/app/features/alerting/unified/hooks/useHasRuler.ts`

## Comment Debt
- **Frontend TODO/FIXME/HACK**: 602 occurrences
  - `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
  - `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
  - `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
  - `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
  - `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10
  - `public/app/features/panel/panellinks/specs/link_srv.test.ts` — 8
  - `public/app/plugins/datasource/azuremonitor/components/MetricsQueryEditor/AdvancedResourcePicker.tsx` — 7
  - `public/app/plugins/panel/xychart/SeriesEditor.tsx` — 7
- **Backend TODO/FIXME/HACK**: 894 occurrences
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
  - `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
  - `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
  - `pkg/services/dashboards/service/dashboard_service.go` — 26
  - `pkg/tests/api/alerting/api_prometheus_test.go` — 25
  - `pkg/tests/api/alerting/api_ruler_test.go` — 25
  - `pkg/services/libraryelements/libraryelements_patch_test.go` — 19
  - `pkg/tests/api/annotations/annotations_test.go` — 19
  - `pkg/services/annotations/annotationsimpl/xorm_store_test.go` — 17
- **Oversized files (>800 loc, non-generated, non-`*_test.go`)**: 66 files

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
| `pkg/storage/unified/sql/backend.go` | 1426 |
| `pkg/services/ngalert/api/prometheus/api_prometheus.go` | 1395 |
| `pkg/services/ngalert/models/alert_rule.go` | 1322 |
- **Deprecated Go APIs**: 65 files

## Feature Toggles
- **Deprecated toggles with active call sites**:
  - `prometheusAzureOverrideAudience` — 4 files
  - `localeFormatPreference` — 1 files
  - `prometheusTypeMigration` — 1 files
- **Old IsEnabled API call sites**: 161 files

## Recommended Actions
### Priority 1: Migrate dashboard class/connect components to hooks
- **What**: Dashboard feature (`public/app/features/dashboard/`) currently has 10 class components, 9 connect() usages, and 104 explicit any annotations.
- **Why**: High churn (153 commits/6 months) and high hotspot score (465.07).
- **How**: Use the `migrate-class-components` skill to convert class components and replace connect() with hooks incrementally.
- **Scope**: ~19 primary files, plus adjacent tests and selectors.

### Priority 2: Modernize Explore TraceView legacy React patterns
- **What**: TraceView contains 4 class components, 7 stylesFactory usages, and 1 unsafe lifecycle call sites.
- **Why**: All remaining unsafe lifecycle usage is in this subtree; modernization here removes the riskiest legacy React API.
- **How**: Batch-convert TraceView components to hooks and replace stylesFactory with useStyles2 in one pass.
- **Scope**: Approximately 8-15 files within Explore TraceView components.

### Priority 3: Split oversized backend service files
- **What**: Oversized production files remain above 2k LOC, including `pkg/setting/setting.go` (2432 LOC), `pkg/services/dashboards/service/dashboard_service.go` (2410 LOC), `pkg/storage/unified/resource/storage_backend.go` (2189 LOC).
- **Why**: 66 non-generated Go files exceed 800 LOC, increasing review and regression risk.
- **How**: Extract domain-focused modules and keep public service APIs stable while reducing file size and complexity.
- **Scope**: 3 core service files in first tranche, with follow-on split tickets for additional files.

### Priority 4: Clean up deprecated feature toggles
- **What**: 3 toggles are marked deprecated with 6 active call-site files.
- **Why**: Deprecated toggle paths increase branching complexity and block full OpenFeature cleanup.
- **How**: Remove or hardcode deprecated toggles and clean generated references in `pkg/services/featuremgmt/`.
- **Scope**: 6 call-site files + toggle registry cleanup.

### Priority 5: Reduce explicit any in top 10 frontend files
- **What**: Top 10 files account for 139 of 393 explicit any occurrences.
- **Why**: Type-safety debt remains high (393 occurrences across 137 files).
- **How**: Introduce stricter interfaces incrementally in top offender files, starting with dashboard state models.
- **Scope**: 10 high-impact files plus dependent typing utilities.

### Priority 6: Migrate IsEnabled API call sites to OpenFeature
- **What**: Legacy `IsEnabled`/`IsEnabledGlobally` appears in 161 files.
- **Why**: Legacy feature-flag API usage slows migration to the standard OpenFeature interfaces.
- **How**: Migrate by package tranche using `pkg/services/featuremgmt/` APIs and docs; prioritize high-churn service directories first.
- **Scope**: First tranche: highest-churn service and API packages (50+ files).

Remediation references:
- React class/connect migrations: `migrate-class-components` skill
- Feature toggle migration: `pkg/services/featuremgmt/` (OpenFeature migration path)

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

### 2026-05-08 (current scan)

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
| Old IsEnabled API files | 162 | 161 | -1 |

**Resolved since last scan:**
- 5 fewer **@deprecated APIs** signals
- 16 fewer **Frontend TODO/FIXME/HACK** signals
- 1 fewer **nolint directives** signals
- 1 fewer **Oversized Go files (>800 loc)** signals
- 1 fewer **Old IsEnabled API files** signals

**New since last scan:**
- None detected.
