import { type CSSProperties, type ReactNode, useInsertionEffect, useMemo } from 'react';

import { type GrafanaTheme2 } from '@grafana/data';

import { themeToCssVars } from './themeToCssVars';

/**
 * Writes the theme's `--gf-*` custom properties onto `<html>`, so StyleX styles everywhere (including
 * portals) resolve to the active theme. Inline properties are used because they beat the StyleX
 * `defineVars` defaults and CSSOM writes aren't subject to `style-src` CSP.
 *
 * @internal Rendered by GlobalStyles.
 */
export function useRootThemeVars(theme: GrafanaTheme2) {
  const vars = useMemo(() => themeToCssVars(theme), [theme]);

  useInsertionEffect(() => {
    const rootStyle = document.documentElement.style;
    for (const [name, value] of Object.entries(vars)) {
      rootStyle.setProperty(name, value);
    }
  }, [vars]);
}

/**
 * Style object that scopes the theme's `--gf-*` custom properties to one element subtree.
 *
 * @internal
 */
export function getThemeVarsStyle(theme: GrafanaTheme2): CSSProperties {
  const style: CSSProperties & Record<string, string> = { ...themeToCssVars(theme) };
  return style;
}

interface ScopedThemeVarsProps {
  theme: GrafanaTheme2;
  children?: ReactNode;
}

/**
 * Applies a theme to a subtree that renders with a different theme than the page (theme previews).
 * Uses `display: contents`, so it adds no box. Portalled content escapes the scope and uses the page theme.
 *
 * @internal
 */
export function ScopedThemeVars({ theme, children }: ScopedThemeVarsProps) {
  const style = useMemo(() => ({ display: 'contents', ...getThemeVarsStyle(theme) }), [theme]);
  return <div style={style}>{children}</div>;
}
