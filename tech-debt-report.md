# Tech Debt Report — all — 2026-06-13

## Hotspots (high debt × high churn)

Priority score = debt signals × log₂(commits + 1), using lookback `6 months`.

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|---------------------|----------------|
| 1 | `pkg/registry/apis/` | 270 | 388 | 2,323 |
| 2 | `public/app/plugins/datasource/` | 291 | 122 | 2,020 |
| 3 | `pkg/storage/unified/` | 209 | 268 | 1,687 |
| 4 | `pkg/services/ngalert/` | 212 | 140 | 1,514 |
| 5 | `pkg/tests/apis/` | 126 | 378 | 1,079 |
| 6 | `pkg/tests/api/` | 187 | 52 | 1,071 |
| 7 | `public/app/features/dashboard/` | 151 | 110 | 1,026 |
| 8 | `public/app/features/alerting/` | 133 | 196 | 1,014 |
| 9 | `public/app/plugins/panel/` | 123 | 133 | 869 |
| 10 | `pkg/services/libraryelements/` | 122 | 12 | 451 |

## Frontend Modernization

- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 files
- **stylesFactory**: 16 files

Top area breakdown:
- `features/dashboard/`: 10 class / 9 connect()
- `features/explore/`: 8 class / 8 connect() / 7 stylesFactory
- `features/variables/`: 4 class / 4 connect()
- `plugins/`: 23 class / 0 connect() / 5 stylesFactory
- `core/`: 4 class

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 54 files

Top 10 `any` hotspots:
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

- **Frontend TODO/FIXME/HACK/XXX**: 609 occurrences
- **Backend TODO/FIXME/HACK/XXX**: 914 occurrences

## Go Quality

- **nolint directives**: 1,275 occurrences
- **Oversized files (>800 loc)**: 66 files
- **Deprecated Go APIs**: 74 files

*Generated Go files are excluded from oversized-file counts when they contain standard codegen headers.*

Top oversized files:
| File | Lines |
|------|-------|
| `pkg/tests/apis/provisioning/common/testing.go` | 2,835 |
| `pkg/services/featuremgmt/registry.go` | 2,828 |
| `pkg/storage/unified/testing/storage_backend_sql_compatibility.go` | 2,674 |
| `pkg/apiserver/storage/testing/store_tests.go` | 2,667 |
| `pkg/setting/setting.go` | 2,432 |
| `pkg/services/dashboards/service/dashboard_service.go` | 2,410 |
| `pkg/storage/unified/search/bleve.go` | 2,192 |
| `pkg/storage/unified/resource/storage_backend.go` | 2,189 |
| `pkg/util/xorm/core/core.go` | 2,176 |
| `pkg/storage/unified/testing/storage_backend.go` | 2,087 |

## Feature Toggles

- **Deprecated toggles with active call sites:**
- `prometheusAzureOverrideAudience` — 4 file(s) with active call sites
- `localeFormatPreference` — 1 file(s) with active call sites
- `prometheusTypeMigration` — 1 file(s) with active call sites
- **Old IsEnabled API call sites**: 162 files

## Recommended Actions

1. **Migrate dashboard class components and connect() usage** — Dashboard has 10 class component files and 9 connect() HOC files. Estimated scope: ~19 files; suggested estimate: 3 points. (use `migrate-class-components` skill)
2. **Modernize Explore TraceView lifecycle and styles** — Explore TraceView still has 1 unsafe lifecycle file(s) and 7 stylesFactory files. Estimated scope: ~8 files; suggested estimate: 2 points.
3. **Split oversized Go files in high-churn services** — 66 non-test Go files exceed 800 LOC (generated files excluded). Estimated scope: ~66 files; suggested estimate: 8 points.
4. **Complete feature toggle cleanup and OpenFeature migration** — 3 deprecated toggles have active call sites and old IsEnabled APIs appear in 162 files. Estimated scope: ~162 files; suggested estimate: 13 points. (see `pkg/services/featuremgmt/` docs)
5. **Reduce explicit any usage in top frontend hotspots** — Explicit any appears 393 times across 137 files. Estimated scope: ~137 files; suggested estimate: 13 points.

## Change Log

### 2026-06-13 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | 0 |
| connect() HOC | 41 | 41 | 0 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory | 16 | 16 | 0 |
| Explicit `any` | 393 | 393 | 0 |
| `any` files | 137 | 137 | 0 |
| @deprecated APIs | 51 | 54 | +3 |
| Frontend TODO/FIXME/HACK | 618 | 609 | -9 |
| Backend TODO/FIXME/HACK | 894 | 914 | +20 |
| nolint directives | 1,275 | 1,275 | 0 |
| Oversized Go files (>800 loc) | 78 | 66 | -12 |
| Deprecated Go APIs | 65 | 74 | +9 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 162 | 0 |

**Resolved since last scan:**
- 9 fewer frontend todo/fixme/hack signal(s)
- 12 fewer oversized go files (>800 loc) signal(s)

**New since last scan:**
- 3 additional @deprecated apis signal(s)
- 20 additional backend todo/fixme/hack signal(s)
- 9 additional deprecated go apis signal(s)

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
