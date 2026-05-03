# Tech Debt Report — all — 2026-05-03

## Hotspots (high debt × high churn)

Priority score = debt signals × log₂(commits + 1), lookback = 6 months

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|-------------------|----------------|
| 1 | `pkg/registry/` | 327 | 580 | 3002.64 |
| 2 | `pkg/tests/` | 322 | 497 | 2885.12 |
| 3 | `public/app/plugins/datasource/` | 285 | 172 | 2118.87 |
| 4 | `pkg/storage/` | 241 | 348 | 2035.75 |
| 5 | `pkg/services/ngalert/` | 211 | 178 | 1579.09 |
| 6 | `public/app/features/dashboard/` | 151 | 156 | 1101.49 |
| 7 | `public/app/features/alerting/` | 133 | 249 | 1059.45 |
| 8 | `pkg/services/libraryelements/` | 122 | 14 | 476.64 |
| 9 | `public/app/plugins/panel/` | 115 | 159 | 842.02 |
| 10 | `pkg/api/` | 113 | 137 | 803.26 |

## Frontend Modernization

- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 files
- **stylesFactory**: 16 files

Top class component hotspots:
- `public/app/AppWrapper.tsx`
- `public/app/core/components/GraphNG/GraphNG.tsx`
- `public/app/core/components/OptionsUI/multiSelect.tsx`
- `public/app/core/components/OptionsUI/select.tsx`
- `public/app/core/components/SharedPreferences/SharedPreferencesOld.tsx`
- `public/app/features/alerting/unified/components/rule-editor/QueryRows.tsx`
- `public/app/features/annotations/components/StandardAnnotationQueryEditor.tsx`
- `public/app/features/dashboard/components/DashboardRow/DashboardRow.tsx`
- `public/app/features/dashboard/components/DashboardSettings/VersionsSettings.tsx`
- `public/app/features/dashboard/components/PanelEditor/PanelEditor.tsx`
- `public/app/features/dashboard/components/PanelEditor/PanelEditorQueries.tsx`
- `public/app/features/dashboard/components/ShareModal/ShareSnapshot.tsx`

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 47 files

Top `any` files:
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

- **Frontend TODO/FIXME/HACK**: 602 occurrences across 327 files
- **Backend TODO/FIXME/HACK**: 894 occurrences across 453 files

Frontend top TODO/FIXME/HACK files:
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10
- `public/app/features/panel/panellinks/specs/link_srv.test.ts` — 8
- `public/app/plugins/datasource/azuremonitor/components/MetricsQueryEditor/AdvancedResourcePicker.tsx` — 7
- `public/app/plugins/panel/xychart/SeriesEditor.tsx` — 7

Backend top TODO/FIXME/HACK files:
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tsdb/cloudwatch/kinds/dataquery/types_dataquery_gen.go` — 13
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/registry/apis/provisioning/register.go` — 10
- `pkg/services/org/orgimpl/org.go` — 10
- `pkg/storage/unified/resource/datastore.go` — 10
- `pkg/storage/unified/sql/queries.go` — 9

## Go Quality

- **nolint directives**: 1275 occurrences across 487 files
- **Oversized files (>800 loc)**: 66 files
- **Deprecated Go APIs**: 65 files

Top nolint files:
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25
- `pkg/tests/api/alerting/api_ruler_test.go` — 25
- `pkg/services/libraryelements/libraryelements_patch_test.go` — 19
- `pkg/tests/api/annotations/annotations_test.go` — 19
- `pkg/services/annotations/annotationsimpl/xorm_store_test.go` — 17

Top oversized Go files:
- `pkg/tests/apis/provisioning/common/testing.go` — 2835 lines
- `pkg/services/featuremgmt/registry.go` — 2828 lines
- `pkg/storage/unified/testing/storage_backend_sql_compatibility.go` — 2674 lines
- `pkg/apiserver/storage/testing/store_tests.go` — 2667 lines
- `pkg/setting/setting.go` — 2432 lines
- `pkg/services/dashboards/service/dashboard_service.go` — 2410 lines
- `pkg/storage/unified/search/bleve.go` — 2192 lines
- `pkg/storage/unified/resource/storage_backend.go` — 2189 lines
- `pkg/util/xorm/core/core.go` — 2176 lines
- `pkg/storage/unified/testing/storage_backend.go` — 2087 lines
- `pkg/storage/unified/resource/server.go` — 1941 lines
- `pkg/services/ngalert/store/alert_rule.go` — 1873 lines
- `pkg/tests/api/alerting/testing.go` — 1689 lines
- `pkg/services/ngalert/models/testing.go` — 1650 lines
- `pkg/apiserver/storage/testing/watcher_tests.go` — 1639 lines

## Feature Toggles

- **Deprecated toggles with active call sites**:
  - `localeFormatPreference` — 1 call-site files
  - `prometheusAzureOverrideAudience` — 4 call-site files
  - `prometheusTypeMigration` — 1 call-site files
- **Old IsEnabled API call sites**: 162 files

## Recommended Actions
1. **Migrate dashboard class components and connect() usage** — `public/app/features/dashboard/` remains a top frontend hotspot; convert class components and `connect()` HOCs using `migrate-class-components`.
2. **Modernize Explore TraceView legacy React patterns** — `public/app/features/explore/` still contains unsafe lifecycle and heavy `stylesFactory` usage; migrate to hooks + `useStyles2`.
3. **Split oversized high-churn Go modules** — Break up `pkg/services/featuremgmt/registry.go`, `pkg/setting/setting.go`, and `pkg/services/dashboards/service/dashboard_service.go` into focused submodules.
4. **Clean up deprecated feature toggles** — 3 toggles are marked deprecated in registry and still retained; remove stale toggles and related code paths.
5. **Migrate old IsEnabled APIs to OpenFeature** — `IsEnabled`/`IsEnabledGlobally` still appear in 162 files; follow migration guidance in `pkg/services/featuremgmt/`.
6. **Reduce explicit any in top TypeScript hotspots** — Focus on files driving 393 `any` occurrences across 137 files to improve static type safety.

## Change Log

### 2026-05-03 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | 0 |
| connect() HOC | 41 | 41 | 0 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory | 16 | 16 | 0 |
| Explicit any occurrences | 393 | 393 | 0 |
| Explicit any files | 137 | 137 | 0 |
| @deprecated APIs | 51 | 47 | -4 |
| Frontend TODO/FIXME/HACK | 618 | 602 | -16 |
| Backend TODO/FIXME/HACK | 894 | 894 | 0 |
| nolint directives | 1275 | 1275 | 0 |
| Oversized Go files (>800 loc) | 67 | 66 | -1 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 162 | 0 |

**Resolved since last scan:**
- 4 fewer in metric '@deprecated APIs' (51 -> 47)
- 16 fewer in metric 'Frontend TODO/FIXME/HACK' (618 -> 602)
- 1 fewer in metric 'Oversized Go files (>800 loc)' (67 -> 66)

**New since last scan:**
- None

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
