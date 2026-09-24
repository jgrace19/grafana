'use strict';

// Jest transform for the root config: StyleX pass (see stylex-compile.js), then ts-jest exactly as before.

const tsJest = require('ts-jest').default;

const { compileStylex, stylexCacheKey } = require('./stylex-compile');

module.exports = {
  createTransformer(tsJestConfig) {
    const transformer = tsJest.createTransformer(tsJestConfig);

    return {
      canInstrument: transformer.canInstrument,
      getCacheKey(src, filename, options) {
        return transformer.getCacheKey(src, filename, options) + stylexCacheKey;
      },
      getCacheKeyAsync(src, filename, options) {
        return transformer.getCacheKeyAsync(src, filename, options).then((key) => key + stylexCacheKey);
      },
      process(src, filename, options) {
        return transformer.process(compileStylex(src, filename), filename, options);
      },
      processAsync(src, filename, options) {
        return transformer.processAsync(compileStylex(src, filename), filename, options);
      },
    };
  },
};
