#!/usr/bin/env bash
# One full capture run: fresh Grafana (new DB + seed), static Storybook, then capture.mjs.
#
#   REPO=/workspace bash scripts/run-capture.sh <out-dir> [extra capture.mjs args...]
#
# Prereqs (see README): Node 24 on PATH, `make build-backend`, production frontend build
# in public/build, `yarn storybook:build` output in packages/grafana-ui/dist/storybook.
set -euo pipefail
VB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO="${REPO:-/workspace}"
OUT="${1:?usage: run-capture.sh <out-dir> [capture args]}"
shift
SB_PORT="${VB_STORYBOOK_PORT:-9009}"
SB_DIR="${REPO}/packages/grafana-ui/dist/storybook"

REPO="${REPO}" bash "${VB_DIR}/scripts/start-grafana.sh"

SB_PID=""
if ! curl -fsS "http://127.0.0.1:${SB_PORT}/index.json" >/dev/null 2>&1; then
  [[ -f "${SB_DIR}/index.json" ]] || { echo "missing ${SB_DIR} (run: yarn storybook:build)" >&2; exit 1; }
  node "${VB_DIR}/scripts/serve-static.mjs" "${SB_DIR}" "${SB_PORT}" >/tmp/vb-storybook-server.log 2>&1 &
  SB_PID=$!
  trap '[[ -n "${SB_PID}" ]] && kill "${SB_PID}" 2>/dev/null || true' EXIT
  for _ in $(seq 1 30); do
    curl -fsS "http://127.0.0.1:${SB_PORT}/index.json" >/dev/null 2>&1 && break
    sleep 0.5
  done
fi

rm -rf "${OUT}"
node "${VB_DIR}/scripts/capture.mjs" --repo "${REPO}" --out "${OUT}" \
  --grafana "http://127.0.0.1:${VB_GRAFANA_PORT:-3300}" --storybook "http://127.0.0.1:${SB_PORT}" "$@"
