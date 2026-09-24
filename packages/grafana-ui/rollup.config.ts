import { createRequire } from 'node:module';
import copy from 'rollup-plugin-copy';
import svg from 'rollup-plugin-svg-import';

import { cjsOutput, entryPoint, esmOutput, plugins } from '../rollup.config.parts';

const rq = createRequire(import.meta.url);
const icons = rq('../../public/app/core/icons/cached.json');
const pkg = rq('./package.json');
const { needsStylexTransform, transformStylex } = rq('../../scripts/stylex/transform.js');

// Compiles StyleX with runtime injection so the published package stays self-contained. Must precede esbuild.
const stylex = () => ({
  name: 'grafana-stylex',
  transform(code: string, id: string) {
    if (!/\.tsx?$/.test(id) || id.includes('node_modules') || !needsStylexTransform(code)) {
      return null;
    }
    return transformStylex(code, id, { sourceMaps: true });
  },
});

const iconSrcPaths = icons.map((iconSubPath) => {
  // eslint-disable-next-line @grafana/no-restricted-img-srcs
  return `../../public/img/icons/${iconSubPath}.svg`;
});

export default [
  {
    input: entryPoint,
    plugins: [
      stylex(),
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
      stylex(),
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
