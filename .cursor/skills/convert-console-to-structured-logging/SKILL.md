---
name: convert-console-to-structured-logging
description: >-
  Replace console.log, console.warn, and console.error with Grafana structured
  logging in frontend or backend code. Use when converting a console call,
  migrating to logInfo/logWarning/logError/createMonitoringLogger, replacing
  debug console output, or cleaning up unstructured logging in public/app/ or
  pkg/.
---

# Convert console.log to Structured Logging

Replace a single `console.*` call with the logging pattern that matches its
intent. Keep the diff minimal — one call site, one replacement, no unrelated
refactors.

## Quick Decision Tree

```
Is the file a script, test helper, Storybook story, or e2e test?
  → Leave console.* as-is (or skip)

Is it Go backend code (pkg/)?
  → Use pkg/infra/log or injected logger: logger.Info/Warn/Error/Debug with key-value fields

Is the message dev-only debug (render skips, state dumps, "ignore" traces)?
  → Use createLogger (@grafana/ui) or createDebugLog (app/core/utils/debugLog.ts)

Is it a recoverable failure the user/ops should see in telemetry?
  → Use logWarning or logError from @grafana/runtime

Is it an informational event worth tracking in production?
  → Use logInfo or createMonitoringLogger(...).logInfo

Does the feature area already export a logger?
  → Reuse it (pluginsLogger, dashboardLog, alerting Analytics, etc.)
```

## Step-by-Step (One Instance)

1. **Read the call site** — understand message, data, and whether it runs in
   production or only during local debugging.
2. **Check for an existing logger** in the same feature:
   ```bash
   rg 'createMonitoringLogger|createLogger|createDebugLog' <feature-dir>/
   rg 'export const .*Logger|export function log(Error|Warning|Info)' <feature-dir>/
   ```
3. **Pick the replacement** (see patterns below).
4. **Add imports** only if needed; prefer reusing a module-level logger already
   defined in the file or a nearby utils module.
5. **Convert unstructured args to context objects** — pass objects as the
   second argument, not string concatenation.
6. **Verify** the file still typechecks; do not add tests unless requested.

## Frontend Patterns

### Production telemetry — `@grafana/runtime`

Use when the log should reach Faro (Grafana JavaScript Agent).

```typescript
import { logInfo, logWarning, logError } from '@grafana/runtime';

logInfo('dashboard loaded', { dashboardUid: uid });
logWarning('malformed returnTo parameter', { returnTo });
logError(err instanceof Error ? err : new Error(String(err)), { panelId });
```

For a feature with multiple call sites, add a module logger once:

```typescript
import { createMonitoringLogger } from '@grafana/runtime';

const logger = createMonitoringLogger('features.dashboard-scene');

logger.logWarning('layout row missing grid item', { rowId });
logger.logError(error, { dashboardUid });
```

**Source naming**: use dotted paths matching the directory, e.g.
`features.plugins`, `core.crash-detection`, `features.dashboards.genai`.

### Dev-only debug — gated loggers

Use when the original `console.log` was clearly for local debugging.

**Option A** — `createLogger` from `@grafana/ui` (enable via
`localStorage.setItem('grafana.debug', 'true')`):

```typescript
import { createLogger } from '@grafana/ui';

const log = createLogger('Dashboard');

// Before: console.log('Skip tick render', title, delta);
log.logger('render', false, 'Skip tick render', title, delta);
```

**Option B** — `createDebugLog` for feature-scoped keys:

```typescript
import { createDebugLog } from 'app/core/utils/debugLog';

const debugLog = createDebugLog('live-panel', 'LivePanel');

// Before: console.log('LOAD', addr);
debugLog('LOAD', addr);
```

Enable: `localStorage.setItem('grafana.debug.live-panel', 'true')`

### Reuse feature loggers when they exist

| Area | Import from |
|------|-------------|
| Plugins | `pluginsLogger` in `app/features/plugins/utils.ts` |
| Plugin sandbox | `logInfo` / `logWarning` / `logError` in `app/features/plugins/sandbox/utils.ts` |
| Alerting | `logInfo`, `logError`, etc. in `app/features/alerting/unified/Analytics.ts` |
| Dashboard scene | `dashboardLog` in `app/features/dashboard-scene/utils/utils.ts` |
| Correlations | `correlationsLogger` in `app/features/correlations/utils.ts` |

## Backend Pattern (Go)

```go
// Before: fmt.Println(...) or log.Printf(...)
// After:
logger.Warn("Could not resolve query type", "query", q)
logger.Error("Failed to generate CSP nonce", "err", err)
```

Use the logger already injected on the struct/service; do not introduce a new
logging library.

## Before / After Examples

### Error in catch block

```typescript
// Before
catch (ex) {
  console.log('ERROR: ', ex);
}

// After
import { logError } from '@grafana/runtime';

catch (ex) {
  logError(ex instanceof Error ? ex : new Error(String(ex)), { source: 'panel.actions' });
}
```

### Warning during migration

```typescript
// Before
console.warn(`Skipping special value mapping with unknown match type: "${match}"`);

// After
import { logWarning } from '@grafana/runtime';

logWarning('Skipping special value mapping with unknown match type', { match });
```

### Debug trace (keep out of production telemetry)

```typescript
// Before
console.log('ignore', event);

// After
import { createDebugLog } from 'app/core/utils/debugLog';

const debugLog = createDebugLog('live-panel', 'LivePanel');
debugLog('ignore', event);
```

## Do NOT Convert

- **Scripts** under `scripts/`, `.github/`, `devenv/`
- **Tests** — `*.test.ts`, `public/test/`, e2e helpers (unless explicitly asked)
- **Storybook / MDX** examples in `packages/grafana-ui`
- **Logging infrastructure** — `packages/grafana-ui/src/utils/logger.ts`,
  `public/app/core/utils/debugLog.ts` (these wrap `console.log` intentionally)
- **Plugin sandbox distortions** — `sandbox/distortions.ts` intercepts plugin
  console calls by design
- **Bootstrap before Faro is ready** — `public/app/index.ts` boot failures
- **Commented-out** `console.log` lines — leave or delete; do not uncomment to
  convert

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using `logInfo` for noisy debug traces | Use `createDebugLog` or `createLogger` instead |
| Passing non-Error to `logError` | Wrap: `new Error(String(ex))` |
| Creating a new `createMonitoringLogger` for one call | Use top-level `logWarning`/`logError` imports, or reuse existing feature logger |
| Duplicating Faro + console (double reporting) | Prefer one path; see `extensions/logs/log.ts` warning on `logError` + `console.error` |
| String-interpolating context into the message | Keep message static; put dynamic values in the context object |

## Verification

```bash
# Confirm no new raw console in the edited production file (optional)
rg 'console\.(log|warn|error)' <edited-file>

# Typecheck touched package (pick relevant scope)
yarn typecheck
```

Only run tests if the change touches behavior the user asked to verify.
