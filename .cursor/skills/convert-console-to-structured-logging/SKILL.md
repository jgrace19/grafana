---
name: convert-console-to-structured-logging
description: >-
  Replace console.log, console.warn, and console.error with Grafana structured
  logging in frontend or backend code. Use when converting console calls,
  migrating to logInfo/logWarning/logError/createMonitoringLogger, replacing
  debug console output, cleaning up unstructured logging in public/app/ or
  pkg/, or auditing console usage across the app.
---

# Convert console.log to Structured Logging

Replace raw `console.*` calls with the logging pattern that matches their intent.
Keep diffs minimal — one call site per change unless the user asks for a
file-wide or feature-wide cleanup.

## Find Instances

Run the scan script from the repo root:

```bash
bash .cursor/skills/convert-console-to-structured-logging/scripts/scan-console-logs.sh
bash .cursor/skills/convert-console-to-structured-logging/scripts/scan-console-logs.sh . packages
bash .cursor/skills/convert-console-to-structured-logging/scripts/scan-console-logs.sh . all
```

For Go backend runtime paths:

```bash
bash .cursor/skills/convert-console-to-structured-logging/scripts/scan-go-prints.sh
```

Or search manually:

```bash
rg 'console\.log\(' public/app packages --glob '*.{ts,tsx}'
rg '^\s*console\.log\(' public/app --glob '*.{ts,tsx}'   # active only
rg 'console\.(warn|error)\(' public/app --glob '*.{ts,tsx}'
```

Typical inventory (~47 files in `public/app/`, ~70 call sites): live/centrifuge,
LivePanel, testdata streams, dashboard init, FetchQueue, canvas connections,
migrations, and catch blocks using `console.log` for errors.

## Quick Decision Tree

```
Script, test, Storybook, e2e, CI, devenv?
  → Skip (leave console.* as-is)

Go backend (pkg/)?
  → Use injected pkg/infra/log logger with key-value fields

Dev-only debug (render skips, state dumps, "ignore" traces)?
  → createLogger (@grafana/ui) or createDebugLog (app/core/utils/debugLog.ts)

Recoverable failure worth telemetry?
  → logWarning or logError from @grafana/runtime

Informational production event?
  → logInfo or createMonitoringLogger(...).logInfo

Feature already exports a logger?
  → Reuse it (pluginsLogger, correlationsLogger, dashboardLog, etc.)
```

## Workflow

### Single call site

1. Read the call — message, args, production vs local debug.
2. Check for an existing logger in the feature:
   ```bash
   rg 'createMonitoringLogger|createLogger|createDebugLog' <feature-dir>/
   rg 'export const .*Logger' <feature-dir>/
   ```
3. Pick the replacement (see patterns below).
4. Convert unstructured args to a context object (second argument).
5. Add imports only when needed; prefer reusing a module-level logger.
6. Typecheck touched scope if the change is non-trivial.

### Batch / feature cleanup

```
Task Progress:
- [ ] Run scan script; list files in scope (exclude skip list below)
- [ ] Check for existing feature logger; create one if 3+ production calls
- [ ] Convert errors/warnings first (logError/logWarning)
- [ ] Convert dev traces second (createDebugLog/createLogger)
- [ ] Re-run scan on edited paths; confirm no new raw console in production files
```

Prioritize: catch blocks misusing `console.log` → warnings for bad state →
noisy debug traces last.

## Frontend Patterns

### Production telemetry — `@grafana/runtime`

Routes to Faro (Grafana JavaScript Agent) when enabled.

```typescript
import { logInfo, logWarning, logError } from '@grafana/runtime';

logInfo('dashboard loaded', { dashboardUid: uid });
logWarning('malformed returnTo parameter', { returnTo });
logError(err instanceof Error ? err : new Error(String(err)), { panelId });
```

For multiple call sites in one feature:

```typescript
import { createMonitoringLogger } from '@grafana/runtime';

const logger = createMonitoringLogger('features.dashboard-scene');

logger.logWarning('layout row missing grid item', { rowId });
logger.logError(error, { dashboardUid });
```

**Source naming**: dotted paths matching directories — `features.plugins`,
`core.crash-detection`, `features.dashboards.genai`.

### Dev-only debug — gated loggers

**Option A** — `createLogger` from `@grafana/ui`
(enable: `localStorage.setItem('grafana.debug', 'true')`):

```typescript
import { createLogger } from '@grafana/ui';

const log = createLogger('Dashboard');
log.logger('render', false, 'Skip tick render', title, delta);
```

**Option B** — `createDebugLog` for feature-scoped keys:

```typescript
import { createDebugLog } from 'app/core/utils/debugLog';

const debugLog = createDebugLog('live-panel', 'LivePanel');
debugLog('LOAD', { addr });
```

Enable: `localStorage.setItem('grafana.debug.live-panel', 'true')`

### Reuse existing feature loggers

| Area | Import |
|------|--------|
| Plugins | `pluginsLogger` — `app/features/plugins/utils.ts` |
| Plugin sandbox | `sandboxLogger` — `app/features/plugins/sandbox/utils.ts` |
| Alerting | `logInfo`, `logError`, etc. — `app/features/alerting/unified/Analytics.ts` |
| Dashboard scene (dev) | `dashboardLog` — `app/features/dashboard-scene/utils/utils.ts` |
| Correlations | `correlationsLogger` — `app/features/correlations/utils.ts` |
| Echo (dev) | `echoLogger` — `app/core/services/echo/utils.ts` |

Note: `dashboardLog` and `echoLogger` are **dev** `createLogger` instances, not
Faro telemetry. Use them for debug traces, not production warnings.

## Backend Pattern (Go)

```go
// Before: fmt.Println(...) or log.Printf(...)
logger.Warn("Could not resolve query type", "query", q)
logger.Error("Failed to generate CSP nonce", "err", err)
```

Use the logger already injected on the struct/service.

Go decision flow:

1. Runtime `pkg/` service has `log.Logger` field or package logger already?
   - Reuse it.
2. Operator already uses slog logger (`logging.NewSLogLogger`)?
   - Reuse that logger (`logger.Info/Warn/Error`).
3. No logger in package yet?
   - Add `var logger = log.New("domain.subdomain")`.
4. Bootstrap/logging-subsystem fallback path?
   - Keep stderr fallback if structured logging could recurse.

## Do NOT Convert

- `scripts/`, `.github/`, `devenv/`, `e2e/`, `e2e-playwright/`
- `*.test.ts`, `*.test.tsx`, `public/test/`
- `*.story.tsx`, Storybook utils in `packages/grafana-ui`
- Logging infrastructure: `packages/grafana-ui/src/utils/logger.ts`,
  `public/app/core/utils/debugLog.ts`
- `public/app/features/plugins/sandbox/distortions.ts` (plugin console proxy)
- Bootstrap before Faro: `public/app/index.ts` boot failures
- Commented-out `console.log` — leave or delete; do not uncomment to convert
- JSDoc example lines (e.g. `compatibilityApi.ts`)
- `pkg/cmd/**` CLI stdout/stderr output
- `pkg/build/**`, `go:build ignore` tool binaries, and `*_test.go`
- `pkg/infra/log/file.go` stderr fallback while logging internals are failing

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `logInfo` for noisy debug traces | Use `createDebugLog` or `createLogger` |
| Non-Error passed to `logError` | Wrap: `new Error(String(ex))` |
| New `createMonitoringLogger` for one call | Use `logWarning`/`logError` imports directly |
| Faro + console double-reporting | One path only; see `extensions/logs/log.ts` |
| Dynamic values in message string | Static message; dynamic values in context object |
| `console.log` in `.catch()` for errors | Use `logError` or `logWarning` |

## Verification

```bash
bash .cursor/skills/convert-console-to-structured-logging/scripts/scan-console-logs.sh . app
yarn typecheck   # or targeted test if behavior changed
bash .cursor/skills/convert-console-to-structured-logging/scripts/scan-go-prints.sh
go test ./path/to/touched/pkg/...
```

Only run tests when the user requests verification or behavior changes.

## Additional Resources

- Real file examples: [examples.md](examples.md)
- Go backend examples: [examples-go.md](examples-go.md)
- Runtime API: `packages/grafana-runtime/src/utils/logging.ts`
- Dev logger: `packages/grafana-ui/src/utils/logger.ts`
- App debug helper: `public/app/core/utils/debugLog.ts`
