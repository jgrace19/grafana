#!/usr/bin/env bash
# Cloud Agent frontend terminal: webpack dev server (watch mode).
# The backend proxies to these assets; first compile takes ~45s.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=.cursor/scripts/lib-node.sh
source "${SCRIPT_DIR}/lib-node.sh"

exec yarn start
