# AGENTS.md — End-to-end tests (Playwright)

This file is loaded when agents work under `e2e-playwright/`. Full guide (framework structure, writing tests, core-plugin tests): [`contribute/style-guides/e2e-playwright.md`](../contribute/style-guides/e2e-playwright.md).

## Commands

```bash
yarn e2e:playwright                                # All tests (starts its own server on :3001)
yarn e2e:playwright <path/to/test.spec.ts>         # Specific test
yarn e2e:playwright --project <name>               # Specific suite/project
GRAFANA_URL=http://localhost:3000 yarn e2e:playwright   # Against an already-running instance
```

First time: `yarn playwright install chromium`. The default command builds the backend if needed and provisions devenv dashboards, datasources, and apps; with `GRAFANA_URL` set, no server is started — Grafana must already be running there.

## Conventions

- Select elements via `@grafana/e2e-selectors` (aria-labels / data-testid), never CSS classes or DOM structure.
- Tests are grouped into suites by feature directory (`dashboards-suite/`, `panels-suite/`, …); put new tests in the matching suite.
- Prefer `@grafana/plugin-e2e` fixtures for datasource/plugin flows — see the style guide.
