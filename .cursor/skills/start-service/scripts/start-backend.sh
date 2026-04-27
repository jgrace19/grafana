#!/usr/bin/env bash

set -euo pipefail

PREFERRED_PORT="${1:-3000}"
MAX_PORT=3099

is_port_free() {
  local port="$1"
  ! lsof -nP -iTCP:"${port}" -sTCP:LISTEN >/dev/null 2>&1
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

if ! command -v make >/dev/null 2>&1; then
  echo "Error: make is required but not found in PATH."
  exit 1
fi

PORT="$(pick_port "${PREFERRED_PORT}")" || {
  echo "Error: no free port found in range ${PREFERRED_PORT}-${MAX_PORT}."
  exit 1
}

if [[ "${PORT}" != "${PREFERRED_PORT}" ]]; then
  echo "Port ${PREFERRED_PORT} is busy; using ${PORT} instead."
fi

echo "Starting Grafana with hot reload on http://localhost:${PORT}"
echo "Login: admin / admin"

exec env \
  GF_SERVER_HTTP_PORT="${PORT}" \
  GF_DIAGNOSTICS_PROFILING_ENABLED=false \
  make run
