#!/usr/bin/env bash
# Scan for raw console.* calls in Grafana frontend production paths.
# Excludes tests, Storybook, scripts, and known intentional wrappers.
set -euo pipefail

ROOT="${1:-.}"
SCOPE="${2:-app}" # app | packages | all

GLOBS=(
  '--glob' '*.{ts,tsx}'
  '--glob' '!*.test.ts'
  '--glob' '!*.test.tsx'
  '--glob' '!*.story.tsx'
  '--glob' '!**/public/test/**'
  '--glob' '!**/scripts/**'
)

PATHS=()
case "$SCOPE" in
  app) PATHS=("public/app") ;;
  packages) PATHS=("packages") ;;
  all) PATHS=("public/app" "packages") ;;
  *)
    echo "Usage: $0 [repo-root] [app|packages|all]" >&2
    exit 1
    ;;
esac

echo "=== console.* in ${PATHS[*]} (production paths) ==="
rg 'console\.(log|warn|error|debug|info|trace)\(' \
  "${PATHS[@]}" \
  "${GLOBS[@]}" \
  --count \
  "$ROOT" \
  | sort -t: -k2 -nr

echo
echo "=== Active (non-commented) console.log only ==="
rg '^\s*console\.log\(' \
  "${PATHS[@]}" \
  "${GLOBS[@]}" \
  --count \
  "$ROOT" \
  | sort -t: -k2 -nr

echo
echo "=== Known intentional wrappers (skip when migrating) ==="
printf '  %s\n' \
  'public/app/core/utils/debugLog.ts' \
  'packages/grafana-ui/src/utils/logger.ts' \
  'public/app/core/services/echo/backends/analytics/BrowseConsoleBackend.ts' \
  'public/app/features/plugins/sandbox/distortions.ts'
