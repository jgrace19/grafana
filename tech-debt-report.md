# Tech Debt Report — All Scopes — 2026-05-18

## Hotspots (high debt × high churn)

Priority score = debt signals × log₂(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|--------------------|----------------|
| 1 | `pkg/registry/` | 177 | 539 | 1606.60 |
| 2 | `pkg/services/ngalert/` | 142 | 169 | 1052.13 |
| 3 | `pkg/storage/` | 107 | 332 | 896.59 |
| 4 | `public/app/features/alerting/` | 90 | 230 | 706.66 |
| 5 | `public/app/plugins/datasource/` | 87 | 150 | 629.74 |
| 6 | `public/app/plugins/panel/` | 76 | 147 | 547.92 |
| 7 | `pkg/api/` | 73 | 127 | 511.00 |
| 8 | `public/app/features/dashboard/` | 64 | 142 | 458.23 |
| 9 | `public/app/core/` | 47 | 146 | 338.38 |
| 10 | `public/app/features/explore/` | 47 | 90 | 305.87 |

## Frontend Modernization

- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 file
- **stylesFactory**: 16 files

Notable legacy React cluster samples:
- Dashboard class components (10 files): `DashboardPage`, `DashboardPanel`, `DashboardGrid`, `PanelEditor`, `SubMenu`, `ShareSnapshot`, `VersionsSettings`, `DashboardRow`, `PanelEditorQueries`, `PanelStateWrapper`.
- Explore TraceView still contains the lone unsafe lifecycle and multiple `stylesFactory` usages.
- Datasource plugin editors still include class components across AzureMonitor, CloudMonitoring, Graphite, InfluxDB, Loki, Tempo, and Pyroscope.

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 46 files

Top `any` offenders:
- `public/app/features/dashboard/state/DashboardModel.ts` — 23
- `public/app/core/time_series2.ts` — 19
- `public/app/features/dashboard/state/DashboardMigrator.ts` — 16
- `public/app/plugins/datasource/opentsdb/datasource.ts` — 16
- `public/app/features/dashboard/state/PanelModel.ts` — 13

## Comment Debt

- **Frontend TODO/FIXME/HACK/XXX**: 602 occurrences
- **Backend TODO/FIXME/HACK/XXX**: 894 occurrences

Frontend hotspots (sample):
- `public/app/plugins/datasource/azuremonitor/components/ConfigEditor/AppRegistrationCredentials.tsx` — 36
- `public/app/plugins/datasource/mssql/azureauth/AzureCredentialsForm.tsx` — 27
- `public/app/plugins/datasource/prometheus/configuration/AzureCredentialsForm.tsx` — 27

Backend hotspots (sample):
- `pkg/storage/secret/metadata/query.go` — 17
- `pkg/tests/apis/dashboard/integration/api_validation_test.go` — 16
- `pkg/registry/apis/provisioning/register.go` — 10

## Go Quality

- **nolint directives**: 1,274 occurrences
- **Oversized files (>800 loc, non-generated, non-`_test.go`)**: 66 files
- **Deprecated Go APIs (`Deprecated:` markers)**: 65 files

Largest actionable oversized files:

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

### Deprecated toggles with active registry entries

- `localeFormatPreference`
- `prometheusAzureOverrideAudience`
- `prometheusTypeMigration`

### Old IsEnabled API call sites

- **Old `IsEnabled`/`IsEnabledGlobally` API**: 162 files
- Migration target: OpenFeature interface in `pkg/services/featuremgmt/models.go` and related feature management services.

## Recommended Actions

1. **[Tech Debt] Reduce debt density in `pkg/registry/` high-churn APIs**
   - Why: highest hotspot (177 signals, 539 commits, score 1606.60).
   - How: target TODO/FIXME cleanup, reduce `nolint` suppressions, and prune deprecated pathways in provisioning and IAM registries.
2. **[Tech Debt] Stabilize `pkg/services/ngalert/` and adjacent alerting API debt**
   - Why: second-highest hotspot (142 signals, 169 commits, score 1052.13).
   - How: focus on suppressions/comment debt in alert rule flow and provisioning paths.
3. **[Tech Debt] Migrate dashboard class/connect patterns to hooks**
   - Why: dashboard still has 10 class components and multiple `connect()` HOCs in a high-churn feature.
   - How: use the **`migrate-class-components` skill** to convert components and remove HOC coupling incrementally.
4. **[Tech Debt] Modernize Explore TraceView legacy React surface**
   - Why: only remaining unsafe lifecycle and multiple `stylesFactory` usages are concentrated there.
   - How: migrate to hooks + `useStyles2`; remove `UNSAFE_componentWillReceiveProps`.
5. **[Tech Debt] Split oversized Go files in core runtime paths**
   - Why: 66 oversized non-generated files remain; top large files are high impact (`setting.go`, `dashboard_service.go`, `storage_backend.go`, `registry.go`).
   - How: extract submodules by concern (parsing/config, CRUD/service orchestration, storage backends, toggle groups).
6. **[Tech Debt] Complete feature toggle migration to OpenFeature**
   - Why: 3 deprecated toggles still present and 162 old `IsEnabled` call-site files.
   - How: remove deprecated toggles and migrate old API usage per `pkg/services/featuremgmt/` guidance.
7. **[Tech Debt] Reduce explicit `any` in top offender files**
   - Why: 393 `any` occurrences remain; concentrated in a small set of high-impact files.
   - How: prioritize top 10 files and enforce strict typed interfaces for dashboard and datasource internals.

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

### 2026-05-18 (current scan)

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
| nolint directives | 1,275 | 1,274 | -1 |
| Oversized Go files (>800 loc) | 67 | 66 | -1 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 162 | 0 |

**Resolved since last scan:**
- 5 files with `@deprecated` APIs were removed from the current scan.
- 16 frontend TODO/FIXME/HACK/XXX occurrences were resolved.
- 1 `nolint` directive was removed.
- 1 oversized non-generated non-`_test.go` Go file dropped below threshold.

**New since last scan:** None
