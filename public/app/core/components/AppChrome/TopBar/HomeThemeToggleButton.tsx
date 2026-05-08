import { useLocation } from 'react-router-dom-v5-compat';

import { locationUtil } from '@grafana/data';
import { t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { ToolbarButton, useTheme2 } from '@grafana/ui';
import { changeTheme } from 'app/core/services/theme';
import { contextSrv } from 'app/core/services/context_srv';

export function HomeThemeToggleButton() {
  const location = useLocation();

  if (!contextSrv.isSignedIn || !isHomePath(location.pathname)) {
    return null;
  }

  return <ThemeToggleButton />;
}

export function ThemeToggleButton() {
  const theme = useTheme2();
  const nextTheme = theme.isDark ? 'light' : 'dark';
  const label = theme.isDark
    ? t('navigation.theme-toggle.switch-to-light', 'Switch to light mode')
    : t('navigation.theme-toggle.switch-to-dark', 'Switch to dark mode');

  return (
    <ToolbarButton
      iconOnly
      icon={theme.isDark ? 'toggle-on' : 'toggle-off'}
      aria-label={label}
      aria-pressed={theme.isDark}
      tooltip={label}
      onClick={() => {
        reportInteraction('grafana_homepage_theme_toggle_clicked', { toTheme: nextTheme });
        void changeTheme(nextTheme, false);
      }}
    />
  );
}

export function isHomePath(pathname: string) {
  const pathWithoutBaseUrl = locationUtil.stripBaseFromUrl(pathname);
  return pathWithoutBaseUrl === '/' || pathWithoutBaseUrl === '';
}
