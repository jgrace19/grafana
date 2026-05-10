# Tech Debt Report — all — 2026-05-10

## Hotspots (high debt x high churn)

Priority score = debt signals x log2(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|--------------------|----------------|
| 1 | `public/app/plugins/datasource/` | 285 | 167 | 2106.81 |
| 2 | `pkg/services/ngalert/` | 213 | 175 | 1588.86 |
| 3 | `public/app/features/dashboard/` | 151 | 153 | 1097.28 |
| 4 | `public/app/features/alerting/` | 132 | 242 | 1046.08 |
| 5 | `public/app/plugins/panel/` | 119 | 158 | 870.23 |
| 6 | `pkg/api/` | 113 | 133 | 798.47 |
| 7 | `public/app/core/` | 82 | 161 | 601.87 |
| 8 | `public/app/features/dashboard-scene/` | 55 | 507 | 494.38 |
| 9 | `pkg/services/libraryelements/` | 122 | 13 | 464.50 |
| 10 | `public/app/features/explore/` | 57 | 95 | 375.34 |

## Frontend Modernization

- **Class components**: 61 files
  - Top buckets: `plugins/datasource` (12), `plugins/panel` (11), `features/dashboard` (10), `features/explore` (8)
- **connect() HOC**: 41 files
  - Top buckets: `features/dashboard` (9), `features/explore` (8), `features/admin` (5), `features/variables` (4)
- **Unsafe lifecycles**: 1 file
  - `public/app/features/explore/TraceView/components/TraceTimelineViewer/TimelineHeaderRow/TimelineViewingLayer.tsx`
- **stylesFactory**: 16 files
  - Top buckets: `features/explore` (7), `plugins/panel` (4), `features/dashboard` (2)

## Type Safety

- **Explicit `any`**: 397 occurrences across 140 files
- **@deprecated APIs**: 46 files

Top explicit `any` offenders:
- `public/app/features/dashboard/state/DashboardModel.ts` - 23
- `public/app/core/time_series2.ts` - 19
- `public/app/features/dashboard/state/DashboardMigrator.ts` - 16
- `public/app/plugins/datasource/opentsdb/datasource.ts` - 16
- `public/app/features/dashboard/state/PanelModel.ts` - 13
- `public/app/plugins/datasource/influxdb/query_part.ts` - 12
- `public/app/plugins/datasource/influxdb/datasource.ts` - 11
- `public/app/features/alerting/state/query_part.ts` - 10
- `public/app/features/dashboard/state/DashboardMigrator.test.ts` - 10
- `public/app/plugins/datasource/graphite/graphite_query.ts` - 9

## Comment Debt

- **Frontend TODO/FIXME/HACK/XXX**: 602 occurrences across 327 files
  - Top files: `AppRegistrationCredentials.tsx` (36), `AzureCredentialsForm.tsx` for MSSQL (27), `AzureCredentialsForm.tsx` for Prometheus (27), `AzureAuth.test.ts` (18)
- **Backend TODO/FIXME/HACK/XXX**: 894 occurrences across 453 files
  - Top files: `pkg/storage/secret/metadata/query.go` (17), `pkg/tests/apis/dashboard/integration/api_validation_test.go` (16), `pkg/tsdb/cloudwatch/kinds/dataquery/types_dataquery_gen.go` (13), `pkg/tests/apis/provisioning/jobs/deletejob_test.go` (12)

## Go Quality

- **nolint directives**: 1,274 occurrences across 486 files
- **Oversized files (>800 loc)**: 78 files
- **Deprecated Go APIs**: 65 files

Top oversized non-test files (actionable subset):

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

Deprecated toggles in registry (`FeatureStageDeprecated`): 3

| Toggle | Runtime call-site files (excl. tests/generated) | Sample call sites |
|--------|-----------------------------------------------:|-------------------|
| `prometheusAzureOverrideAudience` | 2 | `pkg/tsdb/prometheus/azureauth/azure.go`, `pkg/tsdb/prometheus/prometheus.go` |
| `localeFormatPreference` | 0 | none outside registry/generated declarations |
| `prometheusTypeMigration` | 0 | none outside registry/generated declarations |

- **Old IsEnabled API call sites**: 161 files
- Migration target: OpenFeature APIs in `pkg/services/featuremgmt/`

## Recommended Actions

1. **[Priority 1] Modernize datasource plugin frontend debt** in `public/app/plugins/datasource/` (class components, explicit `any`, and TODO density). Use the `migrate-class-components` skill for class/connect migrations.
2. **[Priority 2] Reduce ngalert backend debt** in `pkg/services/ngalert/` by addressing TODO/nolint hotspots and breaking up oversized modules with high churn.
3. **[Priority 3] Finish dashboard React modernization** in `public/app/features/dashboard/` (class components + connect + type-safety hotspots).
4. **[Priority 4] Split oversized backend files** (`setting.go`, `dashboard_service.go`, `storage_backend.go`, `registry.go`) into focused submodules.
5. **[Priority 5] Remove old feature-toggle APIs** by migrating `IsEnabled`/`IsEnabledGlobally` call sites to OpenFeature and retiring deprecated toggles with no runtime usage.
6. **[Priority 6] Reduce explicit `any` in top offenders** (starting with DashboardModel, time_series2, DashboardMigrator, opentsdb/influxdb datasource paths).

## Change Log

### 2026-05-10 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | 0 |
| connect() HOC | 41 | 41 | 0 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory | 16 | 16 | 0 |
| Explicit `any` occurrences | 393 | 397 | +4 |
| Explicit `any` files | 137 | 140 | +3 |
| @deprecated APIs | 51 | 46 | -5 |
| Frontend TODO/FIXME/HACK | 618 | 602 | -16 |
| Backend TODO/FIXME/HACK | 894 | 894 | 0 |
| nolint directives | 1275 | 1274 | -1 |
| Oversized Go files (>800 loc) | 67 | 78 | +11 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 161 | -1 |

**Resolved since last scan:**
- `@deprecated` API footprint dropped by 5 files.
- Frontend TODO/FIXME/HACK/XXX comments dropped by 16 occurrences.
- 1 file migrated off old `IsEnabled` API usage.
- 1 `nolint` occurrence removed.

**New since last scan:**
- 4 new explicit `any` occurrences across 3 additional files.
- 11 additional Go files now exceed 800 lines under the current exclusion rules.

### 2026-04-14 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | 0 |
| connect() HOC | 41 | 41 | 0 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory | 16 | 16 | 0 |
| Explicit `any` | ~371 | ~393 | +22 |
| `any` files | ~128 | ~137 | +9 |
| @deprecated APIs | ~58 | ~51 | -7 |
| Frontend TODO/FIXME/HACK | ~515 | ~618 | +103 |
| Backend TODO/FIXME/HACK | ~913 | ~894 | -19 |
| nolint directives | ~1,275 | ~1,275 | 0 |
| Oversized Go files (>800 loc) | 20 | 67 | +47 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | ~160 | ~162 | +2 |

**Resolved since last scan:**
- 7 files with `@deprecated` APIs were cleaned up.
- 19 backend TODO/FIXME/HACK comments were resolved.

**New since last scan:**
- 22 new explicit `any` type annotations added across 9 new files.
- 103 new frontend TODO/FIXME/HACK comments added.
- 47 additional Go files now exceed 800 lines (note: previous scan may have used different exclusion criteria).
- 2 new files using old IsEnabled API.

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
