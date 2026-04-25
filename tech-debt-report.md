# Tech Debt Report — all — 2026-04-25

## Hotspots (high debt × high churn)
| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|----------------------|----------------|
| 1 | `pkg/registry/` | 177 | 598 | 1633.07 |
| 2 | `pkg/services/ngalert/` | 142 | 182 | 1067.23 |
| 3 | `pkg/storage/` | 107 | 356 | 907.34 |
| 4 | `public/app/features/alerting/` | 90 | 262 | 723.5 |
| 5 | `pkg/tests/` | 73 | 507 | 656.17 |
| 6 | `public/app/plugins/datasource/` | 87 | 181 | 653.18 |
| 7 | `public/app/plugins/panel/` | 76 | 166 | 561.16 |
| 8 | `pkg/api/` | 73 | 142 | 522.67 |
| 9 | `public/app/features/dashboard/` | 64 | 161 | 469.75 |
| 10 | `public/app/core/` | 47 | 171 | 349.03 |

## Frontend Modernization
- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 files
- **stylesFactory**: 16 files

Top class-component areas: `public/app/plugins/datasource/` (12), `public/app/plugins/panel/` (11), `public/app/features/dashboard/` (10), `public/app/features/explore/` (8), `public/app/core/` (4).
Top connect() areas: `public/app/features/dashboard/` (9), `public/app/features/explore/` (8), `public/app/features/admin/` (5), `public/app/features/variables/` (4), `public/app/features/auth-config/` (3).
Top stylesFactory areas: `public/app/features/explore/` (7), `public/app/plugins/panel/` (4), `public/app/features/dashboard/` (2), `public/app/features/inspector/` (1), `public/app/features/query/` (1).

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
- **Oversized files (>800 loc)**: 66 files
- **Deprecated Go APIs**: 65 files

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
- **Deprecated toggles with active call sites**: 3
  - `localeFormatPreference` — 1 files
  - `prometheusAzureOverrideAudience` — 4 files
  - `prometheusTypeMigration` — 1 files
- **Old IsEnabled API call sites**: 161 files

## Recommended Actions
1. **Migrate dashboard class components to function components** — What: dashboard + related React containers still include 10 class components and 9 connect() usages. Why: high debt in an actively changed area. How: use migrate-class-components skill and replace connect() with hooks. Scope: ~10-15 files.
2. **Modernize Explore TraceView legacy lifecycle/styling** — What: Explore TraceView has 7 stylesFactory usages and 1 unsafe lifecycle files. Why: legacy React APIs remain in a high-use workflow. How: migrate to useStyles2 and hooks lifecycle equivalents. Scope: ~8 files.
3. **Split oversized Go service files** — What: 66 non-test pkg Go files exceed 800 LOC. Why: large files increase maintenance risk and review complexity. How: split by responsibility (API, validation, persistence). Scope: start with pkg/tests/apis/provisioning/common/testing.go (2835), pkg/services/featuremgmt/registry.go (2828), pkg/storage/unified/testing/storage_backend_sql_compatibility.go (2674).
4. **Clean up deprecated feature toggles** — What: 3 toggles are marked FeatureStageDeprecated (localeFormatPreference, prometheusAzureOverrideAudience, prometheusTypeMigration). Why: deprecated flags add branching complexity. How: remove registry entries and call sites after validation. Scope: 6 active references.
5. **Migrate IsEnabled APIs to OpenFeature** — What: old IsEnabled/IsEnabledGlobally APIs are used in 161 files. Why: legacy API usage blocks featuremgmt modernization. How: migrate to OpenFeature interfaces in pkg/services/featuremgmt docs. Scope: broad, phase by service.
6. **Reduce explicit any in highest-impact frontend files** — What: explicit any appears 393 times across 137 files. Why: weakens type safety and refactor confidence. How: tighten model/service types starting with top offenders. Scope: top 10 files have 139 occurrences.

## Change Log

### 2026-04-25 (current scan)

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
- @deprecated APIs decreased by 5 (51 -> 46).
- Frontend TODO/FIXME/HACK decreased by 16 (618 -> 602).
- nolint directives decreased by 1 (1275 -> 1274).
- Oversized Go files (>800 loc) decreased by 1 (67 -> 66).
- Old IsEnabled API files decreased by 1 (162 -> 161).

**New since last scan:**
- No metric-level increases detected in this scan.

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
