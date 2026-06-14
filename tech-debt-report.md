# Tech Debt Report — all — 2026-06-14

## Hotspots (high debt × high churn)

Priority score = debt signals × log2(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|--------------------|----------------|
| 1 | `pkg/registry/` | 364 | 455 | 3215.17 |
| 2 | `pkg/tests/` | 322 | 433 | 2821.22 |
| 3 | `public/app/plugins/datasource/` | 296 | 122 | 2054.98 |
| 4 | `pkg/storage/` | 242 | 287 | 1977.12 |
| 5 | `pkg/api/` | 164 | 105 | 1103.38 |
| 6 | `public/app/features/dashboard/` | 155 | 110 | 1053.13 |
| 7 | `public/app/features/alerting/` | 133 | 196 | 1013.73 |
| 8 | `public/app/plugins/panel/` | 128 | 133 | 904.46 |
| 9 | `pkg/services/service/` | 153 | 0 | 0.00 |
| 10 | `pkg/services/api/` | 106 | 0 | 0.00 |

## Frontend Modernization

- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 file
- **stylesFactory**: 16 files

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 46 files

Top explicit `any` files (current):
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

- **Frontend TODO/FIXME/HACK**: 602 occurrences
- **Backend TODO/FIXME/HACK**: 894 occurrences

## Go Quality

- **nolint directives**: 1,274 occurrences
- **Oversized files (>800 loc)**: 66 files
- **Deprecated Go APIs**: 65 files

Largest oversized files (sample):

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

## Feature Toggles

- **Deprecated toggles in registry**: 3
  - `prometheusAzureOverrideAudience`
  - `localeFormatPreference`
  - `prometheusTypeMigration`
- **Deprecated toggles with active call sites**: 3
  - `prometheusAzureOverrideAudience` — 4 occurrences across 4 files
  - `localeFormatPreference` — 1 occurrences across 1 files
  - `prometheusTypeMigration` — 1 occurrences across 1 files
- **Old IsEnabled API call sites**: 162 files

## Recommended Actions
1. **Migrate dashboard class/connect patterns** — Dashboard has 10 class component files and 9 connect() files. Use the **`migrate-class-components`** skill for conversion batches. Scope: ~15 files. Suggested estimate: **3 pts**.
2. **Modernize Explore TraceView** — TraceView contains 1 unsafe lifecycle files and 7 stylesFactory files. Scope: ~10 files. Suggested estimate: **2 pts**.
3. **Split oversized Go files** — Core service files remain >2000 LOC, increasing review and change risk. Scope: ~3 files. Suggested estimate: **1 pts**.
4. **Migrate IsEnabled API to OpenFeature** — Old APIs remain in 162 files; registry still marks 3 toggles deprecated. Follow migration guidance in `pkg/services/featuremgmt/` while removing stale toggles. Scope: ~162 files. Suggested estimate: **8 pts**.
5. **Reduce explicit any in top files** — There are 393 explicit any annotations across 137 files. Scope: ~10 files. Suggested estimate: **2 pts**.
6. **Reduce backend TODO/nolint hotspot** — pkg/registry/ has 364 debt signals with recent churn. Scope: ~50 files. Suggested estimate: **8 pts**.

## Change Log

### 2026-06-14 (current scan)

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
| nolint directives | 1,275 | 1,274 | -1 |
| Oversized Go files (>800 loc) | 78 | 66 | -12 |
| Deprecated Go APIs | 65 | 65 | +0 |
| Deprecated feature toggles | 3 | 3 | +0 |
| Old IsEnabled API files | 162 | 162 | +0 |

**Resolved since last scan:**
- @deprecated APIs: 5 fewer
- Frontend TODO/FIXME/HACK: 16 fewer
- nolint directives: 1 fewer
- Oversized Go files (>800 loc): 12 fewer

**New since last scan:**
- None

---

### 2026-06-11 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | 0 |
| connect() HOC | 41 | 41 | 0 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory | 16 | 16 | 0 |
| Explicit `any` | 393 | 393 | 0 |
| `any` files | 137 | 137 | 0 |
| @deprecated APIs | 51 | 51 | 0 |
| Frontend TODO/FIXME/HACK | 618 | 618 | 0 |
| Backend TODO/FIXME/HACK | 894 | 894 | 0 |
| nolint directives | 1,275 | 1,275 | 0 |
| Oversized Go files (>800 loc) | 67 | 78 | +11 |
| Deprecated Go APIs | 77 | 65 | -12 ✓ |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 162 | 0 |

**Resolved since last scan:**
- 12 files with deprecated Go API markers were cleaned up

**New since last scan:**
- 11 additional Go files now exceed 800 lines (continued growth in `pkg/storage/unified/` and test infrastructure files)

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
