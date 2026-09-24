import stylexPlugin from '@stylexjs/babel-plugin';
import stylex from '@stylexjs/unplugin/rollup';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { type Plugin } from 'rollup';
import copy from 'rollup-plugin-copy';
import svg from 'rollup-plugin-svg-import';

import { cjsOutput, entryPoint, esmOutput, plugins } from '../rollup.config.parts';

const rq = createRequire(import.meta.url);
const icons = rq('../../public/app/core/icons/cached.json');
const pkg = rq('./package.json');
const { cssLayers, getStylexBabelOptions } = rq('../../scripts/stylex/options.js');

const iconSrcPaths = icons.map((iconSubPath) => {
  // eslint-disable-next-line @grafana/no-restricted-img-srcs
  return `../../public/img/icons/${iconSubPath}.svg`;
});

/**
 * Pre-compiles StyleX so published JS never calls `stylex.create` at runtime, and writes every rule to
 * `dist/stylex.css` (exported as `@grafana/ui/stylex.css`) for consumers that bundle @grafana/ui.
 */
function stylexPrecompile(): Plugin {
  const transformPlugin = stylex({ ...getStylexBabelOptions({ dev: false }), useCSSLayers: cssLayers }) as Plugin;
  return {
    ...transformPlugin,
    name: 'grafana-stylex-precompile',
    generateBundle() {},
    async writeBundle() {
      const store = (globalThis as { __stylex_unplugin_store?: { rulesById: Map<string, unknown[]> } })
        .__stylex_unplugin_store;
      const rules = store ? Array.from(store.rulesById.values()).flat() : [];
      const css = stylexPlugin.processStylexRules(rules as Parameters<typeof stylexPlugin.processStylexRules>[0], {
        useLayers: cssLayers,
      });
      const outFile = resolve(dirname(pkg.main), '..', 'stylex.css');
      await mkdir(dirname(outFile), { recursive: true });
      await writeFile(outFile, css);
    },
  };
}

export default [
  {
    input: entryPoint,
    plugins: [
      stylexPrecompile(),
      ...plugins,
      svg({ stringify: true }),
      copy({
        targets: [{ src: iconSrcPaths, dest: './dist/public/' }],
        flatten: false,
      }),
    ],
    output: [cjsOutput(pkg, 'grafana-ui'), esmOutput(pkg, 'grafana-ui')],
    treeshake: false,
  },
  {
    input: 'src/unstable.ts',
    plugins: [
      stylexPrecompile(),
      ...plugins,
      svg({ stringify: true }),
      copy({
        targets: [{ src: iconSrcPaths, dest: './dist/public/' }],
        flatten: false,
      }),
    ],
    output: [cjsOutput(pkg, 'grafana-ui'), esmOutput(pkg, 'grafana-ui')],
    treeshake: false,
  },
];
