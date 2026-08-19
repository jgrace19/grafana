#!/usr/bin/env bash
# Cloud Agent backend terminal: Grafana backend with hot reload (air) on :3000.
# Login: admin / admin.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=.cursor/scripts/lib-node.sh
source "${SCRIPT_DIR}/lib-node.sh"

# Disable pprof so it doesn't bind :6000 if another local Grafana is running.
export GF_DIAGNOSTICS_PROFILING_ENABLED=false

exec make run
