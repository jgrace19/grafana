import { useLocation } from 'react-router-dom-v5-compat';

import { t } from '@grafana/i18n';
import { config, reportInteraction } from '@grafana/runtime';
import { ToolbarButton, useTheme2 } from '@grafana/ui';
import { toggleTheme } from 'app/core/services/theme';

/**
 * Theme quick-toggle shown on the home dashboard only (route `/`), so users can
 * switch light/dark without opening profile preferences.
 */
export function HomePageThemeToggle() {
  const location = useLocation();
  const theme = useTheme2();

  const fullPath =
    `${config.appSubUrl}${location.pathname}`.replace(/\/+$/, '') || '/';
  const homePath = `${config.appSubUrl ?? ''}`.replace(/\/+$/, '') || '/';
  if (fullPath !== homePath) {
    return null;
  }

  const isDark = theme.isDark;
  const label = isDark
    ? t('navigation.home-theme-toggle.use-light', 'Switch to light mode')
    : t('navigation.home-theme-toggle.use-dark', 'Switch to dark mode');

  return (
    <ToolbarButton
      narrow
      icon="adjust-circle"
      onClick={() => {
        reportInteraction('grafana_home_theme_toggle', { from: isDark ? 'dark' : 'light' });
        void toggleTheme(false);
      }}
      tooltip={label}
      aria-label={label}
    />
  );
}
