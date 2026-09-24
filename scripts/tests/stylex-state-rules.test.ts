import { transformSync } from '@babel/core';
import postcss, { type Rule } from 'postcss';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const stylexPlugin = require('@stylexjs/babel-plugin');

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { cssLayers, getStylexBabelOptions } = require('../stylex/options');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { unlayerStateRules } = require('../stylex/stateRules');

const source = `
import * as stylex from '@stylexjs/stylex';
export const styles = stylex.create({
  button: {
    color: { default: 'black', ':hover': 'blue', ':disabled': 'grey', ':where([aria-disabled="true"])': 'silver' },
    backgroundColor: { default: 'white', ':is([aria-expanded="true"])': 'yellow', '@media (min-width: 800px)': 'pink' },
    opacity: { default: 1, '@media (hover: hover)': { default: null, ':hover': 0.9 } },
    '::before': { content: '""', opacity: { default: 0, ':hover': 1 } },
  },
});
`;

function compiledCss(): string {
  const result = transformSync(source, {
    filename: `${__dirname}/fixtures/Button.tsx`,
    babelrc: false,
    configFile: false,
    plugins: [[require.resolve('@stylexjs/babel-plugin'), getStylexBabelOptions()]],
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rules = (result!.metadata as any).stylex;
  return unlayerStateRules(stylexPlugin.processStylexRules(rules, { useLayers: cssLayers }));
}

function styleRules(css: string) {
  const found: Array<{ selector: string; decl: string; layered: boolean; media: boolean }> = [];
  postcss.parse(css).walkRules((rule: Rule) => {
    let layered = false;
    let media = false;
    for (let p = rule.parent; p && p.type !== 'root'; p = p.parent) {
      if (p.type === 'atrule' && 'name' in p && p.name === 'layer') {
        layered = true;
      }
      if (p.type === 'atrule' && 'name' in p && p.name === 'media') {
        media = true;
      }
    }
    rule.walkDecls((d) => {
      found.push({ selector: rule.selector, decl: `${d.prop}:${d.value}`, layered, media });
    });
  });
  return found;
}

describe('StyleX state rules', () => {
  const rules = styleRules(compiledCss());
  const byDecl = (decl: string) => rules.filter((r) => r.decl.replace(/\s+/g, '') === decl);

  it('keeps base, media-only, :where and pseudo-element-only rules in the StyleX layers', () => {
    for (const decl of [
      'color:black',
      'background-color:white',
      'color:silver',
      'background-color:pink',
      'opacity:0',
    ]) {
      expect(byDecl(decl)).toEqual([expect.objectContaining({ layered: true })]);
    }
  });

  it('moves pseudo-class, attribute and :is() state rules out of the layers, media conditions included', () => {
    for (const decl of ['color:blue', 'color:grey', 'background-color:yellow']) {
      expect(byDecl(decl)).toEqual([expect.objectContaining({ layered: false })]);
    }
    expect(byDecl('opacity:.9')).toEqual([expect.objectContaining({ layered: false, media: true })]);
    expect(byDecl('opacity:1').find((r) => r.selector.includes(':hover'))).toEqual(
      expect.objectContaining({ layered: false })
    );
    expect(byDecl('opacity:1').find((r) => !r.selector.includes(':hover'))).toEqual(
      expect.objectContaining({ layered: true })
    );
  });

  it('keeps StyleX priority order among the moved rules', () => {
    const moved = rules.filter((r) => !r.layered).map((r) => r.decl.replace(/\s+/g, ''));
    // :is (40) < :disabled (92) < :hover (130) < @media + :hover (330)
    expect(moved.indexOf('background-color:yellow')).toBeGreaterThan(-1);
    expect(moved.indexOf('background-color:yellow')).toBeLessThan(moved.indexOf('color:grey'));
    expect(moved.indexOf('color:grey')).toBeLessThan(moved.indexOf('color:blue'));
    expect(moved.indexOf('color:blue')).toBeLessThan(moved.indexOf('opacity:.9'));
  });
});
