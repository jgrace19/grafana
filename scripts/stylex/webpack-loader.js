'use strict';

const { needsStylexTransform, transformStylex } = require('./transform');

// Must run before the TypeScript loader (use `enforce: 'pre'`), because StyleX compiles the untranspiled source.
module.exports = function stylexLoader(source, inputSourceMap) {
  const callback = this.async();

  if (!needsStylexTransform(source)) {
    callback(null, source, inputSourceMap);
    return;
  }

  transformStylex(source, this.resourcePath, { sourceMaps: this.sourceMap, inputSourceMap: inputSourceMap || undefined })
    .then(({ code, map }) => callback(null, code, map || undefined))
    .catch((err) => callback(err));
};
