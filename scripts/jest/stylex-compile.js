'use strict';

// StyleX-only Babel pass shared by the Jest transforms: TypeScript and JSX are preserved so the wrapped
// transformer (ts-jest for the root config, @swc/jest for decoupled plugins) compiles the result exactly as
// before. `test: true` makes StyleX emit deterministic debug class names and no CSS, so jsdom never sees
// StyleX styles.

const babel = require('@babel/core');
const stylexPlugin = require('@stylexjs/babel-plugin');
const crypto = require('crypto');
const fs = require('fs');

const { getStylexBabelOptions } = require('../stylex/options');

const STYLEX_IMPORT = /from\s*['"]@stylexjs\/stylex['"]/;

const stylexCacheKey = [
  'stylex-transform-v1',
  // Hash of the compiler source: it carries a local yarn patch that doesn't change its version.
  crypto
    .createHash('sha1')
    .update(fs.readFileSync(require.resolve('@stylexjs/babel-plugin')))
    .digest('hex'),
  JSON.stringify(getStylexBabelOptions({ test: true })),
].join(':');

/**
 * @param {string} src
 * @param {string} filename
 * @returns {string}
 */
function compileStylex(src, filename) {
  if (!STYLEX_IMPORT.test(src)) {
    return src;
  }
  const result = babel.transformSync(src, {
    filename,
    babelrc: false,
    configFile: false,
    retainLines: true,
    plugins: [
      ['@babel/plugin-syntax-typescript', { isTSX: filename.endsWith('.tsx') }],
      '@babel/plugin-syntax-jsx',
      [stylexPlugin, getStylexBabelOptions({ test: true })],
    ],
  });
  return result && result.code != null ? result.code : src;
}

module.exports = { compileStylex, stylexCacheKey };
