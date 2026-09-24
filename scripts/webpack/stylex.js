'use strict';

const stylex = require('@stylexjs/unplugin').default;

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

module.exports = { getStylexWebpackPlugins };
