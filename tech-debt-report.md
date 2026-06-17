# Tech Debt Report — all — 2026-06-17

## Hotspots (high debt × high churn)
| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|-------------------|----------------|
| 1 | `pkg/registry/` | 328 | 445 | 2886.7 |
| 2 | `pkg/tests/` | 322 | 425 | 2812.6 |
| 3 | `public/app/plugins/datasource/` | 284 | 120 | 1965.0 |
| 4 | `pkg/storage/` | 241 | 283 | 1964.1 |
| 5 | `pkg/services/ngalert/` | 213 | 134 | 1507.4 |
| 6 | `public/app/features/dashboard/` | 151 | 107 | 1020.0 |
| 7 | `public/app/features/alerting/` | 132 | 192 | 1002.2 |
| 8 | `public/app/plugins/panel/` | 119 | 133 | 840.9 |
| 9 | `pkg/api/` | 113 | 100 | 752.4 |
| 10 | `pkg/services/libraryelements/` | 122 | 11 | 437.4 |

## Frontend Modernization
- **Class components**: 60 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 files
- **stylesFactory**: 16 files

## Type Safety
- **Explicit `any`**: 397 occurrences across 140 files
- **@deprecated APIs**: 46 files

## Comment Debt
- **Frontend TODO/FIXME/HACK**: 602 occurrences
- **Backend TODO/FIXME/HACK**: 894 occurrences

## Go Quality
- **nolint directives**: 1274 occurrences
- **Oversized files (>800 loc)**: 78 files
- **Deprecated Go APIs**: 65 files

## Feature Toggles
- **Deprecated toggles with active call sites**:
  - `localeFormatPreference` — 1 callsite file(s)
  - `prometheusAzureOverrideAudience` — 4 callsite file(s)
  - `prometheusTypeMigration` — 1 callsite file(s)
- **Old IsEnabled API call sites**: 161 files

## Recommended Actions
1. Migrate public/app/plugins/datasource/ class components to function components — public/app/plugins/datasource/ has 11 class components and 0 connect() usages. Use migrate-class-components skill.
2. Modernize public/app/features/explore/ legacy React lifecycles and styles — public/app/features/explore/ has 1 unsafe lifecycle file(s) and 7 stylesFactory usage file(s).
3. Split oversized Go files (setting.go, dashboard_service.go, storage_backend.go) — 78 non-test Go files exceed 800 LOC. Top actionable files: setting.go, dashboard_service.go, storage_backend.go.
4. Migrate IsEnabled API call sites to OpenFeature — 161 files still use IsEnabled/IsEnabledGlobally. Deprecated toggles in registry: 3.
5. Reduce explicit any usage in top frontend files — 397 explicit any occurrences across 140 files. Top files: DashboardModel.ts, time_series2.ts, DashboardMigrator.ts, datasource.ts, PanelModel.ts.

## Change Log

### 2026-06-17 (current scan)

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
| Oversized Go files (>800 loc) | 78 | 78 | 0 |
| Deprecated Go APIs | 65 | 65 | 0 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 161 | -1 |

**Resolved since last scan:**
- Class components decreased by 1
- @deprecated APIs decreased by 5
- Frontend TODO/FIXME/HACK decreased by 16
- nolint directives decreased by 1
- Old IsEnabled API files decreased by 1

**New since last scan:**
- Explicit any increased by 4
- any files increased by 3

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
