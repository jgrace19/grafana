import { transformSync } from '@babel/core';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getStylexBabelOptions } = require('../stylex/options');

// Guards the local patch in .yarn/patches/@stylexjs-babel-plugin-*.patch: StyleX 0.19.1 concatenates the
// classes of a multi-branch dynamic style as `(a != null ? "x1 " : a) + (b != null ? "x2" : b)`, producing
// "undefinedx2" (the branch's style is lost) or NaN when an argument is unset, and falls back to `undefined`,
// which styleq reports with console.error. The patch falls back to null ("unset") instead.
const source = `
import * as stylex from '@stylexjs/stylex';
const styles = stylex.create({
  color: (base, hover) => ({ color: { default: base, ':hover': hover } }),
});
module.exports = (base, hover) => styles.color(base, hover)[0].kMwMTN;
`;

function compile(): (base?: string, hover?: string) => unknown {
  const result = transformSync(source, {
    filename: 'dynamic.js',
    babelrc: false,
    configFile: false,
    plugins: [
      [require.resolve('@stylexjs/babel-plugin'), getStylexBabelOptions()],
      require.resolve('@babel/plugin-transform-modules-commonjs'),
    ],
  });
  const module = { exports: {} as unknown };
  new Function('module', 'exports', 'require', result!.code!)(module, module.exports, require);
  return module.exports as (base?: string, hover?: string) => unknown;
}

describe('StyleX multi-branch dynamic styles', () => {
  const classFor = compile();

  it('keeps a later branch when an earlier one is unset', () => {
    const className = String(classFor(undefined, 'red'));
    expect(className).not.toContain('undefined');
    expect(className.trim().split(' ')).toHaveLength(1);
  });

  it('unsets the property when every branch is unset', () => {
    expect(classFor(undefined, undefined)).toBeNull();
  });

  it('emits both classes when both branches are set', () => {
    expect(String(classFor('blue', 'red')).trim().split(' ')).toHaveLength(2);
  });
});
