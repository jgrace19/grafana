import stylexPlugin from '@stylexjs/babel-plugin';
import stylex from '@stylexjs/unplugin/rollup';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
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

// Plain CSS files imported by components (unlayered structural rules such as ButtonGroup.css), shared by
// both rollup configs.
const componentCss = new Map<string, string>();
const srcDir = resolve('src');

/**
 * Pre-compiles StyleX so published JS never calls `stylex.create` at runtime, and writes every rule to
 * `dist/stylex.css` (exported as `@grafana/ui/stylex.css`) for consumers that bundle @grafana/ui, followed
 * by the components' own plain CSS files.
 */
function stylexPrecompile(): Plugin {
  const transformPlugin: Plugin = stylex({ ...getStylexBabelOptions({ dev: false }), useCSSLayers: cssLayers });
  return {
    ...transformPlugin,
    name: 'grafana-stylex-precompile',
    async load(id) {
      if (id.startsWith(srcDir) && id.endsWith('.css')) {
        componentCss.set(id, await readFile(id, 'utf8'));
        return 'export {};';
      }
      return null;
    },
    generateBundle() {},
    async writeBundle() {
      // The unplugin collects every transformed module's rules in this global store.
      const store: StylexRuleStore | undefined = Reflect.get(globalThis, '__stylex_unplugin_store');
      const rules = store ? Array.from(store.rulesById.values()).flat() : [];
      const css = stylexPlugin.processStylexRules(rules, { useLayers: cssLayers });
      const outFile = resolve(dirname(pkg.main), '..', 'stylex.css');
      await mkdir(dirname(outFile), { recursive: true });
      const plainCss = [...componentCss.keys()].sort().map((file) => componentCss.get(file));
      await writeFile(outFile, [css, ...plainCss].join('\n'));
      await stripCssImportsFromTypes();
    },
  };
}

const CSS_SIDE_EFFECT_IMPORT = /^import ['"][^'"]+\.css['"];\r?\n/gm;

/**
 * tsc keeps components' side-effect `import './X.css'` in the emitted declarations, but the published package
 * ships those rules in `dist/stylex.css`, not as files, so the imports would fail to resolve for consumers
 * (and `attw`). They carry no types.
 */
async function stripCssImportsFromTypes() {
  const typesDir = resolve(dirname(pkg.types));
  for (const file of await readdir(typesDir, { recursive: true })) {
    if (!file.endsWith('.d.ts')) {
      continue;
    }
    const path = resolve(typesDir, file);
    const source = await readFile(path, 'utf8');
    const stripped = source.replace(CSS_SIDE_EFFECT_IMPORT, '');
    if (stripped !== source) {
      await writeFile(path, stripped);
    }
  }
}

type StylexRule = Parameters<typeof stylexPlugin.processStylexRules>[0][number];
interface StylexRuleStore {
  rulesById: Map<string, StylexRule[]>;
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
