#!/usr/bin/env bash
# Runs the Emotion→StyleX verify gate (.cursor/skills/emotion-to-stylex/SKILL.md) for a batch and appends the
# command, exit code and last 40 log lines of each step to docs/agent-runs/emotion-to-stylex/VERIFY.md.
#
# Usage: scripts/stylex/verify-gate.sh "<batch label>" <path>...
# Env:   RG_EXCLUDE  optional space-separated globs excluded from the residual-Emotion scan (e.g. '*.test.tsx')
set -uo pipefail

label=$1
shift
paths=("$@")
root=$(git rev-parse --show-toplevel)
out="$root/docs/agent-runs/emotion-to-stylex/VERIFY.md"
mkdir -p "$(dirname "$out")"
failed=0

rg_args=(-n "@emotion/css|@emotion/react" -g '*.{ts,tsx}')
for glob in ${RG_EXCLUDE:-}; do
  rg_args+=(-g "!$glob")
done

{
  echo
  echo "## ${label}"
  echo
  echo "- Date (UTC): $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "- Base commit: \`$(git -C "$root" rev-parse --short HEAD)\` plus working tree"
  echo "- Paths: $(printf '`%s` ' "${paths[@]}")"
} >>"$out"

# step <title> <pass-exit-code> <command...>
step() {
  local title=$1 pass_code=$2
  shift 2
  local log
  log=$(mktemp)
  (cd "$root" && "$@") >"$log" 2>&1
  local code=$?
  local verdict=PASS
  if [[ $code -ne $pass_code ]]; then
    verdict=FAIL
    failed=1
  fi
  {
    echo
    echo "### ${title}: ${verdict}"
    echo
    echo "\`\`\`sh"
    printf '%q ' "$@"
    echo
    echo "\`\`\`"
    echo
    echo "Exit code: ${code} (pass = ${pass_code})"
    echo
    echo "\`\`\`text"
    sed -e 's/\x1b\[[0-9;]*m//g' "$log" | tail -n 40
    echo "\`\`\`"
  } >>"$out"
  echo "[${verdict}] ${title} (exit ${code})"
  rm -f "$log"
}

# rg exits 1 when nothing matches, which is the passing state for the residual-Emotion scan.
step "Residual Emotion imports" 1 rg "${rg_args[@]}" "${paths[@]}"
step "Unit tests" 0 yarn jest --no-watch "${paths[@]}"
step "@grafana/ui typecheck" 0 yarn workspace @grafana/ui typecheck
step "ESLint" 0 yarn eslint --cache "${paths[@]}"

exit $failed
