'use strict';

// Jest transform for the decoupled plugin workspaces (@grafana/plugin-configs/jest): StyleX pass (see
// stylex-compile.js), then @swc/jest with the options from the Jest config. Plugins resolve @grafana/ui to its
// source, and that source must be StyleX-compiled before it can run.

const swcJest = require('@swc/jest');

const { compileStylex, stylexCacheKey } = require('./stylex-compile');

module.exports = {
  createTransformer(swcOptions) {
    const transformer = swcJest.createTransformer(swcOptions);

    return {
      canInstrument: transformer.canInstrument,
      getCacheKey(src, filename, ...rest) {
        return transformer.getCacheKey(src, filename, ...rest) + stylexCacheKey;
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
