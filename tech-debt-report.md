# Tech Debt Report — all — 2026-04-15

## Hotspots (high debt × high churn)

Priority score = debt signals × log₂(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|-------------------|----------------|
| 1 | `public/app/plugins/datasource/` | 285 | 195 | 2170.2 |
| 2 | `pkg/services/ngalert/` | 211 | 185 | 1590.8 |
| 3 | `public/app/features/dashboard/` | 151 | 174 | 1125.1 |
| 4 | `public/app/features/alerting/` | 132 | 273 | 1068.9 |
| 5 | `pkg/services/libraryelements/` | 122 | 16 | 498.7 |
| 6 | `public/app/plugins/panel/` | 115 | 186 | 867.9 |
| 7 | `pkg/api/` | 113 | 148 | 815.8 |
| 8 | `public/app/core/` | 82 | 193 | 623.2 |
| 9 | `public/app/features/explore/` | 57 | 110 | 387.3 |
| 10 | `public/app/features/dashboard-scene/` | 55 | 552 | 501.1 |

## Frontend Modernization

- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 files
- **stylesFactory**: 16 files

Top class-component buckets:
- `public/app/plugins/datasource/` — 12
- `public/app/plugins/panel/` — 11
- `public/app/features/dashboard/` — 10
- `public/app/features/explore/` — 8
- `public/app/core/` — 4
- `public/app/features/variables/` — 4
- `public/app/features/query/` — 3
- `public/app/features/inspector/` — 2

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 46 files

Top files with explicit `any`:
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

## Comment Debt

- **Frontend TODO/FIXME/HACK**: 602 occurrences
- **Backend TODO/FIXME/HACK**: 894 occurrences

## Go Quality

- **nolint directives**: 1274 occurrences
- **Oversized files (>800 loc)**: 62 files
- **Deprecated Go APIs**: 65 files

Top oversized Go files:
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
- `pkg/services/ngalert/models/testing.go` — 1650 lines
- `pkg/apiserver/storage/testing/watcher_tests.go` — 1639 lines
- `pkg/registry/apis/provisioning/register.go` — 1579 lines
- `pkg/storage/unified/resource/search.go` — 1551 lines

## Feature Toggles

- **Deprecated toggles with active call sites**:
  - `prometheusAzureOverrideAudience`
  - `localeFormatPreference`
  - `prometheusTypeMigration`
- **Old IsEnabled API call sites**: 162 files

## Recommended Actions

1. Use the `migrate-class-components` skill for `public/app/features/dashboard/` and `public/app/features/explore/` to reduce class components and `connect()` usage.
2. Modernize Explore TraceView (`stylesFactory` + unsafe lifecycle) by migrating to hooks and `useStyles2`.
3. Reduce explicit `any` in the top 10 files first to maximize type-safety gains.
4. Split oversized Go files (`registry.go`, `setting.go`, `dashboard_service.go`) into focused modules.
5. Migrate old `IsEnabled`/`IsEnabledGlobally` call sites to OpenFeature APIs in `pkg/services/featuremgmt/`.

## Change Log

### 2026-04-15 (current scan)

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
| Oversized Go files (>800 loc) | 67 | 62 | -5 |
| Deprecated feature toggles | 3 | 3 | +0 |
| Old IsEnabled API files | 162 | 162 | +0 |

**Resolved since last scan:**
- @deprecated APIs decreased by 5
- Frontend TODO/FIXME/HACK decreased by 16
- nolint directives decreased by 1
- Oversized Go files (>800 loc) decreased by 5

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
