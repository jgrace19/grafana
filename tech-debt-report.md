# Tech Debt Report — all — 2026-05-15

## Hotspots (high debt × high churn)
Priority score = debt signals × log2(commits + 1), with churn window `6 months`.

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|----------------------|----------------|
| 1 | `public/app/plugins/datasource/` | 285 | 155 | 2076.34 |
| 2 | `pkg/services/ngalert/` | 211 | 171 | 1566.94 |
| 3 | `public/app/features/dashboard/` | 151 | 145 | 1085.66 |
| 4 | `public/app/features/alerting/` | 132 | 233 | 1038.89 |
| 5 | `pkg/services/libraryelements/` | 122 | 13 | 464.5 |
| 6 | `public/app/plugins/panel/` | 115 | 152 | 834.6 |
| 7 | `pkg/api/` | 113 | 127 | 791.0 |
| 8 | `public/app/core/` | 82 | 149 | 592.76 |
| 9 | `public/app/features/explore/` | 57 | 91 | 371.84 |
| 10 | `public/app/features/dashboard-scene/` | 55 | 494 | 492.32 |

## Frontend Modernization
- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 file
- **stylesFactory**: 16 files

Top class-component buckets:
- `public/app/plugins/datasource/` — 12 files (e.g., ConfigEditor.tsx, VariableQueryEditor.tsx, EditorField.tsx)
- `public/app/plugins/panel/` — 11 files (e.g., AnnoListPanel.tsx, BarGaugePanel.tsx, CanvasPanel.tsx)
- `public/app/features/dashboard/` — 10 files (e.g., DashboardRow.tsx, VersionsSettings.tsx, PanelEditor.tsx)
- `public/app/features/explore/` — 8 files (e.g., Explore.tsx, LiveLogs.tsx, LogsContainer.tsx)
- `public/app/core/` — 4 files (e.g., GraphNG.tsx, multiSelect.tsx, select.tsx)
- `public/app/features/variables/` — 4 files (e.g., VariableEditorContainer.tsx, VariableEditorEditor.tsx, OptionsPicker.tsx)

Top connect() buckets:
- `public/app/features/dashboard/` — 9 files (e.g., DashNav.tsx, GeneralSettings.tsx, DeleteDashboardModal.tsx)
- `public/app/features/explore/` — 8 files (e.g., Explore.tsx, ExplorePaneContainer.tsx, ExploreQueryInspector.tsx)
- `public/app/features/admin/` — 5 files (e.g., UpgradePage.tsx, UserAdminPage.tsx, UserListAdminPage.tsx)
- `public/app/features/variables/` — 4 files (e.g., VariableEditorContainer.tsx, VariableEditorEditor.tsx, OptionsPicker.tsx)
- `public/app/features/auth-config/` — 3 files (e.g., AuthDrawer.tsx, AuthProvidersListPage.tsx, ErrorContainer.tsx)
- `public/app/features/org/` — 2 files (e.g., OrgDetailsPage.tsx, SelectOrgPage.tsx)

Top stylesFactory buckets:
- `public/app/features/explore/` — 7 files (e.g., ViewingLayer.tsx, SpanBarRow.tsx, SpanDetailRow.tsx)
- `public/app/plugins/panel/` — 4 files (e.g., AnnoListPanel.tsx, GettingStarted.tsx, LiveChannelEditor.tsx)
- `public/app/features/dashboard/` — 2 files (e.g., PanelEditor.tsx, SubMenu.tsx)
- `public/app/features/inspector/` — 1 files (e.g., styles.ts)
- `public/app/features/query/` — 1 files (e.g., QueryGroup.tsx)
- `public/app/plugins/datasource/` — 1 files (e.g., MetricTankMetaInspector.tsx)

## Type Safety
- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 46 files

Worst explicit `any` offenders:
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
- **Frontend TODO/FIXME/HACK**: 602 occurrences across 327 files
- **Backend TODO/FIXME/HACK**: 851 occurrences across 441 files

Frontend TODO hotspots (sample):
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.testMocks.ts` — 10
- `public/app/features/panel/panellinks/specs/link_srv.test.ts` — 8
- `public/app/plugins/panel/xychart/SeriesEditor.tsx` — 7
- `public/app/plugins/datasource/azuremonitor/components/MetricsQueryEditor/AdvancedResourcePicker.tsx` — 7

Backend TODO hotspots (sample):
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/tests/apis/provisioning/jobs/deletejob_test.go` — 12
- `pkg/registry/apis/provisioning/register.go` — 10
- `pkg/storage/unified/resource/datastore.go` — 10
- `pkg/services/org/orgimpl/org.go` — 10
- `pkg/storage/unified/sql/queries.go` — 9
- `pkg/registry/apis/provisioning/resources/dualwriter.go` — 8

## Go Quality
- **nolint directives**: 1274 occurrences across 486 files
- **Oversized files (>800 loc)**: 66 files
- **Deprecated Go APIs**: 58 files

Top nolint-density files:
- `pkg/tests/api/dashboards/api_dashboards_test.go` — 42
- `pkg/services/libraryelements/libraryelements_get_all_test.go` — 42
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/tests/api/alerting/api_ruler_test.go` — 25
- `pkg/tests/api/alerting/api_prometheus_test.go` — 25
- `pkg/tests/api/annotations/annotations_test.go` — 19
- `pkg/services/libraryelements/libraryelements_patch_test.go` — 19
- `pkg/services/annotations/annotationsimpl/xorm_store_test.go` — 17

Top oversized Go files:
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
- **Deprecated toggles with active call sites**:
  - `localeFormatPreference`
  - `prometheusAzureOverrideAudience`
  - `prometheusTypeMigration`
- **Old IsEnabled API call sites**: 161 files

## Recommended Actions
1. Use the `migrate-class-components` skill to modernize remaining class components and `connect()` usages in `public/app/features/dashboard/` and `public/app/features/explore/` first.
2. Split oversized Go files in high-impact service/API areas (`pkg/services/*`, `pkg/api/`) into smaller modules to reduce maintenance and merge friction.
3. Reduce explicit `any` in the top 10 files, prioritizing `DashboardModel.ts`, `time_series2.ts`, and datasource query/model files.
4. Continue cleanup of `@deprecated` TypeScript APIs and remove stale comment debt (`TODO/FIXME/HACK`) in plugin credential/editor flows.
5. Migrate old `IsEnabled` / `IsEnabledGlobally` call sites to OpenFeature APIs (see `pkg/services/featuremgmt/` docs), then remove deprecated toggles.
6. Audit and remove unnecessary `nolint` directives, starting with the highest-density files listed in this report.

## Change Log

### 2026-05-15 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | +0 |
| connect() HOC | 41 | 41 | +0 |
| Unsafe lifecycles | 1 | 1 | +0 |
| stylesFactory | 16 | 16 | +0 |
| Explicit `any` | 393 | 393 | +0 |
| `any` files | 137 | 137 | +0 |
| @deprecated APIs | 51 | 46 | -5 |
| Frontend TODO/FIXME/HACK | 618 | 602 | -16 |
| Backend TODO/FIXME/HACK | 894 | 851 | -43 |
| nolint directives | 1275 | 1274 | -1 |
| Oversized Go files (>800 loc) | 67 | 66 | -1 |
| Deprecated feature toggles | 3 | 3 | +0 |
| Old IsEnabled API files | 162 | 161 | -1 |

**Resolved since last scan:**
- @deprecated APIs decreased by 5 (51 -> 46).
- Frontend TODO/FIXME/HACK decreased by 16 (618 -> 602).
- Backend TODO/FIXME/HACK decreased by 43 (894 -> 851).
- nolint directives decreased by 1 (1275 -> 1274).
- Oversized Go files (>800 loc) decreased by 1 (67 -> 66).
- Old IsEnabled API files decreased by 1 (162 -> 161).

**New since last scan:**
- No metric-level increases detected since the last scan.

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
