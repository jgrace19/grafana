import clsx from 'clsx';
import { useEffect, useMemo, type CSSProperties, type ReactNode } from 'react';

import { type GrafanaTheme2 } from '@grafana/data';

import { grafanaDarkTheme } from './tokens.generated.stylex';
import { themeToCssVars } from './themeToCssVars.generated';

export interface StyleXThemeScopeProps {
  theme: GrafanaTheme2;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Applies runtime theme values as CSS variables for StyleX tokens and sets the dark StyleX theme class.
 */
export function StyleXThemeScope({ theme, children, className, style }: StyleXThemeScopeProps) {
  useEffect(() => {
    const id = 'grafana-stylex-layers';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id;
      el.textContent = '@layer reset, grafana-global, grafana-stylex;';
      document.head.prepend(el);
    }
  }, []);

  const cssVars = useMemo(() => themeToCssVars(theme), [theme]);
  const themeClass = theme.isDark ? grafanaDarkTheme : undefined;

  return (
    <div
      className={clsx(themeClass, className)}
      style={{ ...cssVars, ...style }}
      data-grafana-theme={theme.isDark ? 'dark' : 'light'}
    >
      {children}
    </div>
  );
}
