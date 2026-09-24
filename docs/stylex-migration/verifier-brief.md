---
title: StyleX migration verifier brief
---

# StyleX migration verifier brief

You verify a slice **independently** from the implementer. You receive the slice diff, the manifest entry from [.cursor/plans/stylex-slices.md](../../.cursor/plans/stylex-slices.md), and this checklist—not the implementer's notes or chat history.

Before you begin, ensure you have the following:

- A clean checkout of the implementer's branch (or worktree).
- Access to the same commands the implementer used (lint, typecheck, Jest, Playwright).
- The slice's **covering stories and pages** from the manifest.

## Verification steps

1. **Scope:** `git diff --name-only origin/main...HEAD` must match only the slice owned paths (allowlisted coordinator files such as manifest updates are absent from slice PRs).
2. **Emotion removed:** In owned paths, no `@emotion/*` imports and no `useStyles2(` calls remain. `useTheme2()` is allowed only for non-styling usage; flag undocumented styling uses.
3. **Static checks:** Run ESLint on owned paths and typecheck the affected package or `public/app` project.
4. **Unit tests:** `yarn jest --no-watch` on slice tests; failures or snapshot changes without justification are a fail.
5. **Screenshots:** Run Playwright tests for the slice's covering Storybook stories and app pages in **light and dark**. Zero unapproved pixel diffs. Missing coverage is a fail until stories or pages are added.
6. **Accessibility:** Axe (Storybook addon or smoke tests) shows no new violations on covering surfaces.
7. **Recipe review:** Confirm `mergeStylexClassName` / layer behavior for `className`, no new global CSS, nested selectors handled per [contribute/style-guides/stylex-migration.md](../../contribute/style-guides/stylex-migration.md), and no public API changes.

## Evidence to return

- Pass or fail verdict with slice id.
- Command output for lint, typecheck, and Jest.
- List of screenshot tests run and diff status.
- Short diff review notes (files flagged, token requests validated).

## Escalation

- Fail → return evidence to the implementer (max two retries per slice).
- After two failures → coordinator escalates to a human and marks the manifest row **blocked**.

## Compatibility spot-check

When the slice touches `@grafana/ui` surfaces used by plugins, confirm the external plugin fixture still passes:

```bash
yarn e2e:playwright e2e-playwright/stylex-migration/plugin-usestyles2-compat.spec.ts
```
