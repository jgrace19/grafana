# AGENTS.md — Shared `@grafana/*` packages

This file is loaded when agents work under `packages/`. These packages are published to npm and consumed by Grafana core **and external plugins** — treat their public APIs as contracts. Mechanics (exports conventions, versioning, releases, local registry): [`README.md`](README.md).

## Key packages

`@grafana/data` (data structures), `@grafana/ui` (components), `@grafana/runtime` (runtime services), `@grafana/schema` (CUE-generated types — regenerate via `make gen-cue`, don't hand-edit generated files), `@grafana/e2e-selectors` (selectors shared with e2e tests).

## Commands

```bash
yarn nx build @grafana/<name>          # Build one package (yarn packages:build for all)
yarn jest --no-watch packages/<name>   # Tests
yarn typecheck && yarn lint            # Checks
```

## Invariants

- **Exports**: every entrypoint must list the `@grafana-app/source` custom condition first so in-repo tooling resolves source without prebuilding — see [`README.md`](README.md) for the exact shape and the `./` vs `./unstable` vs `./internal` conventions.
- **Breaking changes** to public APIs affect the plugin ecosystem: follow the [breaking changes guide](../contribute/breaking-changes-guide/breaking-changes-guide.md) and prefer `./unstable` for experimental APIs.
- Versioning is Lerna-driven off the Grafana version; never bump versions manually in a feature PR.
- `@grafana/ui` components need Storybook coverage — see [`contribute/style-guides/storybook.md`](../contribute/style-guides/storybook.md).
