#!/usr/bin/env bash
# Scan runtime Go backend code for unstructured print-style logging.
set -euo pipefail

ROOT="${1:-.}"

PATTERN='^\s*(fmt\.Print(ln|f)?\(|log\.Print(ln|f)?\(|stdlog\.Print)'

echo "=== Unstructured print logging in runtime pkg/ Go code ==="
rg "$PATTERN" "$ROOT/pkg" \
  --glob '*.go' \
  --glob '!*_test.go' \
  --glob '!pkg/build/**' \
  --glob '!pkg/cmd/**' \
  --glob '!devenv/**' \
  --glob '!e2e/**' \
  --glob '!scripts/**'

echo
echo "=== Count by file ==="
rg "$PATTERN" "$ROOT/pkg" \
  --glob '*.go' \
  --glob '!*_test.go' \
  --glob '!pkg/build/**' \
  --glob '!pkg/cmd/**' \
  --glob '!devenv/**' \
  --glob '!e2e/**' \
  --glob '!scripts/**' \
  --count \
  | sort -t: -k2 -nr
