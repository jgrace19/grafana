'use strict';

const stylex = require('@stylexjs/unplugin').default;
const fs = require('fs');
const path = require('path');

const { cssLayers, getStylexBabelOptions } = require('../stylex/options');

const StylexCachePlugin = require('./plugins/StylexCachePlugin');

/**
 * StyleX is compiled by @stylexjs/unplugin (its own Babel pass, before esbuild-loader) and the
 * collected CSS is appended to the `app` entry's extracted stylesheet, which index.html links first.
 *
 * @param {{ dev: boolean, cssInjectionTarget?: (fileName: string) => boolean }} opts
 */
function getStylexWebpackPlugins({ dev, cssInjectionTarget = (fileName) => /(^|\/)grafana\.app[.-]/.test(fileName) }) {
  return [
    stylex.webpack({
      ...getStylexBabelOptions({ dev }),
      useCSSLayers: cssLayers,
      cssInjectionTarget,
      devMode: 'off',
      lightningcssOptions: { minify: !dev },
    }),
    new StylexCachePlugin(),
  ];
}

/**
 * StyleX output depends on compiler options and versions that webpack can't see through the unplugin loader,
 * so they version the persistent cache.
 */
const packageVersion = (name) =>
  JSON.parse(fs.readFileSync(path.join(path.dirname(require.resolve(name)), '..', 'package.json'), 'utf8')).version;

const stylexCacheVersion = [
  packageVersion('@stylexjs/babel-plugin'),
  packageVersion('@stylexjs/unplugin'),
  JSON.stringify({ ...getStylexBabelOptions(), cssLayers }),
].join('|');

module.exports = { getStylexWebpackPlugins, stylexCacheVersion };
