#!/usr/bin/env bash
# Start a throwaway Grafana for visual captures: prebuilt backend binary + prebuilt
# production frontend (public/build), brand-new SQLite DB, baseline provisioning,
# then seed users/orgs via the API. Every invocation wipes the previous run dir so
# captures always start from identical server state.
#
#   REPO=/workspace bash scripts/start-grafana.sh
#
# Env: REPO (default /workspace), VB_GRAFANA_PORT (3300), VB_RUN_DIR (/tmp/vb-grafana),
#      GRAFANA_BIN (default $REPO/bin/grafana)
set -euo pipefail

VB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO="${REPO:-/workspace}"
PORT="${VB_GRAFANA_PORT:-3300}"
RUN_DIR="${VB_RUN_DIR:-/tmp/vb-grafana}"
BIN="${GRAFANA_BIN:-${REPO}/bin/grafana}"
URL="http://127.0.0.1:${PORT}"

[[ -x "${BIN}" ]] || { echo "missing backend binary ${BIN} (run: make build-backend)" >&2; exit 1; }
[[ -f "${REPO}/public/build/assets-manifest.json" ]] || {
  echo "missing ${REPO}/public/build (build the frontend first, see README)" >&2
  exit 1
}

if [[ -f "${RUN_DIR}/grafana.pid" ]] && kill -0 "$(cat "${RUN_DIR}/grafana.pid")" 2>/dev/null; then
  bash "${VB_DIR}/scripts/stop-grafana.sh"
fi
if curl -fsS "${URL}/api/health" >/dev/null 2>&1; then
  echo "port ${PORT} already serves something; stop it or set VB_GRAFANA_PORT" >&2
  exit 1
fi

rm -rf "${RUN_DIR}"
mkdir -p "${RUN_DIR}/data" "${RUN_DIR}/logs" "${RUN_DIR}/plugins"

export GF_SERVER_HTTP_PORT="${PORT}"
export GF_PATHS_DATA="${RUN_DIR}/data"
export GF_PATHS_LOGS="${RUN_DIR}/logs"
export GF_PATHS_PLUGINS="${RUN_DIR}/plugins"
export GF_PATHS_PROVISIONING="${VB_DIR}/provisioning"
export VB_DASHBOARDS_DIR="${VB_DIR}/provisioning/dashboards/json"
export GF_DIAGNOSTICS_PROFILING_ENABLED=false

nohup "${BIN}" server --homepath "${REPO}" --config "${VB_DIR}/conf/custom.ini" \
  >"${RUN_DIR}/grafana.log" 2>&1 &
echo $! >"${RUN_DIR}/grafana.pid"

for _ in $(seq 1 180); do
  if curl -fsS "${URL}/api/health" >/dev/null 2>&1; then
    break
  fi
  if ! kill -0 "$(cat "${RUN_DIR}/grafana.pid")" 2>/dev/null; then
    echo "grafana exited early:" >&2
    tail -n 50 "${RUN_DIR}/grafana.log" >&2
    exit 1
  fi
  sleep 1
done
curl -fsS "${URL}/api/health" >/dev/null || { echo "grafana never became healthy" >&2; exit 1; }

# Provisioning finishes asynchronously after /api/health turns green.
for _ in $(seq 1 60); do
  n="$(curl -fsS -u admin:admin "${URL}/api/search?type=dash-db&query=" | grep -o '"uid":"vb-' | wc -l || true)"
  [[ "${n}" -ge 3 ]] && break
  sleep 1
done

bash "${VB_DIR}/scripts/seed.sh" "${URL}"
echo "grafana ready at ${URL} (pid $(cat "${RUN_DIR}/grafana.pid"), log ${RUN_DIR}/grafana.log)"
