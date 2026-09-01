# AGENTS.md — Frontend app

This file is loaded when agents work under `public/app/`. Keep it lean: patterns and gotchas belong here; mechanics live in [`contribute/style-guides/frontend.md`](../../contribute/style-guides/frontend.md) and the other style guides linked below.

## Commands

```bash
yarn start                    # Dev server (watches; backend proxies to it)
yarn jest --no-watch path     # Specific test file (yarn test defaults to --watch — avoid in agents)
yarn jest --no-watch -t "x"   # By name pattern
yarn test -u                  # Update snapshots
yarn lint / yarn lint:fix     # ESLint
yarn typecheck                # TypeScript
yarn prettier:write           # Format
yarn i18n-extract             # After adding user-facing strings
```

## Architecture

| Directory              | Purpose                                                |
| ---------------------- | ------------------------------------------------------ |
| `public/app/core/`     | Shared services, components, utilities                 |
| `public/app/features/` | Feature code by domain (dashboard, alerting, explore)  |
| `public/app/plugins/`  | Built-in plugins (many are Yarn workspaces)            |
| `public/app/types/`    | TypeScript type definitions                            |
| `public/app/store/`    | Redux store configuration                              |

## Patterns

- Function components with hooks; Redux Toolkit slices ([`contribute/style-guides/redux.md`](../../contribute/style-guides/redux.md)); RTK Query for data fetching ([`contribute/architecture/frontend-data-requests.md`](../../contribute/architecture/frontend-data-requests.md)).
- Emotion CSS-in-JS via `useStyles2` — see [`styling.md`](../../contribute/style-guides/styling.md) and [`themes.md`](../../contribute/style-guides/themes.md).
- React Testing Library — see [`testing.md`](../../contribute/style-guides/testing.md). Accessibility: [`accessibility.md`](../../contribute/style-guides/accessibility.md).
- User-facing strings must be internationalized — see [`contribute/internationalization.md`](../../contribute/internationalization.md).

## Gotchas

- Some built-in plugins are separate Yarn workspaces with their own build (`azuremonitor`, `loki`, `tempo`, `mysql`, `grafana-testdata-datasource`, …): `yarn workspace @grafana-plugins/<name> dev`.
- Alerting work: read [`public/app/features/alerting/unified/AGENTS.md`](features/alerting/unified/AGENTS.md) first.
- Shared code that plugins may need belongs in `packages/` (`@grafana/*`), not here — see [`packages/AGENTS.md`](../../packages/AGENTS.md).
