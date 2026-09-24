'use strict';

const path = require('path');
const StylexPlugin = require('@stylexjs/unplugin/webpack').default;

/**
 * StyleX compiler integration for Grafana webpack builds.
 * Processes .stylex.ts(x) files and any TS/TSX under packages/grafana-ui that import @stylexjs/stylex.
 */
function stylexWebpackPlugin({ dev = false } = {}) {
  return StylexPlugin({
    dev,
    unstable_moduleResolution: {
      type: 'commonJS',
      rootDir: path.resolve(__dirname, '../..'),
    },
    useCSSLayers: true,
  });
}

const stylexFileTest = /\.stylex\.(ts|tsx)$/;

module.exports = {
  stylexWebpackPlugin,
  stylexFileTest,
};
