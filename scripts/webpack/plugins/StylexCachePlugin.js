'use strict';

const PLUGIN_NAME = 'StylexCachePlugin';

/**
 * @stylexjs/unplugin collects CSS rules while it transforms a module. Modules restored from webpack's
 * persistent (filesystem) cache skip the transform, so their rules would be missing from the emitted
 * CSS. This stores each module's rules in `buildInfo` (which webpack serialises into the cache) and
 * replays them into the unplugin's shared store when a module is restored.
 */
class StylexCachePlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
      const store = getSharedStore();

      compilation.hooks.succeedModule.tap(PLUGIN_NAME, (module) => {
        if (!module.resource || !module.buildInfo) {
          return;
        }
        const rules = store.rulesById.get(module.resource);
        if (rules && rules.length > 0) {
          module.buildInfo.stylexRules = rules;
        } else {
          delete module.buildInfo.stylexRules;
        }
      });

      compilation.hooks.stillValidModule.tap(PLUGIN_NAME, (module) => {
        const rules = module.buildInfo && module.buildInfo.stylexRules;
        if (module.resource && rules && !store.rulesById.has(module.resource)) {
          store.rulesById.set(module.resource, rules);
          store.version++;
        }
      });
    });
  }
}

// Same global store @stylexjs/unplugin reads from in collectCss().
function getSharedStore() {
  if (!globalThis.__stylex_unplugin_store) {
    globalThis.__stylex_unplugin_store = { rulesById: new Map(), version: 0 };
  }
  return globalThis.__stylex_unplugin_store;
}

module.exports = StylexCachePlugin;
