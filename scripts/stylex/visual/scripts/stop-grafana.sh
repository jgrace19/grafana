#!/usr/bin/env bash
set -euo pipefail
RUN_DIR="${VB_RUN_DIR:-/tmp/vb-grafana}"
PID_FILE="${RUN_DIR}/grafana.pid"
[[ -f "${PID_FILE}" ]] || exit 0
PID="$(cat "${PID_FILE}")"
if kill -0 "${PID}" 2>/dev/null; then
  kill -TERM "${PID}"
  for _ in $(seq 1 30); do
    kill -0 "${PID}" 2>/dev/null || break
    sleep 1
  done
fi
rm -f "${PID_FILE}"
