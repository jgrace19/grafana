#!/usr/bin/env bash
set -e

# This script is used to validate the npm packages that are published to npmjs.org are in the correct format.
# It won't catch things like malformed JS or Types but it will assert that the package has
# the correct files and package.json properties.
ARTIFACTS_DIR="./npm-artifacts"

failed_checks=()

for file in "$ARTIFACTS_DIR"/*.tgz; do
  echo "🔍 Checking NPM package: $file"

  # attw resolves every export as JS/types, so stylesheet exports (e.g. @grafana/ui/stylex.css) always fail it.
  attw_excludes=()
  while IFS= read -r entry; do
    [[ -n "$entry" ]] && attw_excludes+=("$entry")
  done < <(tar -xzOf "$file" package/package.json | node -e '
    const { exports } = JSON.parse(require("fs").readFileSync(0, "utf8"));
    if (exports && typeof exports === "object") {
      for (const key of Object.keys(exports)) {
        if (key.endsWith(".css")) console.log(key);
      }
    }')
  if (( ${#attw_excludes[@]} > 0 )); then
    attw_excludes=(--exclude-entrypoints "${attw_excludes[@]}")
  fi

  # If you need to debug ATTW issues, pass "--format json" to get verbose output.
  if ! NODE_OPTIONS="-C @grafana-app/source" yarn attw "$file" --ignore-rules "false-cjs" --profile "node16" "${attw_excludes[@]}"; then
    echo "attw check failed for $file"
    echo ""
    failed_checks+=("$file - yarn attw")
  fi

  if ! yarn publint "$file"; then
    echo "publint check failed for $file"
    echo ""
    failed_checks+=("$file - yarn publint")
  fi
done

if (( ${#failed_checks[@]} > 0 )); then
  echo ""
  echo "❌ The following NPM package checks failed:"
  for check in "${failed_checks[@]}"; do
    echo "  - $check"
  done
  exit 1
fi

echo "🚀 All NPM package checks passed! 🚀"
exit 0
