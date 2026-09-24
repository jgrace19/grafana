'use strict';

const { unlayerStateRules } = require('../../stylex/stateRules');

const PLUGIN_NAME = 'StylexStateRulesPlugin';

/**
 * Runs scripts/stylex/stateRules.js on the stylesheet the StyleX unplugin appends its CSS to. The unplugin appends at
 * PROCESS_ASSETS_STAGE_SUMMARIZE (after minification, before content hashing), so this runs just after it.
 */
class StylexStateRulesPlugin {
  apply(compiler) {
    const { Compilation, sources } = compiler.webpack;
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.processAssets.tap(
        { name: PLUGIN_NAME, stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE + 1 },
        (assets) => {
          for (const name of Object.keys(assets)) {
            if (!name.endsWith('.css')) {
              continue;
            }
            const css = compilation.getAsset(name).source.source().toString();
            const next = unlayerStateRules(css);
            if (next !== css) {
              compilation.updateAsset(name, new sources.RawSource(next));
            }
          }
        }
      );
    });
  }
}

module.exports = StylexStateRulesPlugin;
