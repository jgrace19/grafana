#!/usr/bin/env bash
# Zero-Emotion check for the StyleX migration.
#
#   scripts/stylex/check-emotion.sh [path ...]
#
# With no arguments it checks the whole migration scope (packages/grafana-ui/src public/app). Pass a
# slice's files or directories to check just that slice. Prints offending files and exits 1 when any of
# the three checks match outside scripts/stylex/emotion-allowlist.txt.
set -euo pipefail

cd "$(dirname "$0")/../.."

if ! command -v rg >/dev/null; then
  echo "check-emotion.sh needs ripgrep (rg) on PATH" >&2
  exit 2
fi

ALLOW=scripts/stylex/emotion-allowlist.txt
if [ "$#" -gt 0 ]; then
  SCOPE=("$@")
else
  SCOPE=(packages/grafana-ui/src public/app)
fi

status=0

# Every allowlist entry needs a reason.
while IFS= read -r line; do
  [[ -z "${line// /}" || "$line" =~ ^[[:space:]]*# ]] && continue
  if [[ "$line" != *"#"* ]]; then
    echo "emotion-allowlist: entry without a '# reason': $line" >&2
    status=1
  fi
done <"$ALLOW"

G=(--glob '*.{ts,tsx}' --glob '!**/node_modules/**' --glob '!**/dist/**')
while IFS= read -r glob; do
  G+=(--glob "!$glob")
done < <(sed -e 's/[[:space:]]*#.*//' -e '/^[[:space:]]*$/d' "$ALLOW")

check() {
  local label="$1" pattern="$2" files
  files=$(rg -l "${G[@]}" -e "$pattern" "${SCOPE[@]}" 2>/dev/null | sort || true)
  if [ -n "$files" ]; then
    echo "✗ $label ($(printf '%s\n' "$files" | wc -l | tr -d ' ') files)"
    printf '%s\n' "$files" | sed 's/^/  /'
    status=1
  else
    echo "✓ $label"
  fi
}

check 'imports @emotion/*' '@emotion/'
check 'calls useStyles/useStyles2/stylesFactory/withTheme/withTheme2' '\b(useStyles2?|stylesFactory|withTheme2?)\('
check 'defines a getStyles(theme) factory' 'get[A-Za-z]*Styles\s*=\s*\(\s*theme'

exit $status
