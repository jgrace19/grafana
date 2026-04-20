# Tech Debt Report — All Scopes — 2026-04-20

## Hotspots (high debt × high churn)

Priority score = file-scoped debt signals × log2(commits + 1)

| Rank | Area | Debt Signals | Commits (6mo) | Priority Score |
|------|------|--------------|---------------|----------------|
| 1 | `pkg/registry/apis/` | 128 | 520 | 1155 |
| 2 | `pkg/services/ngalert/` | 120 | 185 | 905 |
| 3 | `public/app/plugins/datasource/` | 81 | 192 | 615 |
| 4 | `public/app/features/alerting/` | 76 | 270 | 614 |
| 5 | `public/app/plugins/panel/` | 76 | 182 | 571 |
| 6 | `pkg/api/` | 64 | 147 | 461 |
| 7 | `public/app/features/dashboard/` | 52 | 170 | 386 |
| 8 | `public/app/features/explore/` | 47 | 106 | 317 |
| 9 | `public/app/core/` | 40 | 187 | 302 |
| 10 | `public/app/features/dashboard-scene/` | 30 | 547 | 273 |

## Frontend Modernization

- **Class components**: 61 files total (`60` production files plus `1` test-only fixture)
- **connect() HOC**: 44 `react-redux` files
- **Unsafe lifecycles**: 1 file
- **stylesFactory**: 16 files

Top areas:
- `public/app/features/dashboard/` — 10 class components, 9 `connect()` HOCs, 2 `stylesFactory` call sites, 104 explicit `any` occurrences
- `public/app/features/explore/` — 8 class components, 10 `connect()` HOCs, 7 `stylesFactory` call sites, and the only unsafe lifecycle
- `public/app/plugins/datasource/` — 12 class components, 95 explicit `any` occurrences, 7 deprecated APIs
- `public/app/features/variables/` — 4 class components, 4 `connect()` HOCs, 30 explicit `any` occurrences
- `public/app/plugins/panel/` — 11 class components and 4 `stylesFactory` call sites

Only unsafe lifecycle:
- `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx` — `UNSAFE_componentWillReceiveProps`

Legacy `stylesFactory` remains concentrated in:
- `public/app/features/explore/TraceView/` — 7 files
- `public/app/features/dashboard/` — 2 files
- `public/app/plugins/panel/` — 4 files
- `public/app/features/query/` — 1 file
- `public/app/features/inspector/` — 1 file
- `public/app/plugins/datasource/graphite/` — 1 file

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
- **`@deprecated` APIs**: 46 files

Worst explicit `any` offenders:
- `public/app/features/dashboard/state/DashboardModel.ts` — 23
- `public/app/core/time_series2.ts` — 19
- `public/app/features/dashboard/state/DashboardMigrator.ts` — 16
- `public/app/plugins/datasource/opentsdb/datasource.ts` — 16
- `public/app/features/dashboard/state/PanelModel.ts` — 13
- `public/app/plugins/datasource/influxdb/query_part.ts` — 12
- `public/app/plugins/datasource/influxdb/datasource.ts` — 11
- `public/app/features/alerting/state/query_part.ts` — 10
- `public/app/features/explore/TraceView/components/model/link-patterns.tsx` — 9
- `public/app/plugins/datasource/graphite/graphite_query.ts` — 9

Representative deprecated API definitions still in-tree:
- `public/app/features/dashboard/state/DashboardModel.ts`
- `public/app/core/services/backend_srv.ts`
- `public/app/features/templating/template_srv.ts`
- `public/app/types/events.ts`
- `public/app/core/time_series2.ts`

## Comment Debt

- **Frontend TODO/FIXME/HACK/XXX**: 602 occurrences across 327 files
- **Backend TODO/FIXME/HACK/XXX**: 853 occurrences across 443 files

Frontend hotspots (sample):
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/mssql/azureauth/AzureAuth.test.ts` — 18
- `public/app/plugins/panel/xychart/SeriesEditor.tsx` — 7

Backend hotspots (production-facing sample):
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/registry/apis/provisioning/register.go` — 10
- `pkg/services/org/orgimpl/org.go` — 10
- `pkg/storage/unified/resource/datastore.go` — 10
- `pkg/storage/unified/sql/queries.go` — 9

## Go Quality

- **`nolint` directives**: 1274 occurrences across 486 files
- **Oversized files (>800 loc)**: 57 production files
- **Deprecated Go APIs**: 58 files

Top non-test `nolint` concentrations:
- `pkg/services/dashboards/service/dashboard_service.go` — 26
- `pkg/services/libraryelements/api.go` — 13
- `pkg/services/libraryelements/database.go` — 12
- `pkg/services/navtree/navtreeimpl/navtree.go` — 11
- `pkg/registry/apis/provisioning/register.go` — 6

Largest oversized Go files:

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

Deprecated Go APIs remain concentrated in `pkg/api/`, `pkg/services/libraryelements/`, `pkg/services/featuremgmt/models.go`, and `pkg/storage/unified/resource/server.go`.

## Feature Toggles

- **Deprecated toggles in registry**: 3
- **Old `IsEnabled` / `IsEnabledGlobally` call sites**: 161 files

Deprecated toggles:

| Toggle Name | Description |
|---|---|
| `prometheusAzureOverrideAudience` | Deprecated. Allow override default AAD audience for Azure Prometheus endpoint. Enabled by default. This feature should no longer be used and will be removed in the future. |
| `localeFormatPreference` | Specifies the locale so the correct format for numbers and dates can be shown. |
| `prometheusTypeMigration` | Checks for deprecated Prometheus authentication methods (SigV4 and Azure), installs the relevant data source, and migrates the Prometheus data sources. |

These call sites should migrate to the OpenFeature interface described in `pkg/services/featuremgmt/models.go`.

## Recommended Actions

1. **Stabilize `pkg/registry/apis/`**: 128 file-scoped debt signals across 91 files and 520 commits in 6 months. The area mixes comment debt, `nolint`, 5 oversized files, and 15 old `IsEnabled` call sites.
2. **Refactor `pkg/services/ngalert/`**: 120 signals across 77 files, including 12 oversized files, 36 `nolint` suppressions, and 16 old `IsEnabled` call sites. This is the highest-churn backend hotspot after `pkg/registry/apis/`.
3. **Modernize datasource plugins**: `public/app/plugins/datasource/` still carries 12 class components, 95 explicit `any` occurrences, 7 deprecated APIs, and 35 comment-debt files. This is the densest frontend plugin hotspot.
4. **Burn down unified alerting frontend debt**: `public/app/features/alerting/` has 76 signals, including 57 comment-debt files, 11 `any`-typed files, and 7 deprecated APIs.
5. **Retire dashboard and Explore legacy React surfaces**: `public/app/features/dashboard/` plus `public/app/features/explore/` still hold 18 class components, 19 `connect()` HOCs, 9 `stylesFactory` sites, and the only unsafe lifecycle. Use the **`migrate-class-components`** skill for the class/connect migration portion.
6. **Split oversized Go files**: start with `pkg/services/featuremgmt/registry.go`, `pkg/setting/setting.go`, `pkg/services/dashboards/service/dashboard_service.go`, and `pkg/storage/unified/resource/storage_backend.go`.
7. **Remove deprecated toggles and migrate old feature-flag accessors**: clean up the 3 deprecated toggles and move the remaining 161 `IsEnabled` / `IsEnabledGlobally` call sites to OpenFeature.

## Change Log

### 2026-04-20 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | 0 |
| connect() HOC | 41 | 44 | +3 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory | 16 | 16 | 0 |
| Explicit `any` | ~393 | ~393 | 0 |
| `any` files | ~137 | ~137 | 0 |
| @deprecated APIs | ~51 | ~46 | -5 |
| Frontend TODO/FIXME/HACK | ~618 | ~602 | -16 |
| Backend TODO/FIXME/HACK | ~894 | ~853 | -41 |
| nolint directives | ~1,275 | ~1,274 | -1 |
| Oversized Go files (>800 loc) | 67 | 57 | -10 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | ~162 | ~161 | -1 |

**Resolved since last scan:**
- 5 frontend files no longer define `@deprecated` APIs
- 16 frontend TODO/FIXME/HACK markers were removed
- 41 backend TODO/FIXME/HACK markers were removed
- 1 legacy `IsEnabled` call site left the tree

**New since last scan:**
- 3 additional `react-redux` `connect()` HOCs are now tracked outside the older `connect(mapState|connect(null)` subset

**Scan notes:**
- Oversized Go file counting now consistently excludes test helpers under `/testing/` and filenames ending `_tests.go`, leaving 57 production files above 800 LOC.
- Hotspot ranking is now based on file-scoped debt signals so large test suites do not dominate the priority list.

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
