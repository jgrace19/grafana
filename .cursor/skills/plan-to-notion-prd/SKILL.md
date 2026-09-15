---
name: plan-to-notion-prd
description: Convert implementation plans, planning notes, or rough specs into a structured PRD and publish it to Notion. Use when the user asks to turn a plan document into a PRD, product requirements document, spec template, or Notion page.
---

# Plan to Notion PRD

Transform a planning document into a clear product requirements document and
publish it to Notion.

## Inputs

Before starting, collect:

1. **Source plan**: pasted text, local file path, linked document, or current chat context.
2. **Notion destination**: parent page, database, workspace search term, or permission to choose the most relevant location.
3. **Audience**: engineering-only, product review, leadership, support, or cross-functional readers.
4. **Status**: draft, ready for review, approved, or implementation-ready.

If the source plan or Notion destination is missing, ask for it before writing
or publishing. Infer audience and status when they are not specified.

## Workflow

1. Read the full source plan and preserve the user's meaning.
2. Identify gaps, contradictions, and unresolved decisions.
3. Ask only blocking clarification questions. If gaps are not blocking, capture
   them under **Open Questions**.
4. Draft the PRD using the template below.
5. Publish the PRD to Notion.
6. Return the Notion page link and a brief summary of what was created.

When using Notion MCP tools, first inspect the relevant tool schema. Prefer the
Notion page creation workflow when the user asks to create a document. Use a
database row workflow only when the destination is explicitly a Notion database.

## PRD Template

Use this structure by default. Omit sections only when they clearly do not apply.

```markdown
# [Feature / Project Name] PRD

## Overview
[One to three paragraphs explaining the problem, proposed solution, and why it matters.]

## Goals
- [Specific outcome]
- [Specific outcome]

## Non-goals
- [Explicitly out-of-scope item]
- [Explicitly out-of-scope item]

## Users and Use Cases
- **[User/persona]**: [What they need to accomplish and why]

## Background and Context
[Relevant history, links, constraints, dependencies, or prior decisions.]

## Requirements
### Functional Requirements
- [Requirement with expected behavior]

### UX Requirements
- [Interaction, content, accessibility, or visual requirement]

### Data and Integration Requirements
- [API, schema, event, migration, analytics, permission, or integration requirement]

### Performance, Reliability, and Security Requirements
- [Latency, availability, privacy, abuse prevention, compliance, or security requirement]

## User Experience
[Primary flow, edge cases, error states, empty states, and any copy requirements.]

## Testing Requirements
- **Unit tests**: [Core logic, reducers, helpers, services, or validation paths]
- **Integration tests**: [API, database, service, or workflow boundaries]
- **End-to-end tests**: [Critical user journeys]
- **Manual QA**: [Browsers, roles, feature flags, environments, data setup]
- **Regression coverage**: [Existing behavior that must not break]

## Analytics and Success Metrics
- [Metric or event that shows adoption, quality, or business impact]

## Rollout Plan
[Feature flags, staged rollout, migration, documentation, enablement, and rollback plan.]

## Risks and Mitigations
- **Risk**: [Risk]
  **Mitigation**: [Mitigation]

## Dependencies
- [Team, system, API, design, legal, data, or infrastructure dependency]

## Open Questions
- [Question, owner, and target resolution date if known]

## Appendix
[Supporting links, diagrams, raw notes, examples, or glossary.]
```

## Writing Guidelines

- Keep product intent clear and implementation details grounded in the source plan.
- Use decisive language for confirmed requirements and label uncertainty clearly.
- Convert task lists into requirements only when they describe user-visible or system behavior.
- Preserve exact terminology, names, metrics, and constraints from the source plan.
- Do not invent commitments. Put assumptions in **Open Questions** or call them out before publishing.
- Make testing requirements concrete enough that engineering and QA can act on them.

## Notion Publishing

When publishing:

1. Create a Notion page with the PRD title.
2. Use the PRD sections as page headings.
3. Convert bullets, checklists, links, and code snippets into native Notion blocks when supported.
4. If publishing into a database, set obvious properties such as title, status, owner, project, and type.
5. Include a short source note at the end when useful:

```markdown
Source: Generated from [plan name/link/context] on [date].
```

After publishing, verify the page exists and contains the major PRD sections:
**Overview**, **Goals**, **Requirements**, **Testing Requirements**, **Rollout
Plan**, **Risks and Mitigations**, and **Open Questions**.

## Final Response

Return:

```markdown
Created the PRD in Notion: [Title](url)

I structured it around the product goals, requirements, testing expectations,
rollout plan, risks, and open questions. [Mention any important assumptions or
missing inputs.]
```
