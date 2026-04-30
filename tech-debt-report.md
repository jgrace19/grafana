# Tech Debt Report — All Scopes — 2026-04-30

## Hotspots (high debt × high churn)

Priority score = debt signals × log₂(commits + 1)

Per-area **signals** sum distinct-file hits across the Step 2 scans for that subtree (frontend: class + `connect()` + unsafe lifecycle + `stylesFactory` + files with `: any` + `@deprecated`; backend: TODO/FIXME/HACK + `nolint` + `Deprecated:` + `IsEnabled`/`IsEnabledGlobally` + non-test `.go` files >800 LOC). **Commits** = `git log --since="6 months ago"` on the directory.

| Rank | Area | Debt signals | Commits (6mo) | Priority score |
|------|------|--------------|----------------|----------------|
| 1 | `pkg/registry/` | 172 | 590 | ~1584 |
| 2 | `pkg/services/ngalert/` | 130 | 178 | ~973 |
| 3 | `pkg/storage/` | 109 | 349 | ~921 |
| 4 | `public/app/plugins/` | 76 | 326 | ~635 |
| 5 | `public/app/features/dashboard/` | 48 | 156 | ~350 |
| 6 | `public/app/features/alerting/` | 26 | 254 | ~208 |
| 7 | `public/app/features/explore/` | 27 | 98 | ~179 |
| 8 | `public/app/core/` | 22 | 166 | ~162 |
| 9 | `public/app/features/variables/` | 25 | 20 | ~110 |
| 10 | `public/app/features/dashboard-scene/` | 10 | 520 | ~90 |

## Frontend Modernization

### Class components: 61 files

Top areas:
- `features/dashboard/` — 10 files (`DashboardPage`, `DashboardPanel`, `DashboardGrid`, `PanelEditor`, `SubMenu`, `ShareSnapshot`, `VersionsSettings`, `DashboardRow`, `PanelEditorQueries`, `PanelStateWrapper`)
- `features/explore/` — 8 files (`Explore`, `LogsContainer`, `LiveLogs`, `TableContainer`, `TraceTimelineViewer`, TraceView DraggableManager demos, and related)
- `features/variables/` — 4 files (`QueryVariableEditor`, `OptionsPicker`, `VariableEditorEditor`, `VariableEditorContainer`)
- `plugins/panel/` — multiple panel plugins still on classes (e.g. Canvas, Geomap, Live, GettingStarted, BarGauge, AnnoList)
- `plugins/datasource/` — multiple datasource editors still on classes (InfluxDB, Graphite, Loki, Tempo, AzureMonitor, CloudMonitoring, Pyroscope, etc.)
- `features/query/` — 3 files (`QueryGroup`, `QueryEditorRows`, `QueryEditorRow`)
- `features/logs/` — 2 files (`LogMessageAnsi`, `LogDetailsRow`)

### `connect()` HOC (Redux): 41 files

Top areas:
- `features/dashboard/` — 9 files (includes `DashboardPage`, `DashboardPanel`, `PanelEditor`, `SubMenu`, `DashNav`, `GeneralSettings`, and related wiring)
- `features/explore/` — 7 files (`Explore`, `LogsContainer`, `TableContainer`, `RichHistoryContainer`, `ExploreQueryInspector`, `ExplorePaneContainer`, `NodeGraphContainer`)
- `features/admin/` — 4 files (`UserAdminPage`, `UpgradePage`, `UserListAnonymousPage`, `UserListAdminPage`, `LdapSettingsPage`)
- `features/variables/` — 4 files (`QueryVariableEditor`, `OptionsPicker`, `VariableEditorEditor`, `VariableEditorContainer`)

### Unsafe lifecycle methods: 1 file

- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx` — uses `UNSAFE_componentWillReceiveProps`

### Legacy `stylesFactory`: 16 files

- `features/explore/TraceView/` — 7 files (SpanBarRow, SpanDetailRow, SpanTreeOffset, VirtualizedTraceView, ViewingLayer, TimelineViewingLayer, TraceTimelineViewer index)
- `features/dashboard/` — 2 files (SubMenu, PanelEditor)
- `features/query/` — 1 file (QueryGroup)
- `features/inspector/` — 1 file (styles.ts)
- `plugins/panel/` — 3 files (GettingStarted, LivePanel, LiveChannelEditor, AnnoListPanel)
- `plugins/datasource/graphite/` — 1 file (MetricTankMetaInspector)

## Type Safety

### Explicit `any`: 393 occurrences across 137 files

Worst offenders (by occurrence count):
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
- `public/app/features/explore/TraceView/components/model/link-patterns.tsx` — 9

### `@deprecated` APIs: 51 files (non-generated)

Key files with deprecated APIs still defined:
- `public/app/features/dashboard/state/DashboardModel.ts`
- `public/app/core/services/backend_srv.ts`
- `public/app/features/templating/template_srv.ts`
- `public/app/types/events.ts`
- `public/app/core/time_series2.ts`

## Comment Debt

### Frontend TODO/FIXME/HACK/XXX: 618 occurrences (aggregate across matched lines)

Sample high-density areas: datasource Azure credential forms, Prometheus/MSSQL Azure helpers, and plugin config editors.

### Backend TODO/FIXME/HACK/XXX: 894 occurrences (aggregate across matched lines)

Sample files (non-exhaustive):
- `pkg/storage/secret/metadata/query.go`
- `pkg/storage/unified/testing/kv.go`
- `pkg/registry/apis/provisioning/register.go`
- `pkg/services/org/orgimpl/org.go`

## Go Quality

### `nolint` directives: 1275 occurrences (aggregate across matched lines in `pkg/`)

### Oversized non-test Go files (>800 loc): 78 files

Counted with `find pkg/ … ! -name '*_test.go' ! -name '*.gen.go' ! -name '*.pb.go'` and `awk 'END { if (NR > 800) print … }'` per file.

Top actionable files (excluding obvious generated bundles where applicable):

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
| `pkg/services/live/live.go` | 1477 |
| `pkg/storage/unified/sql/backend.go` | 1426 |
| `pkg/services/ngalert/api/prometheus/api_prometheus.go` | 1395 |
| `pkg/services/ngalert/models/alert_rule.go` | 1322 |
| `pkg/api/dashboard.go` | 1290 |

*Note*: `registry.go` is the feature-toggle registry — splitting by area reduces merge pain. `setting.go` and `dashboard_service.go` are high-churn and benefit from modular boundaries.

### Deprecated Go APIs: 65 files (non-generated; `Deprecated:` marker)

## Feature Toggles

### Deprecated toggles (3 in registry)

| Toggle name | Notes |
|-------------|--------|
| `prometheusAzureOverrideAudience` | Deprecated Azure Prometheus audience override; enabled by default; removal planned |
| `localeFormatPreference` | Paused; removal planned |
| `prometheusTypeMigration` | Migrates deprecated Prometheus auth (SigV4/Azure); restart required |

### Old `IsEnabled` / `IsEnabledGlobally` API: 162 files

Migrate call sites to OpenFeature (see deprecation in `pkg/services/featuremgmt/models.go`).

## Recommended Actions

### Priority 1: Dashboard legacy React (`features/dashboard/`)

Highest frontend hotspot (~350 priority score): 10 class components, 9 `connect()` files, heavy `any` usage in state models, 156 commits in 6 months. Use the **`migrate-class-components`** skill for systematic conversion.

### Priority 2: Backend registry + storage + ngalert

`pkg/registry/` leads the repo on priority score (~1584); `pkg/services/ngalert/` and `pkg/storage/` follow. Focus on oversized files, TODO density, and legacy `IsEnabled` usage in these trees (see existing Linear issues JG-123, JG-125, JG-122).

### Priority 3: Explore TraceView modernization

Only unsafe lifecycle in the repo; 7 of 16 `stylesFactory` usages; cluster of class components. Batch modernization is efficient.

### Priority 4: Plugin subtree (`public/app/plugins/`)

Second-highest frontend priority score (~635): many class components, `stylesFactory`, `any`, and `@deprecated` pockets. Align with plugin maintenance and JG-124.

### Priority 5: Oversized Go files

Split or modularize `setting.go`, `dashboard_service.go`, `storage_backend.go`, and other >800 LOC hotspots (JG-110).

### Priority 6: Feature toggles

Remove the 3 deprecated toggles when safe and migrate `IsEnabled` call sites to OpenFeature (JG-111).

### Priority 7: Explicit `any` reduction

Tighten types in `DashboardModel.ts`, `time_series2.ts`, datasource giants (`opentsdb`, `influxdb`), and `DashboardMigrator.ts` / `PanelModel.ts` (JG-112).

## Remediation skills

- Class components / `connect()` → `.cursor/skills/migrate-class-components/SKILL.md`
- Feature toggles → `pkg/services/featuremgmt/`

## Change Log

### 2026-04-30 (current scan)

| Metric | Previous (2026-04-14) | Current | Delta |
|--------|------------------------|---------|-------|
| Class components | 61 | 61 | 0 |
| connect() HOC files | 41 | 41 | 0 |
| Dashboard subtree `connect()` files | ~6 | 9 | +3 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory files | 16 | 16 | 0 |
| Explicit `any` | ~393 | 393 | 0 |
| `any` files | ~137 | 137 | 0 |
| @deprecated API files | ~51 | 51 | 0 |
| Frontend TODO/FIXME/HACK | ~618 | 618 | 0 |
| Backend TODO/FIXME/HACK | ~894 | 894 | 0 |
| nolint occurrences | ~1275 | 1275 | 0 |
| Oversized Go files (>800 loc) | 67 | 78 | +11 |
| Deprecated Go API files | ~77 | 65 | -12 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | ~162 | 162 | 0 |

**Resolved since last scan:**
- 12 files dropped the `Deprecated:` marker band used for “deprecated Go API” counting (or exited the matched set); treat as hygiene unless APIs are still exported informally.

**New since last scan:**
- 11 additional non-test `.go` files exceed 800 lines under the standard find/awk scan (includes large integration helpers under `pkg/tests/apis/` and generated-openapi-style files — confirm ownership before splitting).
- Dashboard subtree shows **9** distinct files matching the Redux `connect(mapState|connect(null` pattern vs **~6** called out in the prior narrative (counting methodology aligned with `rg`).

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
