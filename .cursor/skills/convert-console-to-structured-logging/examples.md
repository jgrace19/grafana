# Console → Structured Logging Examples

Real patterns from this repo. Prefer minimal diffs — one call site per change unless
the user asks for a file-wide cleanup.

## Production warning — recoverable failure

**File:** `public/app/features/dashboard/components/DashboardSettings/VersionsSettings.tsx`

```typescript
// Before
.catch((err) => console.log(err))

// After
import { logWarning } from '@grafana/runtime';

.catch((err) =>
  logWarning('Failed to load dashboard versions', {
    error: err instanceof Error ? err.message : String(err),
  })
)
```

## Production error — catch block

**File:** `public/app/features/panel/state/actions.ts`

```typescript
// Before
console.log('ERROR: ', ex);

// After
import { logError } from '@grafana/runtime';

logError(ex instanceof Error ? ex : new Error(String(ex)), { source: 'panel.actions' });
```

## Dev-only trace — noisy render/debug

**File:** `public/app/features/dashboard/dashgrid/PanelStateWrapper.tsx`

```typescript
// Before
console.log('Skip tick render', this.props.panel.title, delta);

// After
import { createDebugLog } from 'app/core/utils/debugLog';

const debugLog = createDebugLog('panel-render', 'PanelStateWrapper');
// ...
debugLog('Skip tick render', { title: this.props.panel.title, delta });
```

Enable: `localStorage.setItem('grafana.debug.panel-render', 'true')`

## Reuse feature logger — plugins

**File:** `public/app/features/plugins/admin/state/actions.ts`

```typescript
// Before
console.log(error);

// After
import { pluginsLogger } from 'app/features/plugins/utils';

pluginsLogger.logError(error instanceof Error ? error : new Error(String(error)), {
  action: 'installPlugin',
});
```

## Reuse feature logger — dashboard scene (dev)

**File:** `public/app/features/dashboard-scene/pages/DashboardScenePage.tsx`

`dashboardLog` in `app/features/dashboard-scene/utils/utils.ts` is a dev `createLogger`
(not Faro telemetry):

```typescript
// Before
console.log('skipping rendering');

// After
import { dashboardLog } from '../utils/utils';

dashboardLog.logger('render', false, 'skipping rendering');
```

## Multiple calls in one file — add module logger once

**File:** `public/app/plugins/panel/live/LivePanel.tsx` (5 console.log calls)

```typescript
import { createDebugLog } from 'app/core/utils/debugLog';

const debugLog = createDebugLog('live-panel', 'LivePanel');

// Before: console.log('ignore', event);
debugLog('ignore', event);

// Before: console.log('LOAD', addr);
debugLog('LOAD', { addr });
```

## Go backend

**File:** any `pkg/` service with injected logger

```go
// Before
fmt.Printf("failed to load: %v\n", err)

// After
logger.Error("Failed to load resource", "err", err)
```

Use the logger already on the struct; do not add a new logging library.

## Do not convert

| File / area | Reason |
|-------------|--------|
| `*.test.ts`, `e2e/`, `public/test/` | Test output |
| `*.story.tsx` | Storybook demos |
| `scripts/`, `.github/`, `devenv/` | Build/CI tooling |
| `debugLog.ts`, `logger.ts` | Intentional console wrappers |
| `sandbox/distortions.ts` | Intercepts plugin console by design |
| Commented `// console.log(...)` | Leave or delete; do not uncomment |
