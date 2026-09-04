import { type ThemeRegistryItem } from '@grafana/data';
import { t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { ToolbarButton, useTheme2 } from '@grafana/ui';
import { changeTheme } from 'app/core/services/theme';

export function HomeThemeToggle() {
  const theme = useTheme2();
  const nextThemeId: ThemeRegistryItem['id'] = theme.isDark ? 'light' : 'dark';
  const label = theme.isDark
    ? t('dashboard.home-theme-toggle.light-mode', 'Light mode')
    : t('dashboard.home-theme-toggle.dark-mode', 'Dark mode');
  const tooltip = theme.isDark
    ? t('dashboard.home-theme-toggle.switch-to-light-mode', 'Switch to light mode')
    : t('dashboard.home-theme-toggle.switch-to-dark-mode', 'Switch to dark mode');

  const onToggleTheme = () => {
    reportInteraction('grafana_preferences_theme_changed', {
      toTheme: nextThemeId,
      preferenceType: 'home_page_toggle',
    });
    changeTheme(nextThemeId, false);
  };

  return (
    <ToolbarButton icon="palette" tooltip={tooltip} onClick={onToggleTheme}>
      {label}
    </ToolbarButton>
  );
}
