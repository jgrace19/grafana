#!/usr/bin/env bash

# Seed a local Grafana with a "Local Testdata Overview" dashboard backed by the
# bundled grafana-testdata-datasource (random walk).
#
# Usage:
#   bash .cursor/skills/start-service/scripts/seed-testdata-dashboard.sh [BASE_URL]
#
# Env:
#   GRAFANA_USER (default: admin)
#   GRAFANA_PASS (default: admin)

set -euo pipefail

BASE_URL="${1:-http://localhost:3000}"
USER="${GRAFANA_USER:-admin}"
PASS="${GRAFANA_PASS:-admin}"

healthcheck() {
  curl -fsS -u "${USER}:${PASS}" "${BASE_URL}/api/health" >/dev/null
}

echo -n "Checking ${BASE_URL}/api/health"
for _ in $(seq 1 60); do
  if healthcheck; then
    echo " — ok."
    break
  fi
  echo -n "."
  sleep 1
done

if ! healthcheck; then
  echo
  echo "Error: Grafana is not reachable at ${BASE_URL} with ${USER}/${PASS}." >&2
  echo "Start Grafana first (start-dev.sh), then retry." >&2
  exit 1
fi

DS_NAME="TestData DB"
DS_TYPE="grafana-testdata-datasource"

# Look up the datasource by name. If it doesn't exist, create it via API so
# the seeded dashboard's panel actually has a backing datasource and won't
# show "Failed to load datasource" errors on first load.
get_ds_uid() {
  curl -sS -u "${USER}:${PASS}" "${BASE_URL}/api/datasources/name/${DS_NAME// /%20}" \
    | python3 -c '
import json, sys
raw = sys.stdin.read().strip()
try:
    data = json.loads(raw) if raw else {}
except Exception:
    data = {}
print(data.get("uid", ""))
'
}

DATASOURCE_UID="$(get_ds_uid || true)"

if [[ -z "${DATASOURCE_UID}" ]]; then
  echo "Creating local testdata datasource '${DS_NAME}'..."
  curl -sS -u "${USER}:${PASS}" \
    -H "Content-Type: application/json" \
    -X POST \
    "${BASE_URL}/api/datasources" \
    --data-binary @- <<JSON >/dev/null || true
{
  "name": "${DS_NAME}",
  "type": "${DS_TYPE}",
  "access": "proxy",
  "isDefault": true
}
JSON
  DATASOURCE_UID="$(get_ds_uid || true)"
fi

if [[ -z "${DATASOURCE_UID}" ]]; then
  echo "Warning: could not resolve a UID for ${DS_NAME}; falling back to type slug." >&2
  DATASOURCE_UID="${DS_TYPE}"
fi

echo "Seeding dashboard into ${BASE_URL} (datasource uid: ${DATASOURCE_UID})..."

curl -fsS -u "${USER}:${PASS}" \
  -H "Content-Type: application/json" \
  -X POST \
  "${BASE_URL}/api/dashboards/db" \
  --data-binary @- <<JSON
{
  "dashboard": {
    "id": null,
    "uid": "local-testdata-overview",
    "title": "Local Testdata Overview",
    "tags": ["local", "seed", "testdata"],
    "timezone": "browser",
    "schemaVersion": 41,
    "version": 0,
    "refresh": "5s",
    "time": {
      "from": "now-6h",
      "to": "now"
    },
    "panels": [
      {
        "id": 1,
        "type": "timeseries",
        "title": "Random Walk",
        "datasource": {
          "type": "grafana-testdata-datasource",
          "uid": "${DATASOURCE_UID}"
        },
        "gridPos": { "h": 9, "w": 24, "x": 0, "y": 0 },
        "targets": [
          {
            "refId": "A",
            "scenarioId": "random_walk",
            "datasource": {
              "type": "grafana-testdata-datasource",
              "uid": "${DATASOURCE_UID}"
            }
          }
        ],
        "fieldConfig": { "defaults": {}, "overrides": [] },
        "options": {
          "legend": { "displayMode": "list", "placement": "bottom", "showLegend": true },
          "tooltip": { "mode": "single", "sort": "none" }
        }
      }
    ]
  },
  "folderId": 0,
  "overwrite": true,
  "message": "Seed local dashboard with testdata random walk panel"
}
JSON

echo
echo "Seed complete."
echo "Open: ${BASE_URL}/d/local-testdata-overview/local-testdata-overview"
