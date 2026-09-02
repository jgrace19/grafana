#!/usr/bin/env bash
# Cloud Agent install: idempotent dependency refresh + build-cache warmup.
# Runs after the repository is checked out. Safe to run repeatedly.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=.cursor/scripts/lib-node.sh
source "${SCRIPT_DIR}/lib-node.sh"

echo "== Toolchain =="
echo "node: $(node --version)"
echo "yarn: $(yarn --version)"
echo "go:   $(go version)"

echo "== Installing frontend dependencies =="
yarn install --immutable

# Warm the Go build/module caches so the first `make run` (air) rebuild at
# boot is incremental rather than a full ~2.5 min cold compile.
echo "== Building backend (warms Go build cache) =="
make build-backend
