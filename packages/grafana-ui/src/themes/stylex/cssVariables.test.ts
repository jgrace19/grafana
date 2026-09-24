import { createTheme, getThemeById } from '@grafana/data';

import { getSpacingVariableName, getThemeCssText, getThemeCssVariables, THEME_SPACING_TOKENS } from './cssVariables';
import * as tokens from './tokens.stylex';

const tokenVariableNames = Object.values(tokens).flatMap((group) =>
  Object.keys(group).filter((key) => key.startsWith('--'))
);

describe('getThemeCssVariables', () => {
  it.each(['dark', 'light'])('emits exactly the variables declared in tokens.stylex.ts for the %s theme', (id) => {
    const vars = getThemeCssVariables(getThemeById(id));
    expect(Object.keys(vars).sort()).toEqual([...tokenVariableNames].sort());
  });

  it('compiles token handles to literal var() references', () => {
    expect(tokens.colors['--grafana-colors-border-weak']).toBe('var(--grafana-colors-border-weak)');
    expect(tokens.spacing['--grafana-spacing-1']).toBe('var(--grafana-spacing-1)');
  });

  it.each(['dark', 'light'])('maps %s theme values from GrafanaTheme2', (id) => {
    const theme = getThemeById(id);
    const vars = getThemeCssVariables(theme);

    expect(vars['--grafana-colors-border-weak']).toBe(theme.colors.border.weak);
    expect(vars['--grafana-colors-text-secondary']).toBe(theme.colors.text.secondary);
    expect(vars['--grafana-colors-primary-contrast-text']).toBe(theme.colors.primary.contrastText);
    expect(vars['--grafana-colors-gradients-brand-horizontal']).toBe(theme.colors.gradients.brandHorizontal);
    expect(vars['--grafana-colors-action-hover-opacity']).toBe(String(theme.colors.action.hoverOpacity));
    expect(vars['--grafana-shape-radius-sm']).toBe(theme.shape.radius.sm);
    expect(vars['--grafana-typography-font-weight-medium']).toBe(String(theme.typography.fontWeightMedium));
    expect(vars['--grafana-typography-size-sm']).toBe(theme.typography.size.sm);
    expect(vars['--grafana-typography-body-small-line-height']).toBe(String(theme.typography.bodySmall.lineHeight));
    expect(vars['--grafana-v1-palette-gray98']).toBe(theme.v1.palette.gray98);
    expect(vars['--grafana-shadows-z3']).toBe(theme.shadows.z3);
  });

  it('produces different color values for dark and light', () => {
    const dark = getThemeCssVariables(getThemeById('dark'));
    const light = getThemeCssVariables(getThemeById('light'));
    expect(dark['--grafana-colors-background-primary']).not.toBe(light['--grafana-colors-background-primary']);
    expect(dark['--grafana-colors-border-weak']).not.toBe(light['--grafana-colors-border-weak']);
  });

  it('follows theme options such as grid size and border radius', () => {
    const vars = getThemeCssVariables(createTheme({ spacing: { gridSize: 4 }, shape: { borderRadius: 6 } }));
    expect(vars['--grafana-spacing-grid-size']).toBe('4px');
    expect(vars['--grafana-spacing-2']).toBe('8px');
    expect(vars['--grafana-shape-radius-default']).toBe('6px');
  });

  it('emits every spacing token equal to theme.spacing(token)', () => {
    const theme = getThemeById('dark');
    const vars = getThemeCssVariables(theme);
    for (const token of THEME_SPACING_TOKENS) {
      expect(vars[getSpacingVariableName(token)]).toBe(theme.spacing(token));
    }
    expect(getSpacingVariableName(0.25)).toBe('--grafana-spacing-0-25');
  });
});

describe('getThemeCssText', () => {
  it('scopes declarations to the given selector', () => {
    const theme = getThemeById('light');
    const cssText = getThemeCssText(theme);
    expect(cssText.startsWith('body{')).toBe(true);
    expect(cssText).toContain(`--grafana-colors-border-weak:${theme.colors.border.weak};`);
    expect(getThemeCssText(theme, '.scope').startsWith('.scope{')).toBe(true);
  });
});
