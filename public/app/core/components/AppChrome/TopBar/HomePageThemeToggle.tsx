import { memo } from 'react';
import { useLocation } from 'react-router-dom-v5-compat';

import { t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { ToolbarButton, useTheme2 } from '@grafana/ui';
import { toggleTheme } from 'app/core/services/theme';

const normalizePath = (path: string): string => {
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  const withoutTrailingSlashes = withLeadingSlash.replace(/\/+$/, '');
  return withoutTrailingSlashes === '' ? '/' : withoutTrailingSlashes;
};

const isHomePath = (pathname: string): boolean => {
  const normalizedPathname = normalizePath(pathname);
  return normalizedPathname === '/';
};

export const HomePageThemeToggle = memo(function HomePageThemeToggle() {
  const location = useLocation();
  const theme = useTheme2();

  if (!isHomePath(location.pathname)) {
    return null;
  }

  const nextTheme = theme.isDark ? 'light' : 'dark';
  const toggleLabel = t('navigation.theme-toggle.home.aria-label', 'Switch to {{theme}} mode', {
    theme: nextTheme,
  });

  return (
    <ToolbarButton
      iconOnly
      icon="adjust-circle"
      aria-label={toggleLabel}
      tooltip={toggleLabel}
      onClick={() => {
        reportInteraction('grafana_home_theme_toggle', {
          toTheme: nextTheme,
        });
        void toggleTheme(false);
      }}
    />
  );
});
