# Tech Debt Report

> **Date:** YYYY-MM-DD
> **Scope:** `<scope>`
> **Commit:** `<short SHA>`
> **Previous report:** <date of last report, or "None">

## Summary

| ID | Check | Count | Delta | Severity |
|---|---|---|---|---|
| FE-01 | Class components | — | — | Medium |
| FE-02 | `connect()` HOC | — | — | Medium |
| FE-03 | Default exports (approx) | — | — | Low |
| FE-04 | SASS files | — | — | Medium |
| FE-05 | `stylesFactory` usage | — | — | Medium |
| FE-06 | Unsafe lifecycle methods | — | — | High |
| FE-07 | Enzyme/shallow tests | — | — | High |
| FE-08 | Arrow component defs (approx) | — | — | Low |
| BE-01 | Large API handlers | — | — | High |
| BE-02 | Missing service interfaces | — | — | Medium |
| BE-03 | Services without tests | — | — | Medium |
| CC-01 | TODO/FIXME/HACK comments | — | — | Low |
| CC-02 | Large files | — | — | Low |

## Detailed Findings

### FE-01: Class components

**Count:** —
**Delta:** —

Class components should be migrated to function components with hooks.
Error boundaries (`componentDidCatch`) are the only exception.

**Examples:**
- (file paths here)

**Action:** Use the `migrate-class-components` skill.

---

### FE-02: `connect()` HOC

**Count:** —
**Delta:** —

Replace `connect()` with `useSelector` and `useDispatch` hooks.

**Examples:**
- (file paths here)

**Action:** Use the `migrate-class-components` skill (Step 2).

---

### FE-03: Default exports

**Count:** — (approximate)
**Delta:** —

Project convention is named declaration exports. Count is approximate because
some default exports are intentional (e.g., lazy-loaded routes).

**Examples:**
- (file paths here)

---

### FE-04: SASS files

**Count:** —
**Delta:** —

New and modified frontend code should use Emotion `useStyles2`. Remaining SASS
files are migration candidates.

**Examples:**
- (file paths here)

---

### FE-05: `stylesFactory` usage

**Count:** —
**Delta:** —

`stylesFactory` is the deprecated styling helper. Replace with `useStyles2(getStyles)`.

**Examples:**
- (file paths here)

---

### FE-06: Unsafe lifecycle methods

**Count:** —
**Delta:** —

`componentWillReceiveProps`, `componentWillMount`, and `componentWillUpdate`
are removed in React strict mode and must be migrated.

**Examples:**
- (file paths here)

**Action:** Highest priority migration target. Convert to hooks or derived state.

---

### FE-07: Enzyme/shallow tests

**Count:** —
**Delta:** —

Tests using `shallow()` or `mount()` from Enzyme should migrate to
`@testing-library/react` with `render()`.

**Examples:**
- (file paths here)

---

### FE-08: Arrow component definitions

**Count:** — (approximate)
**Delta:** —

Convention prefers `function Foo()` declarations for React components. Count is
approximate — includes non-component arrow functions.

**Examples:**
- (file paths here)

---

### BE-01: Large API handlers

**Count:** —
**Delta:** —

API handlers in `pkg/api/` exceeding ~50 lines likely contain business logic
that should be extracted to `pkg/services/`.

**Examples:**
- (file paths here)

---

### BE-02: Missing service interfaces

**Count:** —
**Delta:** —

Services in `pkg/services/` should define and implement interfaces in the same
package for Wire DI compatibility.

**Examples:**
- (directory paths here)

---

### BE-03: Services without tests

**Count:** —
**Delta:** —

Service packages under `pkg/services/` that lack `*_test.go` files.

**Examples:**
- (directory paths here)

---

### CC-01: TODO/FIXME/HACK comments

**Count:** —
**Delta:** —

Known shortcuts or unfinished work flagged by authors.

**Breakdown:**
- TODO: —
- FIXME: —
- HACK: —
- XXX: —

---

### CC-02: Large files

**Count:** —
**Delta:** —

Frontend files over ~500 lines and backend files over ~800 lines are candidates
for splitting.

**Top offenders:**
- (file paths with line counts here)

---

## Recommended Actions

1. **(action with highest impact)**
2. …
3. …

## Manual Notes

<!-- Add any manual observations or context below this line. This section is
preserved across report updates. -->
