#!/usr/bin/env bash
# Proves the published @grafana/ui works for a plugin that bundles it with no StyleX setup:
# packs @grafana/ui and its @grafana/* dependencies (as `npm publish` would), installs the tarballs in a
# scratch project, and renders migrated components from the CJS dist in plain Jest (no Babel StyleX plugin).
#
#   scripts/stylex/packed-ui/run.sh [--skip-build]
set -euo pipefail

cd "$(dirname "$0")/../../.."
REPO=$(pwd)
WORK=${PACKED_UI_WORKDIR:-$(mktemp -d)}
PACKAGES=(grafana-ui grafana-data grafana-schema grafana-e2e-selectors grafana-i18n)

if [ "${1:-}" != "--skip-build" ]; then
  yarn nx run-many -t build --projects=@grafana/ui,@grafana/data,@grafana/schema,@grafana/e2e-selectors,@grafana/i18n
fi

mkdir -p "$WORK/tarballs" "$WORK/app/node_modules/@grafana"
for pkg in "${PACKAGES[@]}"; do
  (cd "packages/$pkg" && yarn pack --out "$WORK/tarballs/$pkg.tgz" >/dev/null)
  mkdir -p "$WORK/app/node_modules/@grafana/${pkg#grafana-}"
  tar -xzf "$WORK/tarballs/$pkg.tgz" -C "$WORK/app/node_modules/@grafana/${pkg#grafana-}" --strip-components=1
done

cp scripts/stylex/packed-ui/packed-ui.test.js "$WORK/app/"
cat >"$WORK/app/jest.config.js" <<EOF
module.exports = {
  rootDir: __dirname,
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/*.test.js'],
  // A plugin's own Jest setup: no StyleX Babel plugin and no @grafana-app/source condition.
  transform: {},
  moduleDirectories: ['node_modules', '$REPO/node_modules'],
  moduleNameMapper: { '\\\\.css$': '$REPO/public/test/mocks/style.ts' },
  setupFiles: ['$REPO/node_modules/jest-canvas-mock'],
};
EOF

echo "Packed packages installed in $WORK/app"
NODE_PATH="$REPO/node_modules" yarn jest --no-watch --config "$WORK/app/jest.config.js" --rootDir "$WORK/app"
