---
name: identify-tech-debt
description: >-
  Scans the Grafana monorepo for concrete, machine-detectable tech debt,
  prioritizes hotspots with git churn, syncs follow-up Linear issues, and
  publishes a Confluence report. Use when the user asks to find tech debt,
  identify tech debt hotspots, or generate a tech debt report.
---

# Identify Tech Debt

Scans the Grafana monorepo for concrete, machine-detectable tech debt, syncs
findings to Linear tickets under the **grafana** project with the **tech-debt**
label — closing resolved issues and creating new ones — and publishes or updates
the report on a Confluence page. After Confluence is updated, the agent **must**
print a concise summary of the report in the chat so the user sees results
without opening Confluence.

## Inputs

Collect before starting (use defaults if the user doesn't specify):

1. **Scope** — `all` | `frontend` | `backend` | a specific directory path (default: `all`)
2. **Output** — `summary` (counts + hotspots) | `detailed` (file-level lists) (default: `summary`)
3. **Lookback** — git churn window (default: `6 months`)
4. **Confluence space** — name or key of the Confluence space for the report page (ask on first run, then reuse the page ID from the existing report)

## Noise Exclusions

Always exclude these from every search:

- `**/dist/**`, `**/node_modules/**`, `**/.yarn/**`
- `*.gen.ts`, `*.gen.go`, `*.pb.go` (generated code)
- `**/mocks/**`, `**/testdata/**`, `**/vendor/**`

Use `-g '!<pattern>'` flags with `rg` to enforce.

## Step 1: Fetch Previous Report from Confluence

Search Confluence for an existing tech-debt report page to get baseline metrics:

```
CallMcpTool(server="plugin-atlassian-atlassian", toolName="searchConfluenceUsingCql", arguments={
  "cloudId": "<cloudId>",
  "cql": "title = 'Tech Debt Report — Grafana' AND type = page AND space = '<spaceKey>'"
})
```

If a page is found, fetch its content and extract the key metrics for comparison:

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

Store these as the **baseline** for delta computation in Step 4.

If no page exists, there is no baseline — all findings are "new."

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

## Step 5: Sync Linear Tickets

This step syncs the report findings with Linear. Each "Recommended Action" from
the report maps to one Linear issue.

### 5a. Ensure the `tech-debt` label exists

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

### 5b. Fetch existing tech-debt tickets

```
CallMcpTool(server="plugin-linear-linear", toolName="list_issues", arguments={
  "project": "grafana",
  "label": "tech-debt",
  "limit": 250
})
```

Build a map of existing tickets keyed by their title. The agent uses a
consistent title convention (see 5d) so matching is by exact title.

### 5c. Close resolved issues

For each existing tech-debt ticket whose corresponding debt signal is **no
longer present** in the current scan (i.e., it appeared in "Resolved since last
scan"):

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

### 5d. Create new tickets

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

### 5e. Update existing open tickets

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

### 5f. Report ticket actions to user

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

## Step 6: Publish Report to Confluence

After Linear tickets are synced, publish or update the Confluence page with the
full report content.

### 6a. Resolve the Confluence space

If the user provided a space name or key, use it directly. Otherwise, list
available spaces and ask:

```
CallMcpTool(server="plugin-atlassian-atlassian", toolName="getConfluenceSpaces", arguments={
  "cloudId": "<cloudId>"
})
```

Pick the space that matches the project (e.g., an "Engineering" or "Grafana"
space). If ambiguous, ask the user to confirm.

### 6b. Search for an existing report page

Search Confluence for an existing tech-debt report page so you can update it
in-place rather than creating duplicates:

```
CallMcpTool(server="plugin-atlassian-atlassian", toolName="searchConfluenceUsingCql", arguments={
  "cloudId": "<cloudId>",
  "cql": "title = 'Tech Debt Report — Grafana' AND type = page AND space = '<spaceKey>'"
})
```

If a page is found, record its `pageId` for the update step.

### 6c. Create or update the page

**If no existing page was found** — create a new one:

```
CallMcpTool(server="plugin-atlassian-atlassian", toolName="createConfluencePage", arguments={
  "cloudId": "<cloudId>",
  "spaceId": "<spaceId>",
  "title": "Tech Debt Report — Grafana",
  "body": "<full report markdown>",
  "contentFormat": "markdown",
  "parentId": "<optional — parent page ID if nesting under a section>"
})
```

**If the page already exists** — update it:

```
CallMcpTool(server="plugin-atlassian-atlassian", toolName="updateConfluencePage", arguments={
  "cloudId": "<cloudId>",
  "pageId": "<pageId>",
  "body": "<full report markdown>",
  "contentFormat": "markdown",
  "versionMessage": "Tech debt scan — <date>"
})
```

### Report Template

The Confluence page should follow this structure:

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
(appended each scan — include delta table and resolved/new items)
```

### Linking Remediation Skills

If a remediation skill exists, reference it in the Recommended Actions:
- Class components / connect() → `migrate-class-components` skill
- Feature toggle migration → link to `pkg/services/featuremgmt/` docs

### 6d. Report Confluence action to user

Include the Confluence page URL in the final summary:

```
## Confluence Report

- **Action**: Created new page / Updated existing page
- **Page**: [Tech Debt Report — Grafana](<confluence-page-url>)
- **Space**: <space name>
- **Version message**: Tech debt scan — <date>
```

### 6e. Print report summary to the user (required)

**After** the Confluence page is successfully created or updated, the agent
**must** print a **Report Summary** in the chat response. Do not end the run
with only “updated Confluence” — the user should see the headline numbers and
deltas in-thread.

Use the **Output** input (`summary` vs `detailed`, see Inputs) to control depth:

- **`summary` (default)**: Include the sections below with counts and
  short tables; omit long file lists except 2–3 illustrative examples if helpful.
- **`detailed`**: Same as summary, plus top offenders per category (file paths
  and counts) up to ~10 lines per category, respecting Confluence-size guidance
  if the user asked for detail.

**Required sections (always):**

1. **Title line** — e.g. `## Tech Debt Report Summary — <scope> — <date>`
2. **Key metrics** — Markdown table: metric name, current value, and delta vs
   baseline when a baseline existed (or “n/a (first run)” when not).
3. **Hotspots** — Top 3–5 rows from the hotspots table (area, signals, commits,
   priority score).
4. **Recommended actions** — Numbered list of the same priority-ordered actions
   published to Confluence (short titles; one line each).
5. **Change highlights** — Brief bullets: what improved, what regressed, what
   stayed flat (if notable).
6. **Confluence** — Link and action (created vs updated), same as §6d.
7. **Linear sync** — Short recap: created / closed / updated / unchanged counts,
   plus optional bullet list of new issue keys/titles.

**Example skeleton (adapt numbers from the current scan):**

```markdown
## Tech Debt Report Summary — all — <date>

### Key metrics

| Metric | Current | Delta vs last scan |
|--------|---------|---------------------|
| Class components | … | … |
| … | … | … |

### Hotspots (top 5)

| Rank | Area | Signals | Commits | Score |
|------|------|---------|---------|-------|
| … | … | … | … | … |

### Recommended actions

1. …
2. …

### Change highlights

- Improved: …
- Regressed: …

### Confluence

- [Tech Debt Report — Grafana](<url>) — updated

### Linear

- Created: … / Closed: … / Updated: …
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
- **Confluence auth failure**: If the Atlassian MCP server returns an auth
  error, call the `mcp_auth` tool for `plugin-atlassian-atlassian` and retry.
- **Confluence page title conflict**: If `createConfluencePage` fails because
  the title already exists, fall back to the update path using a CQL search
  to locate the existing page.
- **No Confluence space configured**: If the user hasn't specified a space and
  no obvious match is found in `getConfluenceSpaces`, ask the user rather
  than guessing. Do not skip the Confluence step silently.
- **Large report exceeds Confluence limits**: Confluence pages have a ~1 MB
  body limit. If the detailed report is very large, truncate example file
  lists to 5 per category.
