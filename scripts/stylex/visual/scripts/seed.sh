#!/usr/bin/env bash
# Seed state that file provisioning cannot express (users, extra org, team).
# Must run against a fresh DB (start-grafana.sh does this) so IDs/order are stable.
set -euo pipefail
URL="${1:-http://127.0.0.1:3300}"
AUTH=(-u admin:admin -H 'Content-Type: application/json')

post() {
  curl -fsS "${AUTH[@]}" -X POST "${URL}$1" -d "$2" >/dev/null
}

post /api/admin/users '{"name":"Alice Baseline","email":"alice@example.com","login":"alice","password":"baseline-alice-1"}'
post /api/admin/users '{"name":"Bob Viewer","email":"bob@example.com","login":"bob","password":"baseline-bob-1"}'
post /api/admin/users '{"name":"Carol Editor","email":"carol@example.com","login":"carol","password":"baseline-carol-1"}'
post /api/orgs '{"name":"Baseline Org Two"}'
post /api/teams '{"name":"Platform","email":"platform@example.com"}'
post /api/teams '{"name":"Checkout"}'
echo "seeded users/orgs/teams"
