---
name: tech-debt-audit
description: >-
  Scan the Grafana codebase for tech debt based on project code conventions,
  then write or update a structured report. Use when the user asks to find tech
  debt, audit code quality, check convention compliance, identify legacy
  patterns, or generate a tech debt report.
---

# Tech Debt Audit

Scans the codebase for violations of Grafana's established code conventions,
quantifies them, and writes (or updates) a structured Markdown report.

## Inputs

Before starting, determine:

1. **Scope** — which area to audit. Options:
   - `all` (default) — full frontend + backend scan
   - `frontend` — only `public/app/`
   - `backend` — only `pkg/`
   - A specific directory path (e.g. `public/app/features/alerting/`)
2. **Report path** — where to write the report. Default: `tech-debt-report.md`
   in the workspace root.

If the user doesn't specify, use `all` scope and the default report path.

## Convention Checks

Run the checks below that match the audit scope. Each check uses Grep or Shell
to count violations and collect sample file paths (up to 5 examples per check).

Record **count** and **example files** for every check.

### Frontend checks (`public/app/`)

| ID | Convention | What to search | Why it's debt |
|---|---|---|---|
| FE-01 | Function components over classes | `rg 'extends (Component\|PureComponent)' public/app/ -g '*.{ts,tsx}' --files-with-matches` | Class components are legacy; hooks are the standard |
| FE-02 | No `connect()` HOC | `rg 'connect\(' public/app/ -g '*.{ts,tsx}' --files-with-matches` | Should use `useSelector`/`useDispatch` hooks |
| FE-03 | Named exports over defaults | `rg 'export default ' public/app/ -g '*.{ts,tsx}' --files-with-matches` | Project convention is named declaration exports |
| FE-04 | Emotion over SASS | `find public/app/ -name '*.scss' -o -name '*.sass'` | New/touched code should use Emotion `useStyles2` |
| FE-05 | `useStyles2` over `stylesFactory` | `rg 'stylesFactory' public/app/ -g '*.{ts,tsx}' --files-with-matches` | `stylesFactory` is the deprecated styling helper |
| FE-06 | Unsafe lifecycle methods | `rg 'componentWillReceiveProps\|componentWillMount\|componentWillUpdate' public/app/ -g '*.{ts,tsx}' --files-with-matches` | Removed from React strict mode; must migrate |
| FE-07 | RTL over Enzyme/shallow | `rg 'shallow\(|mount\(' public/app/ -g '*.{test,spec}.{ts,tsx}' --files-with-matches` | Tests should use `@testing-library/react` |
| FE-08 | Function declarations for components | `rg 'const \w+ = \(.*\).*=>' public/app/ -g '*.tsx' --files-with-matches` (heuristic — may overcount) | Convention prefers `function Foo()` over `const Foo = () =>` for components |

**Note on FE-03 and FE-08**: These are heuristic searches that may include
false positives (utilities, non-component arrow functions). Report the raw count
with a note that the number is approximate.

### Backend checks (`pkg/`)

| ID | Convention | What to search | Why it's debt |
|---|---|---|---|
| BE-01 | Thin API handlers | `rg 'func \(hs \*HTTPServer\)' pkg/api/ -g '*.go' -c` then check for handlers longer than ~50 lines | Business logic belongs in `pkg/services/`, not handlers |
| BE-02 | Interface compliance | Spot-check that services in `pkg/services/*/` define and implement interfaces in the same package | Wire DI depends on interface-based wiring |
| BE-03 | Missing tests | For each `pkg/services/*/`, check if a `*_test.go` file exists | All services should have test coverage |

**Note on BE-01**: Use judgment. Count files in `pkg/api/` with handler
functions exceeding ~50 lines as candidates for extraction.

### Cross-cutting checks

| ID | Convention | What to search | Why it's debt |
|---|---|---|---|
| CC-01 | TODO/FIXME/HACK comments | `rg 'TODO\|FIXME\|HACK\|XXX' --count` (scoped to audit area) | Indicates known shortcuts or unfinished work |
| CC-02 | Large files | `find <scope> -name '*.ts' -o -name '*.tsx' -o -name '*.go' \| xargs wc -l \| sort -rn \| head -20` | Files over ~500 lines (frontend) or ~800 lines (backend) are candidates for splitting |

## Workflow

### Step 1: Check for existing report

Read the report file at the target path. If it exists, parse the previous
counts so you can show deltas (improved / regressed / unchanged) in the updated
report.

### Step 2: Run convention checks

Execute all checks for the chosen scope. For each check, record:
- **Count**: number of files or occurrences
- **Delta**: change from previous report (if one existed). Use `+N` / `-N` / `unchanged`.
- **Examples**: up to 5 file paths

Run independent checks in parallel where possible for speed.

### Step 3: Prioritize findings

Assign each check a severity:

| Severity | Criteria |
|---|---|
| **High** | Deprecated APIs, unsafe patterns, security-adjacent (FE-06, FE-07, BE-01 for very large handlers) |
| **Medium** | Legacy patterns with modern replacements available (FE-01, FE-02, FE-04, FE-05) |
| **Low** | Style preferences, heuristic-only findings (FE-03, FE-08, CC-01, CC-02) |

### Step 4: Write the report

Use the template in [report-template.md](report-template.md) to write or
overwrite the report file. Include:

- Audit metadata (date, scope, commit SHA)
- Summary table with all check IDs, counts, deltas, and severity
- Per-check detail sections with example files
- A "Recommended actions" section listing the top 3-5 highest-impact items
  to address, with references to existing skills or commands where applicable
  (e.g., link to `migrate-class-components` skill for FE-01/FE-02)

When updating an existing report, preserve any manually added notes in a
`## Manual Notes` section if one exists.

### Step 5: Report to user

After writing the file, print a concise summary in chat:

```
## Tech Debt Audit — <scope>

**Report written to:** `<path>`
**Commit:** `<short SHA>`

### Top findings
| Check | Count | Delta | Severity |
|---|---|---|---|
| <top 5 by severity then count> |

### Recommended next steps
1. <highest impact action>
2. ...
```

## Edge cases

- **Very large scope**: If `all` scope produces overwhelming output, cap
  example lists at 5 files and note that additional instances exist.
- **No violations found for a check**: Report count as 0 and severity as n/a.
  This is a positive signal worth noting.
- **Heuristic false positives**: For FE-03 and FE-08, note that counts are
  approximate and recommend manual review of the examples.
- **Report path is inside `.gitignore`**: Warn the user that the report won't
  be tracked in version control.
