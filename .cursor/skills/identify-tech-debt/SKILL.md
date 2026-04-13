---
name: identify-tech-debt
description: >-
  Scan the Grafana monorepo for tech debt: legacy React patterns, type safety
  gaps, TODO/FIXME density, Go quality signals, stale feature toggles, and
  oversized files. Updates tech-debt-report.md with a diff against the previous
  scan, then syncs Linear tickets under the grafana project with the tech-debt
  label — closing resolved issues and creating new ones. Use when the user asks
  to find tech debt, audit code quality, identify modernization candidates, or
  generate a debt report.
---

# Identify Tech Debt

Scans the Grafana monorepo for concrete, machine-detectable tech debt, updates
the persistent report at `tech-debt-report.md`, and syncs findings to Linear
tickets under the **grafana** project with the **tech-debt** label.

## Inputs

Collect before starting (use defaults if the user doesn't specify):

1. **Scope** — `all` | `frontend` | `backend` | a specific directory path (default: `all`)
2. **Output** — `summary` (counts + hotspots) | `detailed` (file-level lists) (default: `summary`)
3. **Lookback** — git churn window (default: `6 months`)

## Noise Exclusions

Always exclude these from every search:

- `**/dist/**`, `**/node_modules/**`, `**/.yarn/**`
- `*.gen.ts`, `*.gen.go`, `*.pb.go` (generated code)
- `**/mocks/**`, `**/testdata/**`, `**/vendor/**`

Use `-g '!<pattern>'` flags with `rg` to enforce.

## Step 1: Read Previous Report

Check if `tech-debt-report.md` exists at the repo root. If it does, read it and
extract the key metrics for later comparison:

- Class components count
- connect() HOC count
- Unsafe lifecycle count
- stylesFactory count
- Explicit `any` occurrences and file count
- @deprecated API file count
- Frontend TODO/FIXME/HACK occurrence count
- Backend TODO/FIXME/HACK occurrence count
- nolint directive count
- Oversized Go file count
- Deprecated feature toggle count
- Old IsEnabled API file count
- The hotspot ranking table

Store these as the **baseline** for delta computation in Step 5.

If the file does not exist, there is no baseline — all findings are "new."

## Step 2: Run Scans

Execute the following searches. Run independent commands in parallel where
possible.

### 2a. Frontend — React Modernization

```bash
# Class components
rg 'extends (Component|PureComponent)' public/app/ -g '*.{ts,tsx}' \
  -g '!*.gen.ts' -g '!**/dist/**' --files-with-matches

# connect() HOC (Redux)
rg 'connect\(mapState|connect\(null' public/app/ -g '*.{ts,tsx}' \
  -g '!*.gen.ts' -g '!**/dist/**' --files-with-matches

# Unsafe / deprecated lifecycle methods
rg 'UNSAFE_component|componentWillReceiveProps|componentWillMount|componentWillUpdate' \
  public/app/ -g '*.{ts,tsx}' -g '!**/dist/**' --files-with-matches

# Legacy stylesFactory (should be useStyles2)
rg 'stylesFactory' public/app/ -g '*.{ts,tsx}' -g '!**/dist/**' --files-with-matches
```

### 2b. Frontend — Type Safety

```bash
# Explicit `any` type annotations (exclude generated)
rg ': any[^a-zA-Z]' public/app/ -g '*.{ts,tsx}' -g '!*.gen.ts' -g '!**/dist/**' \
  --count-matches

# @deprecated API definitions still present
rg '@deprecated' public/app/ -g '*.{ts,tsx}' -g '!*.gen.ts' -g '!**/dist/**' \
  --files-with-matches
```

### 2c. Frontend — Comment Debt

```bash
rg 'TODO|FIXME|HACK|XXX' public/app/ -g '*.{ts,tsx}' -g '!*.gen.ts' \
  -g '!**/dist/**' --count-matches
```

### 2d. Backend — Go Quality

```bash
# TODO/FIXME/HACK
rg 'TODO|FIXME|HACK|XXX' pkg/ -g '*.go' -g '!*.gen.go' -g '!*.pb.go' \
  --count-matches

# nolint suppressions (by linter name when possible)
rg 'nolint' pkg/ -g '*.go' -g '!*.gen.go' -g '!*.pb.go' --count-matches

# Deprecated markers
rg 'Deprecated:' pkg/ -g '*.go' -g '!*.gen.go' -g '!*.pb.go' --files-with-matches

# Large non-generated, non-test Go files (>800 lines)
find pkg/ -name '*.go' ! -name '*_test.go' ! -name '*.gen.go' ! -name '*.pb.go' \
  -exec awk 'END { if (NR > 800) print FILENAME, NR }' {} \; | sort -t' ' -k2 -rn
```

### 2e. Feature Toggle Staleness

```bash
# Toggles marked deprecated in the registry
rg 'FeatureStageDeprecated' pkg/services/featuremgmt/registry.go

# Old IsEnabled/IsEnabledGlobally API (should migrate to OpenFeature)
rg 'IsEnabled\b|IsEnabledGlobally' pkg/ -g '*.go' -g '!*.gen.go' \
  --files-with-matches
```

## Step 3: Aggregate by Package

Group file-level results into their parent feature or service directory:

- **Frontend**: bucket by `public/app/features/<name>/`, `public/app/core/`,
  `public/app/plugins/<name>/`
- **Backend**: bucket by `pkg/services/<name>/`, `pkg/api/`, `pkg/tsdb/<name>/`,
  `pkg/plugins/`

For each bucket count:
- Number of debt signals (sum across categories)
- Number of distinct files with at least one signal

Sort buckets by total signal count descending.

## Step 4: Cross-Reference with Git Churn

For the **top 10** debt buckets from Step 3, measure recent activity:

```bash
git log --since="<lookback>" --format='%H' -- <directory> | wc -l
```

Compute a **priority score**: `debt_signals × log2(commits + 1)`. High debt +
high churn = highest priority. High debt + zero churn = lower priority (dormant
code).

## Step 5: Update Report

### If `tech-debt-report.md` exists

1. Compare each metric from Step 2 against the baseline from Step 1.
2. Compute deltas: `new_value - baseline_value` for each metric.
3. Identify:
   - **Resolved items** — files that appeared in the previous scan but no longer
     match (e.g., a class component was converted). Track these at the file level
     for ticket-closing in Step 6.
   - **New items** — files that now match but did not appear before.
4. Rewrite the full report body with current numbers. Add a
   `## Change Log` section at the bottom:

```markdown
## Change Log

### <date> (current scan)

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Class components | 61 | 58 | -3 |
| connect() HOC | 41 | 41 | 0 |
| ... | ... | ... | ... |

**Resolved since last scan:**
- Converted `DashboardPage.tsx` from class to function component
- ...

**New since last scan:**
- New `any` usage in `features/foo/bar.ts`
- ...
```

5. Preserve prior Change Log entries — append the new entry, do not delete old
   ones. This creates a running history.

### If `tech-debt-report.md` does not exist

Write the full report as described in the report template below. No Change Log
section on the first run.

### Report Template

```
# Tech Debt Report — <scope> — <date>

## Hotspots (high debt × high churn)
| Rank | Area | Signals | Commits (<lookback>) | Priority Score |
|------|------|---------|----------------------|----------------|

## Frontend Modernization
- **Class components**: N files
- **connect() HOC**: N files
- **Unsafe lifecycles**: N files
- **stylesFactory**: N files

## Type Safety
- **Explicit `any`**: N occurrences across M files
- **@deprecated APIs**: N files

## Comment Debt
- **Frontend TODO/FIXME/HACK**: N occurrences
- **Backend TODO/FIXME/HACK**: N occurrences

## Go Quality
- **nolint directives**: N occurrences
- **Oversized files (>800 loc)**: N files
- **Deprecated Go APIs**: N files

## Feature Toggles
- **Deprecated toggles with active call sites**: (list)
- **Old IsEnabled API call sites**: N files

## Recommended Actions
1. ...

## Change Log
(appended each scan)
```

### Linking Remediation Skills

If a remediation skill exists, reference it:
- Class components / connect() → `migrate-class-components` skill
- Feature toggle migration → link to `pkg/services/featuremgmt/` docs

## Step 6: Sync Linear Tickets

This step syncs the report findings with Linear. Each "Recommended Action" from
the report maps to one Linear issue.

### 6a. Ensure the `tech-debt` label exists

```
CallMcpTool(server="plugin-linear-linear", toolName="list_issue_labels", arguments={
  "name": "tech-debt"
})
```

If no label is returned, create it:

```
CallMcpTool(server="plugin-linear-linear", toolName="create_issue_label", arguments={
  "name": "tech-debt",
  "description": "Automated tech debt findings from codebase scans",
  "color": "#e57a00"
})
```

### 6b. Fetch existing tech-debt tickets

```
CallMcpTool(server="plugin-linear-linear", toolName="list_issues", arguments={
  "project": "grafana",
  "label": "tech-debt",
  "limit": 250
})
```

Build a map of existing tickets keyed by their title. The agent uses a
consistent title convention (see 6d) so matching is by exact title.

### 6c. Close resolved issues

For each existing tech-debt ticket whose corresponding debt signal is **no
longer present** in the current scan (i.e., it appeared in "Resolved since last
scan" from Step 5):

1. **Add a closing comment** explaining the resolution:

```
CallMcpTool(server="plugin-linear-linear", toolName="save_comment", arguments={
  "issueId": "<ISSUE-ID>",
  "body": "This tech debt item has been resolved as of the <date> scan.\n\n<brief explanation of what changed — e.g., 'DashboardPage.tsx was converted from class to function component'>"
})
```

2. **Transition the issue to Done**:

```
CallMcpTool(server="plugin-linear-linear", toolName="save_issue", arguments={
  "id": "<ISSUE-ID>",
  "state": "Done"
})
```

### 6d. Create new tickets

For each **Recommended Action** in the report that does **not** already have a
matching Linear ticket, create one.

**Title convention**: `[Tech Debt] <short action title>`

Examples:
- `[Tech Debt] Migrate dashboard/ class components to function components`
- `[Tech Debt] Modernize Explore TraceView (stylesFactory + unsafe lifecycle)`
- `[Tech Debt] Split oversized Go files (setting.go, dashboard_service.go)`
- `[Tech Debt] Clean up deprecated feature toggles`
- `[Tech Debt] Reduce explicit any in top 10 files`
- `[Tech Debt] Migrate IsEnabled API to OpenFeature`

```
CallMcpTool(server="plugin-linear-linear", toolName="save_issue", arguments={
  "title": "[Tech Debt] <action title>",
  "team": "<team name>",
  "project": "grafana",
  "labels": ["tech-debt"],
  "priority": <2 for Priority 1-2 actions, 3 for Priority 3-4, 4 for Priority 5-6>,
  "description": "<Markdown body with:\n- What: specific files/areas affected\n- Why: debt signal counts, churn data, priority score\n- How: recommended remediation approach or link to skill\n- Scope: estimated number of files>"
})
```

### 6e. Update existing open tickets

For existing tech-debt tickets that are still open and the debt **still exists**
but the numbers have changed, add a comment with the updated metrics:

```
CallMcpTool(server="plugin-linear-linear", toolName="save_comment", arguments={
  "issueId": "<ISSUE-ID>",
  "body": "Updated metrics from <date> scan:\n\n| Metric | Previous | Current | Delta |\n|--------|----------|---------|-------|\n| ... | ... | ... | ... |"
})
```

Only post update comments if at least one metric in the ticket's scope changed.
Do not spam tickets with identical numbers.

### 6f. Report ticket actions to user

After syncing, summarize what was done:

```
## Linear Sync Summary

- **Created**: N new tickets
- **Closed**: N resolved tickets
- **Updated**: N tickets with new metrics
- **Unchanged**: N tickets (no action needed)

### New tickets
- [TEAM-123] [Tech Debt] Migrate dashboard/ class components
- ...

### Closed tickets
- [TEAM-456] [Tech Debt] Fix unsafe lifecycle in TimelineViewingLayer (resolved)
- ...
```

## Edge Cases

- **Monorepo plugins**: Some plugins under `public/app/plugins/` are Yarn
  workspaces with their own build. Scan them but note they may have different
  standards.
- **Generated code**: Even after exclusion filters, verify suspect files aren't
  generated by checking for codegen headers (`// Code generated`, `DO NOT EDIT`).
- **False positives on `connect(`**: WebSocket/gRPC `connect` calls match the
  Redux pattern. The tighter pattern `connect(mapState` or
  `connect(null` reduces noise. When in doubt, read the import line.
- **Large test files**: Exclude `_test.go` from the oversized-file scan —
  large test files are normal.
- **Linear project not found**: If `list_projects` does not return a "grafana"
  project, ask the user for the correct project name before creating tickets.
- **Label already exists**: `list_issue_labels` may return the label under a
  different casing. Match case-insensitively before creating a new one.
- **Ticket title drift**: If someone renames a ticket manually, the title match
  will fail. The agent should also search by `query` keyword as a fallback
  before creating a duplicate.
- **First run (no baseline)**: All recommended actions become new tickets. No
  tickets are closed. No Change Log section in the report.
