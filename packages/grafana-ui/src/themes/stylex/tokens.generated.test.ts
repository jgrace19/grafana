import { createTheme } from '@grafana/data';

import { grafanaTokens } from './tokens.generated.stylex';
import { themeToCssVars } from './themeToCssVars.generated';

describe('StyleX theme tokens', () => {
  it('themeToCssVars maps createTheme colors to CSS variables', () => {
    const theme = createTheme({ colors: { mode: 'light' } });
    const vars = themeToCssVars(theme);
    expect(vars['--grafana-colors-text-primary']).toBe(theme.colors.text.primary);
  });

  it('generated token object is defined', () => {
    expect(grafanaTokens.colors_text_primary).toBeDefined();
  });
});
