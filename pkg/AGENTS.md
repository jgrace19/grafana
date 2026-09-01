# AGENTS.md — Go backend

This file is loaded when agents work under `pkg/`. Keep it lean: commands, invariants, and gotchas belong here; mechanics live in [`contribute/backend/`](../contribute/backend/README.md) (services, database, errors, instrumentation, package hierarchy) and [`contribute/backend/style-guide.md`](../contribute/backend/style-guide.md).

## Commands

```bash
make run                                           # Run with hot reload (localhost:3000, admin/admin)
make build-backend                                 # Build only
go test -run TestName ./pkg/services/myservice/   # Specific test (prefer targeted runs)
make test-go-unit                                  # All unit tests
make test-go-integration                           # Integration tests
make lint-go                                       # Linter
```

Code generation (run after the corresponding change):

```bash
make gen-go                # Wire DI — after changing service init
make gen-cue               # CUE schemas — after changing kinds/ (generates Go and TS)
make swagger-gen           # OpenAPI specs — after changing HTTP API
make gen-feature-toggles   # After editing pkg/services/featuremgmt/
make update-workspace      # After adding Go modules (go.work)
```

## Architecture

| Directory         | Purpose                                                      |
| ----------------- | ------------------------------------------------------------ |
| `pkg/api/`        | HTTP API handlers and routes                                 |
| `pkg/services/`   | Business logic by domain (alerting, dashboards, auth, etc.)  |
| `pkg/server/`     | Server init and Wire DI setup (`wire.go`)                    |
| `pkg/tsdb/`       | Time series database query backends                          |
| `pkg/plugins/`    | Plugin system and loader                                     |
| `pkg/infra/`      | Logging, metrics, database access                            |
| `pkg/middleware/` | HTTP middleware                                              |
| `pkg/setting/`    | Configuration management                                     |

Deeper reading: [`contribute/backend/services.md`](../contribute/backend/services.md), [`contribute/backend/package-hierarchy.md`](../contribute/backend/package-hierarchy.md), [`contribute/architecture/`](../contribute/architecture/README.md).

## Key notes

- **Wire DI**: service init changes require `make gen-go`; Wire catches circular deps at compile time.
- Business logic lives in `pkg/services/<domain>/`, not in API handlers. Database access via `sqlstore` — see [`contribute/backend/database.md`](../contribute/backend/database.md).
- **Migrations**: `pkg/services/sqlstore/migrations/`. Test with `make devenv sources=postgres_tests,mysql_tests` then `make test-go-integration-postgres`.
- **Build tags**: `oss` (default), `enterprise`, `pro`. Config defaults in `conf/defaults.ini`, overrides in `conf/custom.ini`.
- **Slow test compilation** in some packages (e.g. `pkg/api/`, ~2 min): use targeted `-run TestName` runs.
- CI shards backend tests via `SHARD`/`SHARDS` env vars.
