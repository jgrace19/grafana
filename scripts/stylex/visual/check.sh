#!/usr/bin/env bash
# Visual parity check for a StyleX migration slice (plan §4.5): capture the current checkout with the
# same harness as the baseline, then diff it against the baseline in the default migration mode.
#
#   scripts/stylex/visual/check.sh <slice-id> [capture.mjs args, e.g. --suites storybook --only 'button']
#
# Env: STYLEX_BASELINE  baseline dir with manifest.json (default: the project store's media/baseline)
#      STYLEX_DIFF_OUT  report dir (default: the project store's media/visual-diff/<slice-id>)
#      STYLEX_DIFF_ONLY regex on manifest entry ids; required with a partial capture, since entries
#                       missing from the candidate fail the diff
#      plus the harness env (VB_GRAFANA_PORT, VB_STORYBOOK_PORT, VB_RUN_DIR, GRAFANA_BIN).
# Prereqs: see README.md in this directory (backend binary, production frontend build, Storybook build).
set -euo pipefail

SLICE="${1:?usage: check.sh <slice-id> [capture args]}"
shift
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "${HERE}/../../.." && pwd)"
STORE=/cursor/stores/bc-c3fd39a0-f191-4bfb-87f3-1ee7d277ef91
BASELINE="${STYLEX_BASELINE:-${STORE}/media/baseline}"
OUT="${STYLEX_DIFF_OUT:-${STORE}/media/visual-diff/${SLICE}}"
CANDIDATE="$(mktemp -d)/candidate"

[[ -f "${BASELINE}/manifest.json" ]] || { echo "no baseline manifest at ${BASELINE}" >&2; exit 2; }

REPO="${REPO}" bash "${HERE}/scripts/run-capture.sh" "${CANDIDATE}" "$@"

DIFF_ARGS=(--baseline "${BASELINE}" --candidate "${CANDIDATE}" --out "${OUT}" --repo "${REPO}")
if [[ -n "${STYLEX_DIFF_ONLY:-}" ]]; then
  DIFF_ARGS+=(--only "${STYLEX_DIFF_ONLY}")
fi
node "${HERE}/scripts/diff.mjs" "${DIFF_ARGS[@]}"
