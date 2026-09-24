'use strict';

const crypto = require('crypto');
const fs = require('fs');

const { needsStylexTransform, stylexVersion, transformStylexSync } = require('./transform');

const transformerSource = fs.readFileSync(require.resolve('./transform'), 'utf8');

function loadInnerTransformer(name, config) {
  const mod = require(name);
  const factory = typeof mod.createTransformer === 'function' ? mod : mod.default;
  return factory.createTransformer(config);
}

/**
 * Wraps another Jest transformer (ts-jest by default). Files importing @stylexjs/stylex are compiled by StyleX first,
 * so tests execute real runtime injection instead of hitting StyleX's "must be compiled" runtime error.
 *
 * Options: `{ transformer?: string, config?: object }` where `config` is forwarded to the inner transformer.
 */
module.exports = {
  createTransformer({ transformer = 'ts-jest', config } = {}) {
    const inner = loadInnerTransformer(transformer, config);

    const prepare = (sourceText, sourcePath) =>
      needsStylexTransform(sourceText) ? transformStylexSync(sourceText, sourcePath).code : sourceText;

    const wrapped = {
      canInstrument: inner.canInstrument,
      getCacheKey(sourceText, sourcePath, transformOptions) {
        const innerKey = inner.getCacheKey ? inner.getCacheKey(sourceText, sourcePath, transformOptions) : sourceText;
        return crypto
          .createHash('sha1')
          .update(innerKey)
          .update(sourcePath)
          .update(transformOptions.configString ?? '')
          .update(stylexVersion)
          .update(transformerSource)
          .digest('hex');
      },
      process(sourceText, sourcePath, transformOptions) {
        return inner.process(prepare(sourceText, sourcePath), sourcePath, transformOptions);
      },
    };

    if (inner.processAsync) {
      wrapped.processAsync = (sourceText, sourcePath, transformOptions) =>
        inner.processAsync(prepare(sourceText, sourcePath), sourcePath, transformOptions);
    }

    return wrapped;
  },
};
