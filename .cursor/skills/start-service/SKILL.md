---
name: start-service
description: Start the full Grafana dev stack locally (backend with hot reload + webpack-watch frontend) on the first free port from 3000, wait for the first frontend compile so the UI actually loads, and seed a testdata "Random Walk" dashboard. Use when the user asks to start Grafana locally, run the dev stack, bring up the local service, or populate local startup data.
---

# Start Grafana Service

Bring up the full Grafana dev stack locally with hot reload, default
`admin/admin` credentials, and a seeded testdata dashboard.

## Quick Start

One command brings up backend, frontend, and seeds the dashboard:

```bash
bash .cursor/skills/start-service/scripts/start-dev.sh
```

The script:

1. Picks a free port starting at 3000 (falls back to 3001..3099).
2. Runs `yarn install --immutable` if `node_modules/` is missing.
3. Starts the frontend (`yarn start`, webpack `--watch`) and backend
   (`make run`, `air`-based hot reload) in the background, logging to
   `/tmp/grafana-dev/{frontend,backend}.log`.
4. Waits for `/api/health` AND for the frontend to write
   `public/build/assets-manifest.json` with at least one `.js` chunk on disk
   before declaring readiness.
5. Creates a `TestData DB` datasource (if missing) and seeds the
   `Local Testdata Overview` dashboard with a `random_walk` Time Series panel
   via `seed-testdata-dashboard.sh`.
6. Stays attached so `Ctrl-C` cleanly stops both processes (including
   webpack/typescript worker descendants).

When ready, open the printed URL and log in with `admin / admin`. The seeded
dashboard lives at `<URL>/d/local-testdata-overview/local-testdata-overview`
and renders an updating green time series.

## Why the wait for frontend matters

If the Go backend starts before webpack finishes its first compile, it serves
`index.html` referencing chunk hashes that don't exist on disk yet. The browser
then renders the fallback `If you're seeing this Grafana has failed to load
its application files` message until you hard-refresh. The orchestrator polls
`public/build/assets-manifest.json` and one referenced chunk before exiting,
which avoids that race.

## Options

```bash
# Skip the dashboard seed.
bash .cursor/skills/start-service/scripts/start-dev.sh --no-seed

# Prefer a different port (still falls back if busy).
bash .cursor/skills/start-service/scripts/start-dev.sh --port 3010
```

## Backend-only (advanced)

When you already have a frontend dev server running and just want a backend on
a fresh port:

```bash
bash .cursor/skills/start-service/scripts/start-backend.sh        # prefers 3000
bash .cursor/skills/start-service/scripts/start-backend.sh 3010   # custom port
```

This script does NOT start `yarn start`, so you must already have current
frontend assets in `public/build/` (e.g. via a separate `yarn start` or
`yarn build`) or you will hit the "failed to load application files" page.

## Seed only

```bash
bash .cursor/skills/start-service/scripts/seed-testdata-dashboard.sh http://localhost:3000
```

Re-runnable (`overwrite: true`). It:

1. Waits up to 60s for `/api/health`.
2. Looks up the `TestData DB` datasource (`grafana-testdata-datasource`) by
   name. If it doesn't exist, it creates it via `POST /api/datasources`. This
   fixes the "Failed to load datasource" panel error you'd otherwise get on
   a brand-new local Grafana with no datasources configured.
3. Upserts the `Local Testdata Overview` dashboard wired to that datasource.

## Files

- `scripts/start-dev.sh` — main entry point: backend + frontend + seed, with
  readiness gating and clean shutdown.
- `scripts/start-backend.sh` — backend only with port pick + pprof disabled.
- `scripts/seed-testdata-dashboard.sh` — upserts the testdata dashboard.

## Environment notes

- Sets `GF_DIAGNOSTICS_PROFILING_ENABLED=false` to avoid pprof binding to
  port 6000 when another local Grafana is already running.
- Logs to `/tmp/grafana-dev/`. Tail them when debugging:

  ```bash
  tail -f /tmp/grafana-dev/backend.log /tmp/grafana-dev/frontend.log
  ```
