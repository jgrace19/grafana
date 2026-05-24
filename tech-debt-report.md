# Tech Debt Report — all — 2026-05-24

## Hotspots (high debt × high churn)
| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|--------------------|----------------|
| 1 | `pkg/registry/` | 327 | 521 | 2952.13 |
| 2 | `pkg/tests/` | 322 | 469 | 2858.24 |
| 3 | `public/app/plugins/datasource/` | 286 | 147 | 2061.90 |
| 4 | `pkg/storage/` | 240 | 320 | 1998.34 |
| 5 | `pkg/services/ngalert/` | 211 | 160 | 1546.82 |
| 6 | `public/app/features/dashboard/` | 151 | 135 | 1070.21 |
| 7 | `public/app/features/alerting/` | 132 | 223 | 1030.57 |
| 8 | `public/app/plugins/panel/` | 115 | 145 | 826.83 |
| 9 | `pkg/api/` | 113 | 119 | 780.48 |
| 10 | `pkg/services/libraryelements/` | 122 | 12 | 451.45 |

## Frontend Modernization
- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 files
- **stylesFactory**: 16 files

## Type Safety
- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 46 files

Top `any` files (sample):
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
- **Oversized files (>800 loc)**: 66 files
- **Deprecated Go APIs**: 58 files

Largest oversized Go files (sample):
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

## Feature Toggles
- **Deprecated toggles with active call sites**:
  - `prometheusAzureOverrideAudience` (4 files)
  - `localeFormatPreference` (12 files)
  - `prometheusTypeMigration` (0 files)
- **Old IsEnabled API call sites**: 162 files

## Recommended Actions
1. **Migrate dashboard class components and connect() HOCs**
   - What: ~21 files
   - Why: Legacy dashboard patterns persist: 61 class components and 41 connect() usages remain overall.
   - How: Use the migrate-class-components skill to convert high-churn dashboard containers to hooks and useSelector/useDispatch.
   - Suggested estimate: 3 points
2. **Modernize Explore TraceView legacy React patterns**
   - What: ~8 files
   - Why: TraceView still contains the unsafe lifecycle usage and multiple stylesFactory call sites (16 stylesFactory files total).
   - How: Replace stylesFactory with useStyles2 and refactor unsafe lifecycle paths to hooks.
   - Suggested estimate: 2 points
3. **Split oversized Go files in high-churn services**
   - What: ~10 files
   - Why: 66 non-test Go files exceed 800 LOC; several core files are >2k LOC and hard to maintain.
   - How: Extract cohesive submodules (validation, parsing, orchestration) while preserving package APIs.
   - Suggested estimate: 2 points
4. **Migrate IsEnabled call sites to OpenFeature**
   - What: ~162 files
   - Why: IsEnabled/IsEnabledGlobally usage remains in 162 files.
   - How: Migrate to OpenFeature APIs documented in pkg/services/featuremgmt.
   - Suggested estimate: 13 points
5. **Reduce explicit any usage in top offenders**
   - What: ~10 files
   - Why: Explicit any appears 393 times across 137 files.
   - How: Start with top 10 files by any-count, replacing broad any with concrete interfaces/generics.
   - Suggested estimate: 2 points
6. **Clean up deprecated feature toggles**
   - What: ~16 files
   - Why: 3 toggles are marked deprecated and still have active references.
   - How: Remove deprecated toggles and retire stale flag checks.
   - Suggested estimate: 3 points

Remediation references:
- Class component/connect migrations: `migrate-class-components` skill
- Feature toggle migration: `pkg/services/featuremgmt/` docs

## Change Log

### 2026-05-24 (current scan)

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
| Old IsEnabled API files | 162 | 162 | 0 |

**Resolved since last scan:**
- 5 fewer @deprecated apis
- 16 fewer frontend todo/fixme/hack
- 1 fewer nolint directives
- 1 fewer oversized go files (>800 loc)

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
