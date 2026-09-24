#!/usr/bin/env bash
# Visual parity check for a StyleX migration slice (plan §4.5): capture the current checkout with the
# same harness as the baseline, then diff it against the baseline twice:
#   1. default mode (threshold 0.1, includeAA false, <= 0.1% px per image): the pass/fail bar, sets the exit code;
#   2. strict mode (threshold 0, includeAA true, 0 px): mandatory; every entry it reports must be fixed or
#      justified in the PR with its diff image attached.
#
#   scripts/stylex/visual/check.sh <slice-id> [capture.mjs args, e.g. --suites storybook --only 'button']
#
# Env: STYLEX_BASELINE  baseline dir with manifest.json (default: the project store's media/baseline)
#      STYLEX_DIFF_OUT  report dir (default: the project store's media/visual-diff/<slice-id>); the strict
#                       report goes to <report dir>/strict
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
set +e
node "${HERE}/scripts/diff.mjs" "${DIFF_ARGS[@]}"
DEFAULT_STATUS=$?
STRICT_ARGS=("${DIFF_ARGS[@]}")
STRICT_ARGS[5]="${OUT}/strict"
node "${HERE}/scripts/diff.mjs" "${STRICT_ARGS[@]}" --strict
STRICT_STATUS=$?
set -e

echo
echo "default mode (pass/fail bar): $([[ ${DEFAULT_STATUS} == 0 ]] && echo PASS || echo FAIL) -> ${OUT}/summary.md"
echo "strict mode (mandatory review): $([[ ${STRICT_STATUS} == 0 ]] && echo '0 px' || echo 'differences: fix or justify each in the PR, with its diff image') -> ${OUT}/strict/summary.md"
exit "${DEFAULT_STATUS}"
