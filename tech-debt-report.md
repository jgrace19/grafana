# Tech Debt Report — All Scopes — 2026-06-10

## Hotspots (high debt × high churn)

Priority score = debt signals × log2(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|--------------------|----------------|
| 1 | `pkg/registry/` | 177 | 475 | 1574.38 |
| 2 | `pkg/services/ngalert/` | 142 | 144 | 1019.55 |
| 3 | `pkg/storage/` | 107 | 294 | 877.89 |
| 4 | `public/app/features/alerting/` | 90 | 201 | 689.24 |
| 5 | `pkg/tests/` | 73 | 441 | 641.52 |
| 6 | `public/app/plugins/datasource/` | 87 | 127 | 609.00 |
| 7 | `public/app/plugins/panel/` | 76 | 137 | 540.25 |
| 8 | `pkg/api/` | 73 | 109 | 495.04 |
| 9 | `public/app/features/dashboard/` | 64 | 116 | 439.70 |
| 10 | `public/app/core/` | 47 | 123 | 326.85 |

## Frontend Modernization

- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 file
- **stylesFactory**: 16 files

Hot areas:
- `public/app/features/dashboard/` (legacy class + `connect()` concentration)
- `public/app/features/explore/TraceView/` (unsafe lifecycle + `stylesFactory`)
- `public/app/plugins/datasource/` and `public/app/plugins/panel/` (class components)

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 46 files

Top `any` offenders:
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

- **Frontend TODO/FIXME/HACK/XXX**: 602 occurrences
- **Backend TODO/FIXME/HACK/XXX**: 894 occurrences

## Go Quality

- **nolint directives**: 1274 occurrences
- **Oversized Go files (>800 loc)**: 66 files
- **Deprecated Go APIs (`Deprecated:` marker)**: 65 files

Top oversized actionable files (excluding obvious test harness files):

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
| `pkg/registry/apis/provisioning/register.go` | 1579 |
| `pkg/storage/unified/resource/search.go` | 1551 |

## Feature Toggles

- **Deprecated toggles in registry**: 3
  - `prometheusAzureOverrideAudience`
  - `localeFormatPreference`
  - `prometheusTypeMigration`
- **Old IsEnabled API call sites**: 162 files

## Recommended Actions

1. **[Tech Debt] Migrate dashboard/explore class and connect components to hooks**
   - Scope: `public/app/features/dashboard/` and `public/app/features/explore/` (class components + `connect()` debt)
   - How: Use the `migrate-class-components` skill to migrate class + `connect()` patterns to hooks.

2. **[Tech Debt] Modernize Explore TraceView (stylesFactory + unsafe lifecycle)**
   - Scope: `public/app/features/explore/TraceView/` (only unsafe lifecycle call site plus most legacy `stylesFactory` usages)
   - How: Replace unsafe lifecycle methods with hooks and move to `useStyles2`.

3. **[Tech Debt] Split oversized Go files (setting.go, dashboard_service.go, storage_backend.go)**
   - Scope: highest-churn oversized files in `pkg/setting/`, `pkg/services/dashboards/service/`, `pkg/storage/unified/`
   - How: extract focused helpers/modules, keep behavior unchanged, add targeted unit coverage as needed.

4. **[Tech Debt] Clean up deprecated feature toggles and migrate IsEnabled API**
   - Scope: remove 3 toggles marked `FeatureStageDeprecated` and migrate 162 legacy `IsEnabled` / `IsEnabledGlobally` call sites.
   - How: follow feature toggle cleanup guidance in `pkg/services/featuremgmt/` and migrate incrementally to OpenFeature APIs.

5. **[Tech Debt] Reduce explicit any in top 10 frontend files**
   - Scope: top 10 files account for a significant portion of `any` usage.
   - How: introduce stricter local types and narrow unknown payload boundaries.

## Change Log

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

### 2026-06-10 (current scan)

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
- 5 files with `@deprecated` APIs no longer match this scan.
- Frontend TODO/FIXME/HACK/XXX occurrences decreased by 16.
- `nolint` directives decreased by 1.
- One file dropped below the oversized Go file threshold.

**New since last scan:** None.
