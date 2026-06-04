# Tech Debt Report — all — 2026-06-04

## Hotspots (high debt × high churn)

Priority score = debt signals × log2(commits + 1), lookback: 6 months ago

| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|-------------------|----------------|
| 1 | `pkg/registry/` | 328 | 495 | 2936.98 |
| 2 | `pkg/tests/` | 322 | 451 | 2840.1 |
| 3 | `public/app/plugins/datasource/` | 285 | 140 | 2034.77 |
| 4 | `pkg/storage/` | 241 | 306 | 1991.16 |
| 5 | `pkg/services/ngalert/` | 213 | 148 | 1537.68 |
| 6 | `public/app/features/dashboard/` | 151 | 123 | 1050.08 |
| 7 | `public/app/features/alerting/` | 132 | 205 | 1014.62 |
| 8 | `pkg/services/libraryelements/` | 122 | 12 | 451.45 |
| 9 | `public/app/plugins/panel/` | 115 | 140 | 821.05 |
| 10 | `pkg/api/` | 113 | 112 | 770.68 |

## Frontend Modernization
- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 file
- **stylesFactory**: 16 files

## Type Safety
- **Explicit `any`**: 393 occurrences across 137 files
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
  - `prometheusAzureOverrideAudience` — 4 non-registry call-site files
  - `localeFormatPreference` — 1 non-registry call-site file
  - `prometheusTypeMigration` — 1 non-registry call-site file
- **Old IsEnabled API call sites**: 162 files

## Recommended Actions
1. **Migrate dashboard class components and connect() usage to hooks** — dashboard modernization debt remains high (class=10, connect=9). Scope: ~15 files. Use migrate-class-components skill to convert class + connect patterns to hooks.
2. **Modernize Explore TraceView legacy lifecycle and styling paths** — TraceView holds the only unsafe lifecycle usage and concentrated stylesFactory call sites. Scope: ~10 files. Replace unsafe lifecycle methods with effects and migrate stylesFactory to useStyles2.
3. **Split oversized Go files in high-churn services** — 78 non-test Go files exceed 800 LOC with critical files in settings/dashboard paths. Scope: ~78 files. Extract cohesive submodules and narrow file responsibilities without behavior changes.
4. **Migrate IsEnabled API usage to OpenFeature interfaces** — Legacy IsEnabled APIs remain in 162 files. Scope: ~162 files. Follow pkg/services/featuremgmt guidance and replace IsEnabled*/IsEnabledGlobally call sites.
5. **Reduce explicit any usage in top hotspot files** — Explicit any appears 393 times across 137 files. Scope: ~137 files. Prioritize top offenders and replace any with domain types and type guards.
6. **Clean up deprecated feature toggles** — 3 toggles are marked deprecated and still have call sites. Scope: ~3 files. Remove deprecated toggles and migrate remaining references to current feature management APIs.

## Change Log

### 2026-06-04 (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 61 | +0 |
| connect() HOC | 41 | 41 | +0 |
| Unsafe lifecycles | 1 | 1 | +0 |
| stylesFactory | 16 | 16 | +0 |
| Explicit any | 393 | 393 | +0 |
| any files | 137 | 137 | +0 |
| @deprecated APIs | 51 | 46 | -5 |
| Frontend TODO/FIXME/HACK | 618 | 602 | -16 |
| Backend TODO/FIXME/HACK | 894 | 894 | +0 |
| nolint directives | 1275 | 1274 | -1 |
| Oversized Go files (>800 loc) | 67 | 78 | +11 |
| Deprecated feature toggles | 3 | 3 | +0 |
| Old IsEnabled API files | 162 | 162 | +0 |

**Resolved since last scan:**
- 5 fewer @deprecated apis
- 16 fewer frontend todo/fixme/hack
- 1 fewer nolint directives

**New since last scan:**
- 11 additional oversized go files (>800 loc)

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
