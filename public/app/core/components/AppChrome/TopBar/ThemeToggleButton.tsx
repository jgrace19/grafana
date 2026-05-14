import { type IconName } from '@grafana/data';
import { t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { ToolbarButton, useTheme2 } from '@grafana/ui';
import { changeTheme } from 'app/core/services/theme';

export function ThemeToggleButton() {
  const theme = useTheme2();
  const nextTheme = theme.isDark ? 'light' : 'dark';
  const label = theme.isDark
    ? t('navigation.theme-toggle.switch-to-light', 'Switch to light theme')
    : t('navigation.theme-toggle.switch-to-dark', 'Switch to dark theme');
  const icon: IconName = theme.isDark ? 'toggle-on' : 'toggle-off';

  const onToggleTheme = () => {
    reportInteraction('grafana_navigation_theme_toggled', {
      toTheme: nextTheme,
      source: 'top_bar',
    });
    changeTheme(nextTheme, false);
  };

  return (
    <ToolbarButton
      iconOnly
      icon={icon}
      aria-label={label}
      tooltip={label}
      onClick={onToggleTheme}
    />
  );
}
