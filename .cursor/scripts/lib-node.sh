#!/usr/bin/env bash
# Shared helper for Cloud Agent scripts: make the Node version pinned in
# .nvmrc the active `node`/`yarn` on PATH.
#
# The Cloud Agent base image ships a daemon Node on PATH (via /exec-daemon)
# that shadows nvm. Grafana pins Node in .nvmrc (currently v24.x), so we
# install that version with nvm and prepend its bin dir ahead of everything
# else. Sourced by install.sh, backend.sh, and frontend.sh.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "${REPO_ROOT}"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck disable=SC1091
[ -s "${NVM_DIR}/nvm.sh" ] && . "${NVM_DIR}/nvm.sh"

# Install (idempotent) the version from .nvmrc; nvm reuses it if already present.
nvm install >/dev/null

NODE_VERSION="$(tr -d '[:space:]' < "${REPO_ROOT}/.nvmrc")"
export PATH="${NVM_DIR}/versions/node/${NODE_VERSION}/bin:${PATH}"

# Yarn 4 is provided via corepack (pinned by package.json packageManager).
corepack enable >/dev/null 2>&1 || true
