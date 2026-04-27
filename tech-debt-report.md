# Tech Debt Report — all — 2026-04-27

## Hotspots (high debt × high churn)
| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|--------------------|----------------|
| 1 | `pkg/registry/apis/` | 271 | 505 | 2434.39 |
| 2 | `pkg/storage/unified/` | 205 | 324 | 1710.58 |
| 3 | `pkg/tests/api/` | 187 | 62 | 1117.75 |
| 4 | `pkg/tests/apis/` | 126 | 442 | 1107.69 |
| 5 | `public/app/features/dashboard/` | 151 | 160 | 1106.97 |
| 6 | `public/app/features/alerting/` | 132 | 259 | 1058.95 |
| 7 | `pkg/api/` | 113 | 142 | 809.07 |
| 8 | `public/app/core/` | 82 | 171 | 608.95 |
| 9 | `pkg/services/ngalert/api/` | 64 | 87 | 413.4 |
| 10 | `public/app/features/explore/` | 57 | 100 | 379.52 |

## Frontend Modernization
- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 files
- **stylesFactory**: 16 files

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
- `public/app/features/alerting/state/query_part.ts` — 10
- `public/app/features/dashboard/state/DashboardMigrator.test.ts` — 10
- `public/app/plugins/datasource/graphite/graphite_query.ts` — 9

## Comment Debt
- **Frontend TODO/FIXME/HACK**: 602 occurrences
- **Backend TODO/FIXME/HACK**: 894 occurrences

## Go Quality
- **nolint directives**: 1274 occurrences
- **Oversized files (>800 loc, includes test/generated in this scan)**: 78 files
- **Deprecated Go APIs**: 65 files

Top oversized files:
- `pkg/tests/apis/provisioning/common/testing.go` — 2835 lines
- `pkg/services/featuremgmt/registry.go` — 2828 lines
- `pkg/apimachinery/utils/meta_mock.go` — 2779 lines
- `pkg/apimachinery/apis/common/v0alpha1/zz_generated.openapi.go` — 2757 lines
- `pkg/storage/unified/testing/storage_backend_sql_compatibility.go` — 2674 lines
- `pkg/apiserver/storage/testing/store_tests.go` — 2667 lines
- `pkg/setting/setting.go` — 2432 lines
- `pkg/services/dashboards/service/dashboard_service.go` — 2410 lines
- `pkg/storage/unified/search/bleve.go` — 2192 lines
- `pkg/storage/unified/resource/storage_backend.go` — 2189 lines
- `pkg/util/xorm/core/core.go` — 2176 lines
- `pkg/storage/unified/testing/storage_backend.go` — 2087 lines
- `pkg/server/wire_gen.go` — 1943 lines
- `pkg/storage/unified/resource/server.go` — 1941 lines
- `pkg/services/ngalert/store/alert_rule.go` — 1873 lines

## Feature Toggles
- **Deprecated toggles with active call sites**: 3
- **Old IsEnabled API call sites**: 162 files

## Recommended Actions
1. Migrate remaining class components and connect() usage in dashboard/explore/plugins using the `migrate-class-components` skill.
2. Remove TraceView unsafe lifecycle and replace remaining `stylesFactory` usage with `useStyles2`.
3. Reduce explicit `any` in top offender files (dashboard state and datasource editors first).
4. Split oversized Go files starting with `pkg/services/featuremgmt/registry.go`, `pkg/setting/setting.go`, and `pkg/services/dashboards/service/dashboard_service.go`.
5. Migrate old `IsEnabled`/`IsEnabledGlobally` call sites to OpenFeature and clean deprecated toggles in `pkg/services/featuremgmt/` docs and registry.

## Change Log

### 2026-04-27 (current scan)

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
| Backend TODO/FIXME/HACK | 894 | 894 | +0 |
| nolint directives | 1275 | 1274 | -1 |
| Oversized Go files (>800 loc) | 67 | 78 (scope changed) | n/a |
| Deprecated feature toggles | 3 | 3 | +0 |
| Old IsEnabled API files | 162 | 162 | +0 |

**Resolved since last scan:** None (previous file-level resolved list was incorrect after switching to summary output)

**New since last scan:**
- `public/app/AppWrapper.tsx`
- `public/app/core/components/GraphNG/GraphNG.tsx`
- `public/app/core/components/OptionsUI/multiSelect.tsx`
- `public/app/core/components/OptionsUI/select.tsx`
- `public/app/core/components/SharedPreferences/SharedPreferencesOld.tsx`
- `public/app/features/alerting/unified/components/rule-editor/QueryRows.tsx`
- `public/app/features/annotations/components/StandardAnnotationQueryEditor.tsx`
- `public/app/features/auth-config/AuthDrawer.tsx`
- `public/app/features/auth-config/AuthProvidersListPage.tsx`
- `public/app/features/auth-config/ErrorContainer.tsx`

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
