import { t } from '@grafana/i18n';
import { ToolbarButton, useTheme2 } from '@grafana/ui';
import { changeTheme } from 'app/core/services/theme';
import { useLocation } from 'react-router-dom-v5-compat';

export function ThemeToggleButton() {
  const activeTheme = useTheme2();
  const { pathname } = useLocation();

  if (pathname !== '/') {
    return null;
  }

  const isDarkModeActive = activeTheme.isDark;
  const nextTheme = isDarkModeActive ? 'light' : 'dark';
  const tooltip = isDarkModeActive
    ? t('navigation.theme-toggle.switch-to-light', 'Switch to light theme')
    : t('navigation.theme-toggle.switch-to-dark', 'Switch to dark theme');
  const ariaLabel = isDarkModeActive
    ? t(
        'navigation.theme-toggle.aria-label.dark',
        'Theme is currently dark. Activate to switch to light theme.'
      )
    : t(
        'navigation.theme-toggle.aria-label.light',
        'Theme is currently light. Activate to switch to dark theme.'
      );

  return (
    <ToolbarButton
      icon={isDarkModeActive ? 'toggle-on' : 'toggle-off'}
      tooltip={tooltip}
      aria-label={ariaLabel}
      onClick={() => {
        void changeTheme(nextTheme, false);
      }}
    />
  );
}
