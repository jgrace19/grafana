# AGENTS.md — App SDK backend apps

This file is loaded when agents work under `apps/`. Each app (`dashboard/`, `folder/`, the apps under `alerting/`, …) is a standalone Go module built on the [Grafana App SDK](https://github.com/grafana/grafana-app-sdk), following Kubernetes-style API patterns — see [`contribute/architecture/k8s-inspired-backend-arch.md`](../contribute/architecture/k8s-inspired-backend-arch.md).

## Layout and workflow

- Each app has its own `go.mod`, a `kinds/` directory (CUE resource definitions), and generated code under `pkg/`.
- After editing an app's `kinds/`, regenerate with `make gen-apps` from the repo root. Never hand-edit generated code.
- The SDK version is pinned in [`sdk.mk`](sdk.mk); per-app Makefiles include it.
- Adding a Go module here requires `make update-workspace` from the repo root (updates `go.work`).

## Testing

```bash
go test ./apps/<name>/...
```

General backend conventions apply — see [`pkg/AGENTS.md`](../pkg/AGENTS.md) and [`contribute/backend/`](../contribute/backend/README.md).
