---
name: triage-linear-bug
description: >-
  Triage a Linear bug ticket by reading the issue, searching for duplicates,
  investigating the codebase, optionally reproducing the bug, assigning priority,
  and posting structured findings back to Linear. Use when the user asks to triage
  a bug, investigate a Linear issue, assess bug severity, or prioritize a bug report.
---

# Triage Linear Bug

## Inputs

Before starting, collect:

1. **Issue ID** (e.g., `KAN-42`) — required
2. **Attempt reproduction** — yes/no (default: no). Set to yes for UI bugs or when repro steps are provided.

If the issue ID is missing, ask for it before proceeding.

## Workflow

Follow these steps in order. Each step feeds the next.

### Step 1: Read the ticket

Fetch the full issue from Linear:

```
CallMcpTool(server="plugin-linear-linear", toolName="get_issue", arguments={
  "id": "<ISSUE-ID>",
  "includeRelations": true
})
```

Also fetch comments for additional context:

```
CallMcpTool(server="plugin-linear-linear", toolName="list_comments", arguments={
  "issueId": "<ISSUE-ID>"
})
```

Extract and record:
- **Error signature**: error type, message, code, stack trace
- **Affected component**: which feature, page, or service
- **Repro steps**: any steps to reproduce provided
- **User impact**: who is affected, how many, blocking or degraded
- **Environment**: production, staging, browser, OS, version

If the ticket lacks an error signature AND repro steps AND affected component, go to **Step 7 (Insufficient info)** instead of continuing.

### Step 2: Search for duplicates

Search for similar issues before doing deep investigation:

```
CallMcpTool(server="plugin-linear-linear", toolName="list_issues", arguments={
  "query": "<error signature or symptom keywords>",
  "limit": 20
})
```

Run a second search with different keywords if the first is too narrow (e.g., component name instead of error message).

**Evaluate results:**

| Confidence | Signal | Action |
|---|---|---|
| High duplicate (>90%) | Same error + same component + recent | Flag as duplicate, link via `save_issue` with `duplicateOf`, post comment, stop |
| Likely related (50-90%) | Similar symptoms or same component | Note as related, continue triage |
| No match (<50%) | Nothing similar found | Continue triage |

If flagging as duplicate, use `save_issue` to set `duplicateOf` and post a comment explaining the link, then stop.

### Step 3: Investigate the codebase

Search the codebase for the reported error or affected component:

1. **Error search** — Grep for the error message, exception type, or error code
2. **Component search** — Find the source files for the affected feature/page
3. **Recent changes** — Run `git log --oneline -20 -- <affected files>` to check for recent commits that may have introduced a regression
4. **Related tests** — Find existing test files covering the affected code

Record:
- Relevant source files and line numbers
- Recent commits that touched the area (potential regression sources)
- Whether test coverage exists for the reported behavior

### Step 4: Attempt reproduction (if opted in)

Skip this step if reproduction was not requested.

**For UI bugs:**
1. Start the dev server if not already running (use the `grafana-dev-start` skill)
2. Use the browser MCP to navigate to the affected page
3. Follow the repro steps from the ticket
4. Take a screenshot to document the result

**For backend bugs:**
1. Run targeted tests: `go test -run <TestPattern> ./<affected package>/`
2. If no matching test exists, try to write a minimal reproduction test

**For frontend logic bugs:**
1. Run targeted tests: `yarn jest --no-watch <affected file>`
2. Check if existing tests already fail

Record:
- **Reproduced**: yes / no / partial
- **What was tried**: specific commands, URLs visited, steps followed
- **Evidence**: test output, screenshot, error log

If reproduction fails after reasonable effort, record what was attempted and move on.

### Step 5: Assess priority

Apply this rubric based on everything gathered so far. See [priority-rubric.md](priority-rubric.md) for the full decision matrix.

| Priority | Linear Value | Criteria |
|---|---|---|
| P1 Critical | 1 (Urgent) | Complete outage, data loss, security vulnerability, all users affected |
| P2 High | 2 (High) | Major feature broken for broad user base, no workaround |
| P3 Medium | 3 (Normal) | Feature degraded, workaround exists, or subset of users affected |
| P4 Low | 4 (Low) | Cosmetic, minor UX issue, edge case, non-blocking |

Consider:
- **Blast radius**: one user, a segment, or everyone?
- **Workaround**: can users accomplish the task another way?
- **Trend**: is this a regression (recently broke) or long-standing?
- **Data integrity**: is data at risk of corruption or loss?

### Step 6: Form hypothesis and propose fix

**Only do this if** codebase investigation (Step 3) and/or reproduction (Step 4) provide enough signal to be confident.

State your confidence level explicitly:
- **High confidence** — root cause identified in code, propose specific fix
- **Medium confidence** — likely area identified, propose investigation direction
- **Low confidence** — multiple possible causes, list areas to explore

If confidence is low, frame output as "areas to investigate" not "proposed fix."

### Step 7: Write findings back to Linear

**Post a triage comment** using the template in [comment-template.md](comment-template.md):

```
CallMcpTool(server="plugin-linear-linear", toolName="save_comment", arguments={
  "issueId": "<ISSUE-ID>",
  "body": "<structured triage comment>"
})
```

**Update issue fields:**

```
CallMcpTool(server="plugin-linear-linear", toolName="save_issue", arguments={
  "id": "<ISSUE-ID>",
  "priority": <1-4 based on assessment>,
  "labels": ["triaged"]
})
```

Add additional labels as appropriate:
- `"regression"` — if git log suggests a recent change caused it
- `"needs-repro-steps"` — if the ticket was too vague to investigate (Step 7 insufficient info path)
- `"duplicate"` — if flagged as duplicate in Step 2

If related issues were found, link them:

```
CallMcpTool(server="plugin-linear-linear", toolName="save_issue", arguments={
  "id": "<ISSUE-ID>",
  "relatedTo": ["<RELATED-ISSUE-ID>"]
})
```

### Step 7 (Insufficient info path)

If the ticket lacks enough detail to triage:

1. Post a comment asking for clarification (what's missing: repro steps, error message, affected component, environment)
2. Add label `"needs-repro-steps"`
3. Set priority to 3 (Normal) as a default placeholder
4. Report to the user that the ticket needs more info before meaningful triage

### Step 8: Report to user

Summarize findings in chat:

```
## Triage Complete: <ISSUE-ID>

**Priority:** P<N> (<reasoning in one line>)
**Reproduced:** Yes / No / Partial / Skipped
**Duplicates:** None found / Duplicate of <ID> / Related to <ID>

### Key findings
- <what was found in codebase>
- <recent commits of interest>

### Hypothesis
<root cause theory if confident, or "Insufficient signal" with areas to investigate>

### Actions taken
- Posted triage comment to <ISSUE-ID>
- Set priority to <N>
- Added labels: <list>
```

## Edge cases

**Ticket references external service or infrastructure**: Note that the bug may require access beyond the local codebase. Triage what you can (codebase investigation, related issues) and flag that reproduction requires a specific environment.

**Multiple bugs in one ticket**: Triage the primary (most severe) bug. Recommend splitting into separate tickets if the issues are distinct.

**Ticket is a feature request, not a bug**: Flag this to the user. Do not assign bug priority. Recommend relabeling.
