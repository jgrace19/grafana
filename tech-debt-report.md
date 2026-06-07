# Tech Debt Report — all — 2026-06-07

## Hotspots (high debt × high churn)
| Rank | Area | Signals | Commits (6 months) | Priority Score |
|------|------|---------|--------------------|----------------|
| 1 | `pkg/registry/` | 327 | 485 | 2918.41 |
| 2 | `pkg/tests/` | 322 | 448 | 2837.0 |
| 3 | `public/app/plugins/datasource/` | 285 | 128 | 1998.2 |
| 4 | `pkg/storage/` | 240 | 301 | 1977.22 |
| 5 | `pkg/services/ngalert/` | 211 | 146 | 1519.13 |
| 6 | `public/app/features/dashboard/` | 151 | 120 | 1044.75 |
| 7 | `public/app/features/alerting/` | 132 | 202 | 1011.82 |
| 8 | `public/app/plugins/panel/` | 115 | 138 | 818.68 |
| 9 | `pkg/api/` | 113 | 109 | 766.29 |
| 10 | `pkg/services/libraryelements/` | 122 | 12 | 451.45 |

## Frontend Modernization
- **Class components**: 61 files
- **connect() HOC**: 41 files
- **Unsafe lifecycles**: 1 files
- **stylesFactory**: 16 files

## Type Safety
- **Explicit `any`**: 393 occurrences across 137 files
- **@deprecated APIs**: 46 files

## Comment Debt
- **Frontend TODO/FIXME/HACK**: 602 occurrences
- **Backend TODO/FIXME/HACK**: 894 occurrences

## Go Quality
- **nolint directives**: 1274 occurrences
- **Oversized files (>800 loc)**: 68 files
- **Deprecated Go APIs**: 65 files

## Feature Toggles
- **Deprecated toggles with active call sites**:
  - `prometheusAzureOverrideAudience` — 4 active file(s)
  - `localeFormatPreference` — 1 active file(s)
  - `prometheusTypeMigration` — 1 active file(s)
- **Old IsEnabled API call sites**: 162 files

## Recommended Actions
1. **[Tech Debt] Migrate dashboard/explore class and connect components to hooks** — class=61, connect=41, highest hotspot buckets include dashboard/explore (28 files in scope). Use the migrate-class-components skill for class components and connect() migrations.
2. **[Tech Debt] Modernize Explore TraceView (stylesFactory + unsafe lifecycle)** — unsafe lifecycle files=1, stylesFactory files=16 with TraceView concentration (7 files in scope). Replace unsafe lifecycles with hooks and stylesFactory with useStyles2.
3. **[Tech Debt] Split oversized Go files in high-churn services** — oversized_go_files=68 (10 files in scope). Prioritize pkg/services and pkg/api files with >1200 LOC and high churn.
4. **[Tech Debt] Migrate IsEnabled API call sites to OpenFeature** — old IsEnabled files=162 (162 files in scope). Follow pkg/services/featuremgmt migration guidance and remove deprecated checks.
5. **[Tech Debt] Reduce explicit any in top frontend hotspots** — explicit any occurrences=393 across 137 files (137 files in scope). Target top files first with strict typings and narrower interfaces.
6. **[Tech Debt] Reduce TODO/FIXME/HACK and nolint in top churn buckets** — frontend comments=602, backend comments=894, nolint=1274 (1143 files in scope). Triage comment debt and remove stale suppressions in active packages first.

## Change Log

### 2026-06-07 (current scan)

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
| Oversized Go files (>800 loc) | 67 | 68 | +1 |
| Deprecated feature toggles | 3 | 3 | 0 |
| Old IsEnabled API files | 162 | 162 | 0 |

**Resolved since last scan:**
- 5 fewer @deprecated APIs signals
- 16 fewer Frontend TODO/FIXME/HACK signals
- 1 fewer nolint directives signals

**New since last scan:**
- 1 additional Oversized Go files (>800 loc) signals

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
