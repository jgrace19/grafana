import { createTheme, getBuiltInThemes } from '@grafana/data';

import { themeToCssVars } from './themeToCssVars';
import { colors, components, shadows, shape, spacing, typography, v1 } from './tokens.stylex';

const tokenNames = [colors, components, shadows, shape, spacing, typography, v1].flatMap((group) =>
  Object.keys(group).filter((name) => name.startsWith('--'))
);

describe('themeToCssVars', () => {
  it('covers exactly the vars declared in tokens.stylex', () => {
    expect(Object.keys(themeToCssVars(createTheme())).sort()).toEqual([...tokenNames].sort());
  });

  it.each(getBuiltInThemes(['debug', 'matrix', 'victorian', 'tron']).map((theme) => [theme.id, theme]))(
    'gives every var a value for the %s theme',
    (_id, theme) => {
      const vars = themeToCssVars(theme.build());
      // Only letterSpacing is optional: themes with a non-default font omit it.
      const missing = Object.entries(vars).filter(
        ([name, value]) => (value === '' || value === 'initial') && !name.endsWith('-letter-spacing')
      );
      expect(missing).toEqual([]);
    }
  );

  it('uses the same values Emotion interpolated', () => {
    const theme = createTheme({ colors: { mode: 'light' } });
    const vars = themeToCssVars(theme);

    expect(vars['--gf-colors-text-primary']).toBe(theme.colors.text.primary);
    expect(vars['--gf-spacing-x1-5']).toBe(theme.spacing(1.5));
    expect(vars['--gf-spacing-grid-size']).toBe(`${theme.spacing.gridSize}px`);
    expect(vars['--gf-typography-font-weight-medium']).toBe(String(theme.typography.fontWeightMedium));
    expect(vars['--gf-components-height-md']).toBe(String(theme.components.height.md));
  });

  it('follows themes that change non-colour tokens', () => {
    const debug = getBuiltInThemes(['debug'])
      .find((theme) => theme.id === 'debug')!
      .build();

    expect(themeToCssVars(debug)['--gf-spacing-grid-size']).toBe(`${debug.spacing.gridSize}px`);
    expect(themeToCssVars(debug)['--gf-shape-radius-default']).toBe(debug.shape.radius.default);
  });
});
