# Triage Comment Template

Post this as a comment on the Linear issue via `save_comment`. Fill in each section. Omit sections that don't apply (e.g., omit Hypothesis if confidence is low).

## Template

```markdown
## Triage Summary

| Field | Value |
|---|---|
| **Reproduced locally** | Yes / No / Partial / Skipped |
| **Recommended priority** | P<N> (<Urgent/High/Normal/Low>) |
| **Affected area** | `<file path or component>` |
| **Regression** | Yes (introduced by `<commit>`) / No / Unknown |
| **Related issues** | <ISSUE-IDs> or None |

## Investigation

<What was found in the codebase. Include:
- Relevant source files and line numbers
- Recent commits that touched the affected area
- Whether test coverage exists>

## Reproduction Attempt

<What was tried and the result. Include:
- Commands run or pages visited
- Whether the bug manifested
- If partial, what did and didn't work>

Skip this section if reproduction was not attempted.

## Hypothesis

<Only include if medium-to-high confidence.

**Confidence:** High / Medium

**Root cause:** <theory of what's wrong>

**Proposed fix direction:** <what to change and where>>

If low confidence, replace with:

## Areas to Investigate

- <Area 1 and why>
- <Area 2 and why>

---
*Triaged by Cursor agent*
```

## Insufficient Info Template

Use this when the ticket lacks enough detail to triage.

```markdown
## Triage: Needs More Information

This ticket doesn't have enough detail for a full triage. To investigate further, we need:

- [ ] **Error message or stack trace** — What error do users see?
- [ ] **Steps to reproduce** — Exact steps to trigger the bug
- [ ] **Affected component** — Which page, feature, or API endpoint?
- [ ] **Environment** — Browser, OS, Grafana version, deployment type

Setting priority to Normal (P3) as a placeholder until more info is available.

---
*Triaged by Cursor agent*
```
