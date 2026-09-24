'use strict';

// Single source of StyleX compiler options for webpack, Jest, Storybook and rollup, so every tool
// compiles styles identically.

const path = require('path');

const rootDir = path.resolve(__dirname, '../..');
const tokensDir = path.join(rootDir, 'packages/grafana-ui/src/themes/stylex');

/**
 * StyleX sits above these layers. Unlayered CSS (Emotion component styles, consumer overrides) beats
 * all of them. Keep in sync with public/app/stylex-layers.css and the Storybook preview.
 */
const cssLayers = {
  before: ['rdg', 'grafana-legacy', 'grafana-global'],
  prefix: 'stylex',
};

/**
 * @param {{ dev?: boolean, test?: boolean }} [opts]
 */
function getStylexBabelOptions({ dev = false, test = false } = {}) {
  return {
    dev,
    test,
    runtimeInjection: false,
    // esbuild-loader drops imports that become unused once StyleX inlines vars/consts, which would stop
    // webpack from building the .stylex.ts modules whose rules resolve those references. This keeps a
    // side-effect import of each one.
    treeshakeCompensation: true,
    sxPropName: false,
    styleResolution: 'property-specificity',
    importSources: ['@stylexjs/stylex'],
    unstable_moduleResolution: { type: 'commonJS', rootDir },
    aliases: {
      '@grafana/ui/stylex/*': [path.join(tokensDir, '*')],
    },
  };
}

module.exports = { rootDir, tokensDir, cssLayers, getStylexBabelOptions };
