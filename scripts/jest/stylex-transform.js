'use strict';

// Jest transform: files that import @stylexjs/stylex get a StyleX-only Babel pass (TypeScript and JSX are
// preserved), then everything goes through ts-jest exactly as before. `test: true` makes StyleX emit
// deterministic debug class names and no CSS, so jsdom never sees StyleX styles.

const babel = require('@babel/core');
const stylexPlugin = require('@stylexjs/babel-plugin');
const tsJest = require('ts-jest').default;

const { getStylexBabelOptions } = require('../stylex/options');

const STYLEX_IMPORT = /from\s*['"]@stylexjs\/stylex['"]/;
const CACHE_VERSION = [
  'stylex-transform-v1',
  require('@stylexjs/babel-plugin/package.json').version,
  JSON.stringify(getStylexBabelOptions({ test: true })),
].join(':');

function compileStylex(src, filename) {
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

module.exports = {
  createTransformer(tsJestConfig) {
    const transformer = tsJest.createTransformer(tsJestConfig);

    return {
      canInstrument: transformer.canInstrument,
      getCacheKey(src, filename, options) {
        return transformer.getCacheKey(src, filename, options) + CACHE_VERSION;
      },
      getCacheKeyAsync(src, filename, options) {
        return transformer.getCacheKeyAsync(src, filename, options).then((key) => key + CACHE_VERSION);
      },
      process(src, filename, options) {
        const code = STYLEX_IMPORT.test(src) ? compileStylex(src, filename) : src;
        return transformer.process(code, filename, options);
      },
      processAsync(src, filename, options) {
        const code = STYLEX_IMPORT.test(src) ? compileStylex(src, filename) : src;
        return transformer.processAsync(code, filename, options);
      },
    };
  },
};
