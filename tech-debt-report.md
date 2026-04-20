# Tech Debt Report — all — 2026-04-20

## Hotspots (high debt × high churn)

Priority score = debt signals × log₂(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|--------------------|----------------|
| 1 | `pkg/registry/` | 327 | 619 | 3033.3 |
| 2 | `pkg/tests/` | 322 | 517 | 2903.4 |
| 3 | `public/app/plugins/datasource/` | 285 | 193 | 2166.0 |
| 4 | `pkg/storage/` | 240 | 367 | 2045.7 |
| 5 | `pkg/services/ngalert/` | 211 | 185 | 1590.8 |
| 6 | `public/app/features/dashboard/` | 151 | 170 | 1120.1 |
| 7 | `public/app/features/alerting/` | 132 | 270 | 1066.8 |
| 8 | `pkg/services/libraryelements/` | 122 | 16 | 498.7 |
| 9 | `public/app/plugins/panel/` | 115 | 182 | 864.3 |
| 10 | `pkg/api/` | 113 | 147 | 814.7 |

## Frontend Modernization
- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 files
- **stylesFactory**: 16 files

Top class-component files (sample):
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

Top connect() files (sample):
- `public/app/features/admin/UpgradePage.tsx`
- `public/app/features/admin/UserAdminPage.tsx`
- `public/app/features/admin/UserListAdminPage.tsx`
- `public/app/features/admin/UserListAnonymousPage.tsx`
- `public/app/features/admin/ldap/LdapSettingsPage.tsx`
- `public/app/features/auth-config/AuthDrawer.tsx`
- `public/app/features/auth-config/AuthProvidersListPage.tsx`
- `public/app/features/auth-config/ErrorContainer.tsx`
- `public/app/features/dashboard/components/DashNav/DashNav.tsx`
- `public/app/features/dashboard/components/DashboardSettings/GeneralSettings.tsx`
- `public/app/features/dashboard/components/DeleteDashboard/DeleteDashboardModal.tsx`
- `public/app/features/dashboard/components/Inspector/PanelInspector.tsx`

Unsafe lifecycle files:
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`

stylesFactory files (sample):
- `public/app/features/dashboard/components/PanelEditor/PanelEditor.tsx`
- `public/app/features/dashboard/components/SubMenu/SubMenu.tsx`
- `public/app/features/explore/TraceView/components/TracePageHeader/SpanGraph/ViewingLayer.tsx`
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/SpanBarRow.tsx`
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/SpanDetailRow.tsx`
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/SpanTreeOffset.tsx`
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/VirtualizedTraceView.tsx`
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/index.tsx`
- `public/app/features/inspector/styles.ts`
- `public/app/features/query/components/QueryGroup.tsx`
- `public/app/plugins/datasource/graphite/components/MetricTankMetaInspector.tsx`

## Type Safety
- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 46 files

Highest explicit `any` files:
- `public/app/features/dashboard/state/DashboardModel.ts` — 23
- `public/app/core/time_series2.ts` — 19
- `public/app/plugins/datasource/opentsdb/datasource.ts` — 16
- `public/app/features/dashboard/state/DashboardMigrator.ts` — 16
- `public/app/features/dashboard/state/PanelModel.ts` — 13
- `public/app/plugins/datasource/influxdb/query_part.ts` — 12
- `public/app/plugins/datasource/influxdb/datasource.ts` — 11
- `public/app/features/dashboard/state/DashboardMigrator.test.ts` — 10
- `public/app/features/alerting/state/query_part.ts` — 10
- `public/app/plugins/datasource/graphite/graphite_query.ts` — 9
- `public/app/features/explore/TraceView/components/model/link-patterns.tsx` — 9
- `public/app/plugins/datasource/influxdb/influx_series.ts` — 8

## Comment Debt
- **Frontend TODO/FIXME/HACK**: 602 occurrences
- **Backend TODO/FIXME/HACK**: 894 occurrences

## Go Quality
- **nolint directives**: 1,274 occurrences
- **Oversized files (>800 loc)**: 68 files
- **Deprecated Go APIs**: 65 files

Top oversized Go files:

| File | Lines |
|------|-------|
| `pkg/tests/apis/provisioning/common/testing.go` | 2835 |
| `pkg/services/featuremgmt/registry.go` | 2828 |
| `pkg/apimachinery/apis/common/v0alpha1/zz_generated.openapi.go` | 2757 |
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

## Feature Toggles
- **Deprecated toggles with active call sites**: 3
  - `reloadDashboardsOnParamsChange` — Enables reload of dashboards on scopes, time range and variables changes
  - `alertingImportYAMLUI` — Enables a UI feature for importing rules from a Prometheus file to Grafana-managed rules
  - `alertingAlertsActivityBanner` — Shows a promotional banner for the Alerts Activity feature on the Rule List page
- **Old IsEnabled API call sites**: 161 files

## Recommended Actions
1. **Migrate class components/connect() in highest-hotspot frontend areas** (use `migrate-class-components` skill), starting with the top two buckets in the hotspot table.
2. **Modernize TraceView legacy React patterns** by removing unsafe lifecycle methods and replacing `stylesFactory` with `useStyles2`.
3. **Reduce explicit `any` in top offender files** (DashboardModel/time_series2/opentsdb) with strict interfaces and utility types.
4. **Break up oversized Go files** beginning with `pkg/services/featuremgmt/registry.go`, `pkg/setting/setting.go`, and dashboard/ngalert service files.
5. **Migrate old feature toggle API usage** (`IsEnabled`, `IsEnabledGlobally`) to OpenFeature APIs and remove deprecated toggles from `pkg/services/featuremgmt/registry.go`.
6. **Audit high-density TODO/FIXME/nolint clusters** in the top backend buckets and convert suppressions into tracked follow-up issues.

## Change Log

### 2026-04-20 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | 0 |
| connect() HOC | 41 | 41 | 0 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory | 16 | 16 | 0 |
| Explicit `any` | 371 | 393 | +22 |
| `any` files | 137 | 137 | 0 |
| @deprecated APIs | 58 | 46 | -12 |
| Frontend TODO/FIXME/HACK | 515 | 602 | +87 |
| Backend TODO/FIXME/HACK | 913 | 894 | -19 |
| nolint directives | 1275 | 1274 | -1 |
| Oversized Go files (>800 loc) | 67 | 68 | +1 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 160 | 161 | +1 |

**Resolved since last scan:**
- 12 fewer @deprecated APIs
- 19 fewer Backend TODO/FIXME/HACK
- 1 fewer nolint directives

**New since last scan:**
- 22 additional Explicit `any`
- 87 additional Frontend TODO/FIXME/HACK
- 1 additional Oversized Go files (>800 loc)
- 1 additional Old IsEnabled API files

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
