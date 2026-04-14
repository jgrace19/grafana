---
name: grafana-dev-start
description: >-
  Starts Grafana local development: Go backend with hot reload and webpack
  frontend dev server. Use when the user wants to run Grafana locally, start
  dev servers, open localhost:3000, or develop against the full stack.
---

# Grafana dev stack startup

## Preconditions

- Repository root is the Grafana workspace (`Makefile`, `package.json` at top level).
- `go` and `yarn` are on `PATH` (install Go per `go.mod`; enable Yarn via `corepack enable` if using repo-pinned Yarn).
- Node.js matches `.nvmrc` (use `nvm use` / `fnm use` if needed).
- Go version matches `go.mod`.
- Frontend deps: run `yarn install --immutable` once (or after lockfile changes).

## Startup order

Use **two** long-running processes (separate terminals or background jobs).

1. **Backend** (serves UI and proxies to the dev server on port 3000):

   ```bash
   make run
   ```

   Default login: `admin` / `admin`. First cold build can take several minutes.

2. **Frontend** (webpack watch; backend proxies to this dev server):

   ```bash
   yarn start
   ```

   Wait until the compile finishes; then use the app at `http://localhost:3000`.

## Stopping

Interrupt each process (Ctrl+C) or stop the background tasks.

## Optional checks

- If the UI fails to load assets, confirm both `make run` and `yarn start` are still running.
- For backing data sources only (not required for basic UI): see `make devenv` in `AGENTS.md`.
