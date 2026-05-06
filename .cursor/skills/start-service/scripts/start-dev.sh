#!/usr/bin/env bash

# Start the full Grafana dev stack: backend (Go, hot reload) + frontend
# (yarn start:liveReload = webpack --watch + LiveReload) + optional seeded
# dashboard. Picks a free HTTP port starting at 3000, disables pprof to avoid
# port 6000 conflicts, and waits for the first frontend webpack compile to
# finish writing public/build before exiting so the UI is actually loadable.
#
# Usage:
#   bash .cursor/skills/start-service/scripts/start-dev.sh            # start backend + frontend + seed
#   bash .cursor/skills/start-service/scripts/start-dev.sh --no-seed  # skip dashboard seed
#   bash .cursor/skills/start-service/scripts/start-dev.sh --port 3010
#
# Logs:
#   /tmp/grafana-dev/backend.log
#   /tmp/grafana-dev/frontend.log

set -u
# Note: we intentionally do NOT use `set -e` or `set -o pipefail`. The
# readiness polling loops rely on commands like `curl`, `grep -q`, and
# pipelines with `head -1` that can return non-zero (or SIGPIPE) under normal
# operation. Each branch checks return codes explicitly.

PREFERRED_PORT=3000
MAX_PORT=3099
SEED=1

while [[ $# -gt 0 ]]; do
  case "$1" in
    --port)
      PREFERRED_PORT="$2"
      shift 2
      ;;
    --no-seed)
      SEED=0
      shift
      ;;
    -h|--help)
      sed -n '3,16p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 2
      ;;
  esac
done

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "${REPO_ROOT}"

# Align Node with .nvmrc when nvm is installed (avoids wrong webpack/toolchain).
use_repo_node_version() {
  local nvm_sh=""
  if [[ -n "${NVM_DIR:-}" && -f "${NVM_DIR}/nvm.sh" ]]; then
    nvm_sh="${NVM_DIR}/nvm.sh"
  elif [[ -f "${HOME}/.nvm/nvm.sh" ]]; then
    nvm_sh="${HOME}/.nvm/nvm.sh"
  fi
  if [[ -n "${nvm_sh}" && -f "${REPO_ROOT}/.nvmrc" ]]; then
    # shellcheck source=/dev/null
    source "${nvm_sh}"
    nvm use 2>/dev/null || true
  fi
  if [[ -f "${REPO_ROOT}/.nvmrc" ]]; then
    local want got
    want="$(sed 's/^v//' "${REPO_ROOT}/.nvmrc")"
    got="$(node --version 2>/dev/null | sed 's/^v//')"
    if [[ -n "${got}" && "${got}" != "${want}" ]]; then
      echo "Warning: Node.js v${got} is active; this repo targets v${want} (.nvmrc). Run: cd ${REPO_ROOT} && nvm use" >&2
    fi
  fi
}

use_repo_node_version

LOG_DIR="/tmp/grafana-dev"
mkdir -p "${LOG_DIR}"
BACKEND_LOG="${LOG_DIR}/backend.log"
FRONTEND_LOG="${LOG_DIR}/frontend.log"

is_port_free() {
  ! lsof -nP -iTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1
}

pick_port() {
  local start_port="$1"
  if is_port_free "${start_port}"; then
    echo "${start_port}"
    return 0
  fi
  local port
  for ((port = start_port + 1; port <= MAX_PORT; port++)); do
    if is_port_free "${port}"; then
      echo "${port}"
      return 0
    fi
  done
  return 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || { echo "Error: $1 is required but not found in PATH." >&2; exit 1; }
}

require_cmd make
require_cmd yarn
require_cmd lsof
require_cmd curl

PORT="$(pick_port "${PREFERRED_PORT}")" || {
  echo "Error: no free port found in range ${PREFERRED_PORT}-${MAX_PORT}." >&2
  exit 1
}

if [[ "${PORT}" != "${PREFERRED_PORT}" ]]; then
  echo "Port ${PREFERRED_PORT} is busy; using ${PORT} instead."
fi

BASE_URL="http://localhost:${PORT}"

# node_modules guard for fresh worktrees
if [[ ! -d node_modules ]] || [[ ! -f node_modules/.yarn-state.yml && ! -f node_modules/.package-lock.json ]]; then
  echo "Installing frontend dependencies (yarn install --immutable)..."
  yarn install --immutable
fi

kill_descendants() {
  local pid="$1"
  [[ -z "${pid}" ]] && return 0
  local kids
  kids="$(pgrep -P "${pid}" 2>/dev/null || true)"
  for kid in ${kids}; do
    kill_descendants "${kid}"
  done
  kill -TERM "${pid}" 2>/dev/null || true
}

cleanup() {
  local code=$?
  trap - INT TERM EXIT
  kill_descendants "${BACKEND_PID:-}"
  kill_descendants "${FRONTEND_PID:-}"
  exit "${code}"
}
trap cleanup INT TERM EXIT

echo "Starting frontend (yarn start:liveReload — webpack watch + LiveReload) — logs: ${FRONTEND_LOG}"
: > "${FRONTEND_LOG}"
# start:liveReload runs the same dev webpack as yarn start but passes
# --env liveReload=1 so webpack-livereload-plugin injects the client; the
# browser reloads after each successful compile (localhost:35750).
( yarn start:liveReload ) >>"${FRONTEND_LOG}" 2>&1 &
FRONTEND_PID=$!

echo "Starting backend (make run, hot reload) on ${BASE_URL} — logs: ${BACKEND_LOG}"
: > "${BACKEND_LOG}"
(
  GF_SERVER_HTTP_PORT="${PORT}" \
  GF_DIAGNOSTICS_PROFILING_ENABLED=false \
  make run
) >>"${BACKEND_LOG}" 2>&1 &
BACKEND_PID=$!

log() { printf '%s\n' "$*" 2>/dev/null || true; }

# Wait for the backend to answer /api/health.
log "Waiting for backend health on ${BASE_URL} (up to 120s)..."
backend_ready=0
for _ in $(seq 1 120); do
  if curl -fsS -u admin:admin "${BASE_URL}/api/health" >/dev/null 2>&1; then
    backend_ready=1
    break
  fi
  if ! kill -0 "${BACKEND_PID}" 2>/dev/null; then
    log "Backend exited early. Last 60 lines of ${BACKEND_LOG}:"
    tail -n 60 "${BACKEND_LOG}" 2>/dev/null || true
    exit 1
  fi
  sleep 1
done
if [[ "${backend_ready}" != "1" ]]; then
  log "Backend never became healthy. See ${BACKEND_LOG}."
  exit 1
fi
log "Backend ready at ${BASE_URL}."

# Wait for the frontend's first webpack compile to write public/build assets.
# This is what prevents the "Grafana has failed to load its application files"
# page: until webpack writes app.<hash>.js and assets-manifest.json, the
# backend serves index.html with chunk URLs that don't exist on disk.
log "Waiting for frontend first compile to write public/build (up to 20 min)..."
frontend_ready=0
for _ in $(seq 1 600); do
  if [[ -f public/build/assets-manifest.json ]] \
     && grep -qE "(grafana:start|webpack [0-9.]+ compiled (successfully|with))" "${FRONTEND_LOG}" 2>/dev/null; then
    sample_js="$(grep -oE '"src":[[:space:]]*"public/build/[^"]+\.js"' public/build/assets-manifest.json 2>/dev/null | head -1 | sed -E 's/.*"(public[^"]+)".*/\1/')"
    if [[ -n "${sample_js}" && -f "${sample_js}" ]]; then
      frontend_ready=1
      break
    fi
  fi
  if ! kill -0 "${FRONTEND_PID}" 2>/dev/null; then
    log "Frontend exited early. Last 80 lines of ${FRONTEND_LOG}:"
    tail -n 80 "${FRONTEND_LOG}" 2>/dev/null || true
    exit 1
  fi
  sleep 2
done
if [[ "${frontend_ready}" != "1" ]]; then
  log "Frontend first compile timed out. See ${FRONTEND_LOG}."
  exit 1
fi
log "Frontend assets written; UI is loadable."

if [[ "${SEED}" == "1" ]]; then
  echo "Seeding local testdata dashboard..."
  bash "$(dirname "$0")/seed-testdata-dashboard.sh" "${BASE_URL}" || {
    echo "Warning: seed step failed; UI is still up." >&2
  }
fi

cat <<EOF

Grafana dev stack is up.

  URL:        ${BASE_URL}
  Login:      admin / admin
  Backend:    ${BACKEND_LOG}    (pid ${BACKEND_PID})
  Frontend:   ${FRONTEND_LOG}   (pid ${FRONTEND_PID})

If seeded, open:
  ${BASE_URL}/d/local-testdata-overview/local-testdata-overview

Press Ctrl-C to stop both processes.
EOF

# Keep this script alive so Ctrl-C stops both children via the trap.
wait
