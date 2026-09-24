import { useInsertionEffect, useMemo } from 'react';

import { useTheme2 } from '../ThemeContext';
import { useRootCssVars, useRootThemeVars } from '../stylex/ThemeVars';

import './GlobalStyles.global.css';
import { registerFonts } from './fonts';
import { getGlobalThemeVars } from './globalThemeVars';

/**
 * Global element styles (static CSS in `@layer grafana-global`, below StyleX and unlayered component CSS) plus
 * the theme's `--gf-*` custom properties on `<html>` and Grafana's web fonts.
 *
 * @internal
 */
export function GlobalStyles() {
  const theme = useTheme2();
  useRootThemeVars(theme);
  useRootCssVars(useMemo(() => getGlobalThemeVars(theme), [theme]));

  useInsertionEffect(registerFonts, []);

  return null;
}
