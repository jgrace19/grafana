# Tech Debt Report — all — 2026-05-08

## Hotspots (high debt × high churn)

Priority score = debt signals × log2(commits + 1)

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|--------------------|----------------|
| 1 | `pkg/registry/` | 327 | 559 | 2985.28 |
| 2 | `pkg/tests/` | 322 | 486 | 2874.74 |
| 3 | `public/app/plugins/datasource/` | 285 | 167 | 2106.81 |
| 4 | `pkg/storage/` | 240 | 340 | 2019.27 |
| 5 | `pkg/services/ngalert/` | 211 | 175 | 1573.94 |
| 6 | `public/app/features/dashboard/` | 151 | 153 | 1097.28 |
| 7 | `public/app/features/alerting/` | 132 | 242 | 1046.08 |
| 8 | `pkg/services/libraryelements/` | 122 | 13 | 464.5 |
| 9 | `public/app/plugins/panel/` | 115 | 158 | 840.98 |
| 10 | `pkg/api/` | 113 | 133 | 798.47 |

## Frontend Modernization

- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 file
- **stylesFactory**: 16 files

Top areas for class components:
- `public/app/plugins/datasource/` — 12
- `public/app/plugins/panel/` — 11
- `public/app/features/dashboard/` — 10
- `public/app/features/explore/` — 8
- `public/app/core/` — 4

Top areas for connect() HOC:
- `public/app/features/dashboard/` — 9
- `public/app/features/explore/` — 8
- `public/app/features/admin/` — 5
- `public/app/features/variables/` — 4
- `public/app/features/auth-config/` — 3

Top areas for stylesFactory:
- `public/app/features/explore/` — 7
- `public/app/plugins/panel/` — 4
- `public/app/features/dashboard/` — 2
- `public/app/features/inspector/` — 1
- `public/app/features/query/` — 1

## Type Safety

- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 46 files

Top areas by `any` occurrence volume:
- `public/app/features/dashboard/` — 104
- `public/app/plugins/datasource/` — 95
- `public/app/core/` — 39
- `public/app/features/alerting/` — 32
- `public/app/features/variables/` — 30

Top files with explicit `any`:
- `public/app/features/dashboard/state/DashboardModel.ts` — 23
- `public/app/core/time_series2.ts` — 19
- `public/app/features/dashboard/state/DashboardMigrator.ts` — 16
- `public/app/plugins/datasource/opentsdb/datasource.ts` — 16
- `public/app/features/dashboard/state/PanelModel.ts` — 13
- `public/app/plugins/datasource/influxdb/query_part.ts` — 12
- `public/app/plugins/datasource/influxdb/datasource.ts` — 11
- `public/app/features/dashboard/state/DashboardMigrator.test.ts` — 10
- `public/app/features/alerting/state/query_part.ts` — 10
- `public/app/features/explore/TraceView/components/model/link-patterns.tsx` — 9

## Comment Debt

- **Frontend TODO/FIXME/HACK/XXX**: 602 occurrences
- **Backend TODO/FIXME/HACK/XXX**: 894 occurrences

## Go Quality

- **nolint directives**: 1274 occurrences
- **Oversized files (>800 loc)**: 66 files
- **Deprecated Go APIs**: 65 files

Top oversized non-generated files:
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
| `pkg/storage/unified/resource/server.go` | 1941 |
| `pkg/services/ngalert/store/alert_rule.go` | 1873 |

## Feature Toggles

- **Deprecated toggles with active call sites**:
- `localeFormatPreference` — no active non-test call sites detected (registry/generated references only)
- `prometheusAzureOverrideAudience` — 2 active non-test call sites (`pkg/tsdb/prometheus/azureauth/azure.go`, `pkg/tsdb/prometheus/prometheus.go`)
- `prometheusTypeMigration` — no active non-test call sites detected (registry/generated references only)
- **Old IsEnabled API call sites**: 162 files

## Recommended Actions

1. **[P1] Reduce debt in `pkg/registry/` and `pkg/storage/` hotspots** (high TODO/nolint density + high churn): prioritize `pkg/registry/apis/provisioning/` and `pkg/storage/unified/` for TODO cleanup and lint suppression removal.
2. **[P1] Modernize datasource plugins** (`public/app/plugins/datasource/`): 12 class components, high TODO/comment density, and high `any` volume; convert class components incrementally using the `migrate-class-components` skill where applicable.
3. **[P1] Dashboard modernization batch** (`public/app/features/dashboard/`): class components + connect() + high `any` concentration in `DashboardModel`/`PanelModel`.
4. **[P2] Split oversized Go files in core services**: start with `pkg/setting/setting.go`, `pkg/services/dashboards/service/dashboard_service.go`, and `pkg/storage/unified/resource/storage_backend.go`.
5. **[P2] Continue OpenFeature migration**: reduce the 162 files still using `IsEnabled`/`IsEnabledGlobally`, starting with high-churn `pkg/registry/`, `pkg/services/authn/`, and `pkg/services/ngalert/`.
6. **[P3] Clean up deprecated feature toggles** in `pkg/services/featuremgmt/` docs and call sites; align with the OpenFeature migration guidance in `pkg/services/featuremgmt/`.

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

### 2026-05-08 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | 0 |
| connect() HOC | 41 | 41 | 0 |
| Unsafe lifecycles | 1 | 1 | 0 |
| stylesFactory | 16 | 16 | 0 |
| Explicit `any` occurrences | 393 | 393 | 0 |
| `any` files | 137 | 137 | 0 |
| @deprecated APIs | 51 | 46 | -5 |
| Frontend TODO/FIXME/HACK | 618 | 602 | -16 |
| Backend TODO/FIXME/HACK | 894 | 894 | 0 |
| nolint directives | 1275 | 1274 | -1 |
| Oversized Go files (>800 loc) | 67 | 66 | -1 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 162 | 0 |

**Resolved since last scan:**
- 5 frontend files no longer match `@deprecated` markers.
- 16 frontend TODO/FIXME/HACK/XXX comments removed.
- 1 `nolint` directives removed.
- 1 oversized non-generated Go file(s) dropped below threshold or were refactored.

**New since last scan:**
- None.

