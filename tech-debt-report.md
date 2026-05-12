# Tech Debt Report — all — 2026-05-12

## Hotspots (high debt × high churn)

Priority score = debt signals × log2(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|-------------------|----------------|
| 1 | `public/app/plugins/datasource/` | 295 | 166 | 2178.19 |
| 2 | `pkg/services/ngalert/` | 250 | 174 | 1862.8 |
| 3 | `pkg/api/` | 164 | 128 | 1149.84 |
| 4 | `public/app/features/dashboard/` | 155 | 150 | 1121.95 |
| 5 | `public/app/features/alerting/` | 133 | 240 | 1052.41 |
| 6 | `public/app/plugins/panel/` | 132 | 157 | 964.1 |
| 7 | `pkg/services/publicdashboards/` | 132 | 9 | 438.49 |
| 8 | `pkg/services/libraryelements/` | 129 | 13 | 491.15 |
| 9 | `public/app/core/` | 92 | 158 | 672.79 |
| 10 | `public/app/features/explore/` | 64 | 95 | 421.44 |

## Frontend Modernization

- **Class components**: 60 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 file
- **stylesFactory**: 16 files

Top concentration areas:
- Class components: `plugins/datasource` (11), `plugins/panel` (11), `features/dashboard` (10), `features/explore` (8)
- connect() HOC: `features/dashboard` (9), `features/explore` (8), `features/admin` (5), `features/variables` (4)
- stylesFactory: `features/explore` (7), `plugins/panel` (4), `features/dashboard` (2), `features/query` (1)
- For class/connect migrations, use the **`migrate-class-components`** skill.

## Type Safety

- **Explicit `any`**: 397 occurrences across 140 files
- **@deprecated APIs**: 46 files

Worst `any` offenders:
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

- **Frontend TODO/FIXME/HACK/XXX**: 602 occurrences
- **Backend TODO/FIXME/HACK/XXX**: 894 occurrences

## Go Quality

- **nolint directives**: 1274 occurrences
- **Oversized files (>800 LOC)**: 78 files
- **Deprecated Go APIs**: 65 files

Top oversized non-test files (actionable sample):

| File | Lines |
|------|-------|
| `pkg/services/featuremgmt/registry.go` | 2828 |
| `pkg/setting/setting.go` | 2432 |
| `pkg/services/dashboards/service/dashboard_service.go` | 2410 |
| `pkg/storage/unified/search/bleve.go` | 2192 |
| `pkg/storage/unified/resource/storage_backend.go` | 2189 |
| `pkg/util/xorm/core/core.go` | 2176 |
| `pkg/storage/unified/resource/server.go` | 1941 |
| `pkg/services/ngalert/store/alert_rule.go` | 1873 |
| `pkg/services/ngalert/models/testing.go` | 1650 |
| `pkg/registry/apis/provisioning/register.go` | 1579 |
| `pkg/storage/unified/resource/search.go` | 1551 |
| `pkg/services/live/live.go` | 1477 |

## Feature Toggles

- **Deprecated toggles with active call sites**: `prometheusAzureOverrideAudience`, `localeFormatPreference`, `prometheusTypeMigration`
- **Old IsEnabled API call sites**: 162 files
- Migration target: OpenFeature in `pkg/services/featuremgmt/`.

## Recommended Actions

1. **[Tech Debt] Reduce debt concentration in public/app/plugins** — 427 signals across 145 files; highest hotspot is `public/app/plugins/datasource/`.
2. **[Tech Debt] Reduce debt concentration in pkg/services/ngalert** — 250 signals across 97 files with sustained churn.
3. **[Tech Debt] Reduce debt concentration in pkg/api** — 164 signals across 38 files; continue extraction into service-layer helpers.
4. **[Tech Debt] Migrate dashboard class/connect components to hooks** — dashboard still has 10 class components and 9 connect() usages.
5. **[Tech Debt] Modernize Explore TraceView (stylesFactory + unsafe lifecycle)** — TraceView still contains 7 stylesFactory files and 1 unsafe lifecycle usage.
6. **[Tech Debt] Split oversized Go files (setting.go, dashboard_service.go, storage_backend.go)** — oversized non-test Go files increased to 78.
7. **[Tech Debt] Clean up deprecated feature toggles and migrate IsEnabled API** — 3 deprecated toggles and 162 old API call-site files remain.
8. **[Tech Debt] Reduce explicit any in top 10 frontend files** — `any` usage rose to 397 occurrences.

## Change Log

### 2026-05-12 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 60 | -1 |
| connect() HOC | 41 | 41 | 0 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory | 16 | 16 | 0 |
| Explicit any | 393 | 397 | +4 |
| any files | 137 | 140 | +3 |
| @deprecated APIs | 51 | 46 | -5 |
| Frontend TODO/FIXME/HACK | 618 | 602 | -16 |
| Backend TODO/FIXME/HACK | 894 | 894 | 0 |
| nolint directives | 1275 | 1274 | -1 |
| Oversized Go files (>800 LOC) | 67 | 78 | +11 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 162 | 0 |

**Resolved since last scan:**
- 1 class component file(s) removed
- 5 file(s) with @deprecated APIs cleaned up
- 16 frontend TODO/FIXME/HACK/XXX comments removed
- 1 nolint directive(s) removed

**New since last scan:**
- 4 new explicit any annotation(s) added
- explicit any now appears in 3 additional file(s)
- 11 additional non-test Go file(s) now exceed 800 LOC

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
