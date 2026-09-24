'use strict';

// Shared StyleX compile step used by app webpack, Storybook, Jest and the @grafana/ui rollup build so that every
// toolchain produces identical class names and variable hashes.

const babel = require('@babel/core');
const { version: stylexVersion } = require('@stylexjs/babel-plugin/package.json');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../..');
const INJECT_MODULE = path.join(ROOT_DIR, 'packages/grafana-ui/src/themes/stylex/inject');
const STYLEX_IMPORT = /from\s+['"]@stylexjs\/stylex['"]/;

const stylexPlugin = require.resolve('@stylexjs/babel-plugin');
const syntaxTypeScript = require.resolve('@babel/plugin-syntax-typescript');
const syntaxJsx = require.resolve('@babel/plugin-syntax-jsx');

function needsStylexTransform(source) {
  return STYLEX_IMPORT.test(source);
}

// The compiled module must import our injector with a path that also survives rollup's preserveModules output.
function getInjectImportPath(filename) {
  let relative = path.relative(path.dirname(filename), INJECT_MODULE).split(path.sep).join('/');
  if (!relative.startsWith('.')) {
    relative = `./${relative}`;
  }
  return relative;
}

function getBabelOptions(filename, { sourceMaps = false, inputSourceMap } = {}) {
  const isTypeScript = /\.tsx?$/.test(filename);
  return {
    babelrc: false,
    configFile: false,
    filename,
    sourceMaps,
    inputSourceMap,
    // Only parse syntax: TypeScript/JSX are left intact for the downstream compiler (esbuild, swc, ts-jest).
    plugins: [
      ...(isTypeScript ? [[syntaxTypeScript, { isTSX: filename.endsWith('x') }]] : []),
      syntaxJsx,
      [
        stylexPlugin,
        {
          dev: false,
          test: false,
          styleResolution: 'application-order',
          runtimeInjection: getInjectImportPath(filename),
          unstable_moduleResolution: { type: 'commonJS', rootDir: ROOT_DIR },
        },
      ],
    ],
  };
}

function transformStylexSync(source, filename, options) {
  const result = babel.transformSync(source, getBabelOptions(filename, options));
  return { code: result.code, map: result.map };
}

async function transformStylex(source, filename, options) {
  const result = await babel.transformAsync(source, getBabelOptions(filename, options));
  return { code: result.code, map: result.map };
}

module.exports = {
  ROOT_DIR,
  stylexVersion,
  needsStylexTransform,
  getInjectImportPath,
  transformStylex,
  transformStylexSync,
};
