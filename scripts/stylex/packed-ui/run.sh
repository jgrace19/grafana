#!/usr/bin/env bash
# Proves the published @grafana/ui works for a plugin that bundles it with no StyleX setup:
# packs @grafana/ui and its @grafana/* dependencies (as `npm publish` would), installs the tarballs in a
# scratch project, and renders migrated components from the CJS dist with the create-plugin Jest setup
# (SWC + ESM allowlist) and no StyleX Babel plugin.
#
#   scripts/stylex/packed-ui/run.sh [--skip-build]
set -euo pipefail

cd "$(dirname "$0")/../../.."
REPO=$(pwd)
WORK=${PACKED_UI_WORKDIR:-$(mktemp -d)}
PACKAGES=(grafana-ui grafana-data grafana-schema grafana-e2e-selectors grafana-i18n)

if [ "${1:-}" != "--skip-build" ]; then
  yarn nx run-many -t build --projects=@grafana/data,@grafana/schema,@grafana/e2e-selectors,@grafana/i18n
  # The StyleX compiler (and its local patch) isn't an nx input, so never reuse a cached @grafana/ui build.
  yarn nx run @grafana/ui:build --skip-nx-cache
fi

rm -rf "$WORK/app/node_modules/@grafana"
mkdir -p "$WORK/tarballs" "$WORK/app/node_modules/@grafana"
for pkg in "${PACKAGES[@]}"; do
  (cd "packages/$pkg" && yarn pack --out "$WORK/tarballs/$pkg.tgz" >/dev/null)
  mkdir -p "$WORK/app/node_modules/@grafana/${pkg#grafana-}"
  tar -xzf "$WORK/tarballs/$pkg.tgz" -C "$WORK/app/node_modules/@grafana/${pkg#grafana-}" --strip-components=1
done

cp scripts/stylex/packed-ui/packed-ui.test.js "$WORK/app/"
sed -e "s#__REPO__#$REPO#g" -e "s#__WORK__#$WORK#g" scripts/stylex/packed-ui/jest.config.template.mjs >"$WORK/app/jest.config.mjs"

echo "Packed packages installed in $WORK/app"
NODE_PATH="$REPO/node_modules" yarn jest --no-watch --config "$WORK/app/jest.config.mjs" --rootDir "$WORK/app"
