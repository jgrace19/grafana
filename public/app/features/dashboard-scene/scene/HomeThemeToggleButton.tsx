import { t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { ToolbarButton, useTheme2 } from '@grafana/ui';
import { changeTheme } from 'app/core/services/theme';

import { type DashboardScene } from './DashboardScene';

export function isHomeDashboardScene(dashboard: DashboardScene) {
  const { meta, uid } = dashboard.state;
  return Boolean(uid) && !meta.url && !meta.slug && !meta.isSnapshot;
}

export function HomeThemeToggleButton() {
  const theme = useTheme2();
  const nextThemeId = theme.isDark ? 'light' : 'dark';
  const label = theme.isDark
    ? t('dashboard.toolbar.switch-to-light-mode', 'Switch to light mode')
    : t('dashboard.toolbar.switch-to-dark-mode', 'Switch to dark mode');

  const onToggleTheme = () => {
    reportInteraction('grafana_preferences_theme_changed', {
      toTheme: nextThemeId,
      preferenceType: 'home_page_toggle',
    });
    changeTheme(nextThemeId, false);
  };

  return (
    <ToolbarButton icon="palette" onClick={onToggleTheme} tooltip={label}>
      {label}
    </ToolbarButton>
  );
}
