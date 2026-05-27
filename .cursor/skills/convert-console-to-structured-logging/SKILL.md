---
name: convert-console-to-structured-logging
description: Replaces ad-hoc console logging with repository-native structured logging patterns while preserving behavior and debuggability. Use when the user asks to migrate console.log, console.error, console.warn, or unstructured debug output to structured logging.
disable-model-invocation: true
---

# Convert Console Logging To Structured Logging

Migrate direct `console.*` usage to structured logging that matches existing
patterns in the same service, package, or feature area.

## Scope

- Focus on one target file or a clearly bounded set of related files.
- Preserve the original logging intent (signal, level, and context).
- Avoid changing business behavior while refactoring logs.

## Quick Workflow

Copy this checklist and keep it updated:

```markdown
Logging Migration Progress
- [ ] 1) Inventory console usage in scope
- [ ] 2) Identify local structured logger pattern
- [ ] 3) Replace each console call with level + fields
- [ ] 4) Run targeted validation
- [ ] 5) Summarize mapping from old logs to new logs
```

## 1) Inventory Console Usage

List all `console.log`, `console.warn`, `console.error`, `console.info`, and
`console.debug` calls in the selected scope.

Prefer:

```bash
rg "console\\.(log|warn|error|info|debug)\\(" <path>
```

For each call, record:

- Trigger point (what condition causes it)
- Severity intent (debug/info/warn/error)
- Context payload currently emitted (ids, request, error, state)

## 2) Identify Structured Logger Pattern

Before replacing anything, inspect neighboring files in the same directory or
feature area and reuse the existing logger style. Do not invent a new logging
API when a local one already exists.

Selection rules:

1. Use the logger utility already used in adjacent code.
2. If multiple options exist, prefer the one already used by the owning module.
3. If no pattern exists, introduce the smallest local helper (file-level or
   package-level) that emits consistent level + context fields.

## 3) Replace Console Calls

Convert each call to structured logging with explicit level and fields.

Mapping guideline:

- `console.debug` or low-value tracing -> debug-level logger
- `console.log` (state transitions / milestones) -> info or debug (choose based on noise)
- `console.warn` -> warn-level logger
- `console.error` -> error-level logger, include error object

Required quality bar for each replacement:

- Message is stable and searchable.
- Dynamic data is attached as structured fields, not string-concatenated blobs.
- Error logs include the error object and key identifiers.
- Existing guards around verbose debug behavior are preserved.

## 4) Remove Console Anti-Patterns

While migrating, remove these patterns when encountered:

- String interpolation that hides structured fields
- Catch blocks that only print and swallow without context
- Duplicated noisy logs in hot paths unless explicitly gated
- Temporary debug logs that have no operational value

## 5) Validate

Run targeted checks after replacement:

```bash
# Verify no direct console calls remain in migrated scope
rg "console\\.(log|warn|error|info|debug)\\(" <path>

# Frontend touched
yarn eslint <file-or-dir>
yarn jest --no-watch <test-file>

# Backend touched
go test ./<package>
```

If tests are unavailable for the exact scope, run the narrowest existing
checks and call out the gap explicitly.

## Output Requirements

When reporting completion, include:

1. Files migrated
2. Console call count before/after
3. Logger pattern chosen and why
4. Any level-mapping decisions that were non-obvious
5. Validation commands executed and outcomes

## Constraints

- Do not alter user-visible behavior beyond logging.
- Do not add new dependencies only for logging migration.
- Keep changes reviewable; split broad migrations into smaller passes.
