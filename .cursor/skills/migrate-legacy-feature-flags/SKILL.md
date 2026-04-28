---
name: migrate-legacy-feature-flags
description: Migrates Grafana backend feature flag usage from deprecated FeatureToggles.IsEnabled and IsEnabledGlobally to OpenFeature typed evaluations. Use when user mentions OpenFeature migration, IsEnabled migration, IsEnabledGlobally, feature flag modernization, or deprecation cleanup.
---

# Migrate Legacy Feature Flags to OpenFeature

## Purpose

Use this skill to migrate legacy feature flag checks in `pkg/` from:

- `features.IsEnabled(ctx, flag)`
- `features.IsEnabledGlobally(flag)`

to OpenFeature evaluations (for example `BooleanValue`, `StringValue`, `IntValue`, `FloatValue`) with explicit defaults and context handling.

This skill covers planning, implementation, validation, and PR-readiness.

## Success Criteria

- No new `IsEnabled` / `IsEnabledGlobally` usage is introduced.
- Targeted legacy call sites are migrated to OpenFeature client evaluations.
- Behavior parity is preserved with clear default values.
- Relevant tests compile/pass for touched packages.
- Migration summary includes remaining scope and follow-up targets.

## Repository Context

- Legacy API is explicitly deprecated in `pkg/services/featuremgmt/models.go`.
- OpenFeature initialization and provider setup live in:
  - `pkg/services/featuremgmt/openfeature.go`
  - `pkg/setting/setting_openfeature.go`
- Typed/static evaluator patterns live in:
  - `pkg/services/featuremgmt/static_evaluator.go`

## Workflow

Copy this checklist and keep it updated while working:

```text
Migration Progress:
- [ ] 1) Inventory legacy call sites in target scope
- [ ] 2) Classify each call by expected flag type and evaluation context
- [ ] 3) Implement OpenFeature replacements
- [ ] 4) Run compile/tests for touched packages
- [ ] 5) Summarize migrated and remaining call sites
```

### 1) Inventory call sites

Start with narrow scope first (one package/subsystem), then expand.

Use repository search for:

- `IsEnabled(`
- `IsEnabledGlobally(`

Capture:

- package/file path
- flag name
- whether call is startup-time/global or request-scoped
- whether boolean is sufficient or a typed value is preferable

### 2) Classify migration shape

For each call site, decide:

1. **Boolean gate**: use `BooleanValue(...)` style evaluation with explicit default.
2. **Typed config flag**: use string/int/float/object evaluation when needed.
3. **Global-at-startup requirement**:
   - if truly startup-invariant, prefer explicit setting/config over runtime flag checks
   - otherwise migrate to OpenFeature with clearly documented default

### 3) Implement replacement pattern

General guidance:

- Use OpenFeature client evaluation, not legacy featuremgmt interface checks.
- Always provide explicit fallback defaults.
- Preserve existing semantics for disabled/unset flag behavior.
- Keep changes minimal and local to call site.

Example migration pattern (boolean):

```go
// Before:
if features.IsEnabled(ctx, featuremgmt.FlagX) {
  // behavior
}

// After (illustrative):
enabled, err := openfeature.NewDefaultClient().BooleanValue(
  ctx,
  featuremgmt.FlagX,
  false,
  openfeature.TransactionContext(ctx),
)
if err == nil && enabled {
  // behavior
}
```

Notes:

- Pick default (`false` above) to match prior behavior.
- If existing code path assumes fail-open/fail-closed semantics, keep that behavior explicit.
- Reuse existing helper abstractions if present in the surrounding package.

### 4) Validate changes

Run targeted checks for touched packages first:

- compile/tests for modified package(s)
- any package-specific tests impacted by flag behavior

If broad shared code changed, run a wider backend test sweep as appropriate.

### 5) Report progress and follow-ups

Include:

- files and call sites migrated
- defaults chosen (and why)
- tests/checks run
- remaining `IsEnabled*` call sites in the same subsystem
- recommended next package for incremental migration

## Decision Rules

- Prefer incremental PR-sized migrations over repo-wide rewrites.
- Do not change flag meaning during migration; separate semantic changes into follow-up work.
- Avoid adding wrapper layers unless repeated patterns justify it.
- Keep OpenFeature context usage consistent with nearby code.

## Triggers

Auto-apply this skill when prompts mention:

- `OpenFeature`
- `IsEnabled`
- `IsEnabledGlobally`
- `feature flag migration`
- `deprecation cleanup` for feature flags

## Deliverable Template

Use this structure in responses after completing a migration chunk:

```markdown
Migrated legacy feature flags in `<scope>`.

- Updated call sites:
  - `path/to/file1.go` (`FlagA`)
  - `path/to/file2.go` (`FlagB`)
- Default behaviors preserved:
  - `FlagA`: default `false` (matches prior disabled behavior)
  - `FlagB`: default `true` (matches prior enabled behavior)
- Validation:
  - `<command/result>`
- Remaining in scope:
  - `<N>` call sites (`IsEnabled*`)
```

