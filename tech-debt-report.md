# Tech Debt Report — all scopes — 2026-04-27

## Hotspots (high debt × high churn)

Priority score = debt signals × log₂(commits + 1)

Signal bundles per area are consistent with the 2026-04-14 aggregation (class + connect + lifecycles + stylesFactory + type/comment hot spots for frontend; registry/ngalert from dedicated bucket scans). **Commits** re-measured with `git log --since="6 months ago"`.

| Rank | Area | Debt signals (approx.) | Commits (6mo) | Priority score |
|------|------|------------------------|---------------|----------------|
| 1 | `public/app/features/dashboard/` | 28 | 160 | 205 |
| 2 | `public/app/plugins/` | 21 | 335 | 176 |
| 3 | `public/app/features/explore/` | 14 | 100 | 93 |
| 4 | `public/app/features/alerting/` | 11 | 259 | 88 |
| 5 | `pkg/services/ngalert/` (backend bucket) | high TODO/nolint density | 181 | backend hotspot |
| 6 | `public/app/core/` | 5 | 171 | 37 |
| 7 | `public/app/features/variables/` | 8 | 21 | 36 |
| 8 | `public/app/features/query/` | 5 | 27 | 24 |
| 9 | `pkg/registry/` (backend bucket) | high TODO/nolint density | 598 | backend hotspot |
| 10 | `public/app/features/dashboard-scene/` | 0 legacy class/connect, moderate any/TODO | 531 | low (modern code) |

## Frontend modernization

### Class components: 61 files

Top areas (unchanged list — see 2026-04-14 report for file names): `features/dashboard/`, `features/explore/`, `plugins/panel/`, `plugins/datasource/`, `features/variables/`, `features/query/`, `core/`, etc.

### `connect()` HOC (Redux): 41 files

### Unsafe lifecycle methods: 1 file

- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx` — `UNSAFE_componentWillReceiveProps`

### Legacy `stylesFactory`: 16 files

## Type safety

### Explicit `any`: 393 occurrences across 137 files

Top offenders (unchanged from last quantitative snapshot):

- `public/app/features/dashboard/state/DashboardModel.ts` — 23
- `public/app/core/time_series2.ts` — 19
- `public/app/plugins/datasource/opentsdb/datasource.ts` — 16
- `public/app/features/dashboard/state/DashboardMigrator.ts` — 16
- `public/app/features/dashboard/state/PanelModel.ts` — 13
- `public/app/plugins/datasource/influxdb/query_part.ts` — 12
- `public/app/plugins/datasource/influxdb/datasource.ts` — 11
- `public/app/features/alerting/state/query_part.ts` — 10
- `public/app/plugins/datasource/graphite/graphite_query.ts` — 9
- `public/app/features/explore/TraceView/components/model/link-patterns.tsx` — 9
- `public/app/features/templating/template_srv.ts` — 8

### `@deprecated` APIs: 51 files (non-generated TypeScript, `*.gen.ts` excluded)

## Comment debt

### Frontend TODO/FIXME/HACK/XXX: 618 occurrences across 337 files

### Backend TODO/FIXME/HACK/XXX: 894 occurrences across 453 files

## Go quality

### `nolint` directives: 1275 occurrences (pkg/, excludes `*.gen.go` / `*.pb.go` per scan)

### Oversized non-test Go files (>800 loc): 78 files

*Method:* `find pkg/ -name '*.go' ! -name '*_test.go' ! -name '*.gen.go' ! -name '*.pb.go'` and line count > 800. Includes very large test harnesses under `pkg/tests/` if they are not `*_test.go` (e.g. shared `testing.go` files).

Notable non-generated service files (sample):

| File | Lines (approx.) |
|------|-----------------|
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
| `pkg/api/dashboard.go` | 1290 |

### Deprecated Go APIs: 65 files

*Method:* `rg 'Deprecated:' pkg/ -g '*.go' -g '!*.gen.go' -g '!*.pb.go' --files-with-matches`

## Feature toggles

### Deprecated toggles in registry: 3 (`FeatureStageDeprecated` in `pkg/services/featuremgmt/registry.go`)

| Toggle | Notes |
|--------|--------|
| `prometheusAzureOverrideAudience` | Remove when safe |
| `localeFormatPreference` | Paused, remove later |
| `prometheusTypeMigration` | Migration helper |

### Old `IsEnabled` / `IsEnabledGlobally` API: 162 files in `pkg/`

Call sites should migrate to OpenFeature (see `pkg/services/featuremgmt/models.go`).

## Recommended actions

1. **Priority 1 — `features/dashboard/` legacy stack** — High churn (160 commits / 6mo) plus class components, `connect()`, and heavy `any` usage. Use the **`migrate-class-components`** skill.
2. **Priority 2 — Explore TraceView** — One unsafe lifecycle, most `stylesFactory` usage, class-based pieces; batch modernization.
3. **Priority 3 — oversized Go** — Split `setting.go`, `dashboard_service.go`, and `storage_backend.go` / related large files; highest leverage for reviewability.
4. **Priority 4 — feature toggles** — Remove 3 deprecated toggles; migrate 162 `pkg/` files from `IsEnabled` to OpenFeature in phases.
5. **Priority 5 — `any` reduction** — Tighten types in the top 10 files listed above.
6. **Priority 6 — plugin datasource classes** — Modernize remaining class-based datasource editors as part of plugin maintenance.

## Change log

### 2026-04-27 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | 0 |
| `connect()` HOC | 41 | 41 | 0 |
| Unsafe lifecycles | 1 | 1 | 0 |
| `stylesFactory` | 16 | 16 | 0 |
| Explicit `any` (occurrences) | 393 | 393 | 0 |
| `any` files | 137 | 137 | 0 |
| `@deprecated` API files | 51 | 51 | 0 |
| Frontend TODO/FIXME/HACK | 618 | 618 | 0 |
| Backend TODO/FIXME/HACK | 894 | 894 | 0 |
| `nolint` directives | 1275 | 1275 | 0 |
| Oversized Go files (>800 loc) | 67 | 78 | +11 (method: non-test, exclude `*.gen`/`*.pb` only) |
| Deprecated feature toggles | 3 | 3 | 0 |
| `IsEnabled` / `IsEnabledGlobally` files | 162 | 162 | 0 |
| Deprecated: marker files (Go) | ~77 | 65 | −12 (stricter `*.go` only, excludes more generated) |

**Resolved since last scan:** None (no file-level diffs in tracked patterns).

**New since last scan:** None for core modernization metrics. Oversized-file count changed due to recounted `find` scope; Deprecated: file count lower with current grep excludes.

### 2026-04-14

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
