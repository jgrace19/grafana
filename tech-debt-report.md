# Tech Debt Report — all — 2026-05-02

## Hotspots (high debt × high churn)

Priority score = debt signals × log₂(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|-------------------|----------------|
| 1 | `public/app/plugins/datasource/` | 219 | 172 | 1628.18 |
| 2 | `pkg/services/ngalert/` | 211 | 178 | 1579.09 |
| 3 | `public/app/features/alerting/` | 113 | 249 | 900.13 |
| 4 | `pkg/api/` | 113 | 137 | 803.26 |
| 5 | `public/app/plugins/panel/` | 109 | 159 | 798.09 |
| 6 | `public/app/features/dashboard/` | 73 | 156 | 532.51 |
| 7 | `pkg/services/libraryelements/` | 122 | 14 | 476.64 |
| 8 | `public/app/core/` | 54 | 164 | 397.78 |
| 9 | `public/app/features/explore/` | 49 | 96 | 323.4 |
| 10 | `pkg/services/dashboards/` | 52 | 36 | 270.89 |

## Frontend Modernization

- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 file
- **stylesFactory**: 16 files

Top areas:
- Class components — `public/app/plugins/datasource/`: 12
- Class components — `public/app/plugins/panel/`: 11
- Class components — `public/app/features/dashboard/`: 10
- Class components — `public/app/features/explore/`: 8
- Class components — `public/app/core/`: 4
- connect() HOC — `public/app/features/dashboard/`: 9
- connect() HOC — `public/app/features/explore/`: 8
- connect() HOC — `public/app/features/admin/`: 5
- connect() HOC — `public/app/features/variables/`: 4
- connect() HOC — `public/app/features/auth-config/`: 3
- stylesFactory — `public/app/features/explore/`: 7
- stylesFactory — `public/app/plugins/panel/`: 4
- stylesFactory — `public/app/features/dashboard/`: 2
- stylesFactory — `public/app/features/inspector/`: 1
- stylesFactory — `public/app/features/query/`: 1
- Unsafe lifecycle file: `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 46 files

Worst offenders (`any`, top 10):
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

- **Frontend TODO/FIXME/HACK/XXX**: 602 occurrences
- **Backend TODO/FIXME/HACK/XXX**: 894 occurrences

## Go Quality

- **nolint directives**: 1274 occurrences
- **Oversized files (>800 loc)**: 66 files
- **Deprecated Go APIs**: 58 files

Top oversized non-generated, non-test Go files (sample):
- `pkg/tests/apis/provisioning/common/testing.go` — 2835
- `pkg/services/featuremgmt/registry.go` — 2828
- `pkg/storage/unified/testing/storage_backend_sql_compatibility.go` — 2674
- `pkg/apiserver/storage/testing/store_tests.go` — 2667
- `pkg/setting/setting.go` — 2432
- `pkg/services/dashboards/service/dashboard_service.go` — 2410
- `pkg/storage/unified/search/bleve.go` — 2192
- `pkg/storage/unified/resource/storage_backend.go` — 2189
- `pkg/util/xorm/core/core.go` — 2176
- `pkg/storage/unified/testing/storage_backend.go` — 2087
- `pkg/storage/unified/resource/server.go` — 1941
- `pkg/services/ngalert/store/alert_rule.go` — 1873
- `pkg/tests/api/alerting/testing.go` — 1689
- `pkg/services/ngalert/models/testing.go` — 1650
- `pkg/apiserver/storage/testing/watcher_tests.go` — 1639

## Feature Toggles

- **Deprecated toggles with active call sites**: 3
  - `localeFormatPreference`
  - `prometheusAzureOverrideAudience`
  - `prometheusTypeMigration`
- **Old IsEnabled API call sites**: 161 files

## Recommended Actions
1. **Migrate dashboard class components and connect() usage** in `public/app/features/dashboard/` using the `migrate-class-components` skill.
2. **Modernize Explore TraceView** (`public/app/features/explore/TraceView/`) by removing `stylesFactory` and unsafe lifecycle usage.
3. **Reduce plugin debt in high-churn hotspots** (`public/app/plugins/datasource/`, `public/app/plugins/panel/`) as part of workspace maintenance.
4. **Split oversized Go files** (`pkg/setting/setting.go`, `pkg/services/dashboards/service/dashboard_service.go`, `pkg/services/ngalert/store/alert_rule.go`) into focused modules.
5. **Migrate old IsEnabled APIs to OpenFeature** across remaining backend call sites under `pkg/services/` and `pkg/api/`.
6. **Target top `any` offenders** in dashboard state and legacy datasource adapters for strict typing.

## Change Log

### 2026-05-02 (current scan)

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
| Old IsEnabled API files | 162 | 161 | -1 |

**Resolved since last scan:**
- 5 fewer @deprecated API files
- 16 fewer frontend TODO/FIXME/HACK comments
- 1 fewer nolint directives
- 1 fewer oversized Go files (>800 loc)
- 1 fewer old IsEnabled API files

**New since last scan:** None

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
