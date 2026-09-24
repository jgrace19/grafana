import { RuleTester } from 'eslint';

import stylexNoBorderRadiusLiteral from '../rules/stylex-no-border-radius-literal.cjs';
import stylexNoToggledPseudoState from '../rules/stylex-no-toggled-pseudo-state.cjs';
import stylexNoUnreducedMotion from '../rules/stylex-no-unreduced-motion.cjs';
import stylexThemeTokenUsage from '../rules/stylex-theme-token-usage.cjs';

RuleTester.setDefaultConfig({
  languageOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
});

const ruleTester = new RuleTester();
const header = `import * as stylex from '@stylexjs/stylex';\nimport { motion } from './constants.stylex';\n`;

ruleTester.run('eslint stylex-no-unreduced-motion', stylexNoUnreducedMotion, {
  valid: [
    {
      name: 'gated by motion const',
      code: `${header}stylex.create({ a: { transitionDuration: { default: null, [motion.noPreference]: '1s' } } })`,
    },
    {
      name: 'nested gate',
      code: `${header}stylex.create({ a: { transitionDuration: { default: null, ':hover': { default: null, [motion.reduce]: '1s' } } } })`,
    },
    {
      name: 'literal media query',
      code: `${header}stylex.create({ a: { animationName: { default: null, '@media (prefers-reduced-motion: no-preference)': 'x' } } })`,
    },
    {
      name: 'reset to none',
      code: `${header}stylex.create({ a: { transitionProperty: 'opacity', animationName: 'none' } })`,
    },
    {
      name: 'dynamic style gated',
      code: `${header}stylex.create({ a: (d) => ({ transitionDuration: { default: null, [motion.noPreference]: d } }) })`,
    },
    { name: 'not stylex', code: `css({ transition: 'opacity 1s' })` },
  ],
  invalid: [
    {
      code: `${header}stylex.create({ a: { transitionDuration: '1s' } })`,
      errors: [{ messageId: 'noUnreducedMotion' }],
    },
    {
      code: `${header}stylex.create({ a: { animationName: { default: 'x', ':hover': 'y' } } })`,
      errors: [{ messageId: 'noUnreducedMotion' }],
    },
    {
      code: `${header}stylex.create({ a: { '::before': { transitionDuration: '1s' } } })`,
      errors: [{ messageId: 'noUnreducedMotion' }],
    },
    {
      code: `import { create } from '@stylexjs/stylex';\ncreate({ a: (d) => ({ animationDuration: d }) })`,
      errors: [{ messageId: 'noUnreducedMotion' }],
    },
  ],
});

ruleTester.run('eslint stylex-no-border-radius-literal', stylexNoBorderRadiusLiteral, {
  valid: [
    { code: `${header}stylex.create({ a: { borderRadius: shape['--gf-shape-radius-default'] } })` },
    { code: `${header}stylex.create({ a: { borderRadius: 'unset', borderTopLeftRadius: 'initial' } })` },
    {
      code: `${header}stylex.create({ a: { borderRadius: { default: null, ':hover': shape['--gf-shape-radius-sm'] } } })`,
    },
    { code: `css({ borderRadius: 2 })` },
  ],
  invalid: [
    {
      code: `${header}stylex.create({ a: { borderRadius: '2px' } })`,
      errors: [{ messageId: 'borderRadiusUseTokens' }],
    },
    {
      code: `${header}stylex.create({ a: { borderTopLeftRadius: 4 } })`,
      errors: [{ messageId: 'borderRadiusUseTokens' }],
    },
    {
      code: `${header}stylex.create({ a: { borderRadius: { default: shape['--gf-shape-radius-sm'], ':hover': '8px' } } })`,
      errors: [{ messageId: 'borderRadiusUseTokens' }],
    },
    {
      code: `${header}stylex.create({ a: { borderRadius: 0 } })`,
      output: `${header}stylex.create({ a: { borderRadius: 'unset' } })`,
      errors: [{ messageId: 'borderRadiusNoZeroValue' }],
    },
  ],
});

ruleTester.run('eslint stylex-theme-token-usage', stylexThemeTokenUsage, {
  valid: [{ code: `const colors = {}; colors['--gf-colors-text-primary'];` }],
  invalid: [
    {
      code: `import { colors } from '@grafana/ui/stylex/tokens.stylex';\ncolors['--gf-colors-text-primary'];`,
      errors: [{ messageId: 'themeTokenUsed', data: { identifier: "colors['--gf-colors-text-primary']" } }],
    },
  ],
});

const jsxTester = new RuleTester({
  languageOptions: { ecmaVersion: 2018, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

jsxTester.run('eslint stylex-no-toggled-pseudo-state', stylexNoToggledPseudoState, {
  valid: [
    {
      name: 'state written as a condition',
      code: `${header}<button {...stylex.props(styles.button)} disabled={disabled} />`,
    },
    {
      name: 'disabled on an element that cannot match :disabled',
      code: `${header}<div {...stylex.props(styles.row, disabled && styles.disabled)} />`,
    },
    {
      name: 'selected state is not a pseudo-class',
      code: `${header}<button {...stylex.props(styles.tab, active && styles.active)} />`,
    },
    {
      name: 'condition names a different state',
      code: `${header}<button {...stylex.props(styles.button, isOpen && styles.disabled)} />`,
    },
    { name: 'not stylex', code: `<button className={cx(styles.button, disabled && styles.disabled)} />` },
  ],
  invalid: [
    {
      code: `${header}<button {...stylex.props(styles.button, disabled && styles.disabled)} disabled={disabled} />`,
      errors: [{ messageId: 'toggledPseudoState' }],
    },
    {
      code: `${header}<div {...stylex.props(styles.row, isHovered ? styles.hover : styles.idle)} />`,
      errors: [{ messageId: 'toggledPseudoState' }],
    },
    {
      code: `${header}const p = stylex.props(styles.field, props.readOnly && styles.readOnly);`,
      errors: [{ messageId: 'toggledPseudoState' }],
    },
    {
      code: `import { props } from '@stylexjs/stylex';\n<Input {...props(styles.input, [focused && styles.focusVisible])} />`,
      errors: [{ messageId: 'toggledPseudoState' }],
    },
  ],
});
