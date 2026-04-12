import { memo, useCallback } from 'react';

import { Components } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { ToolbarButton, useTheme2 } from '@grafana/ui';
import { toggleTheme } from 'app/core/services/theme';

export const ThemeModeToggle = memo(function ThemeModeToggle() {
  const theme = useTheme2();
  const isDark = theme.isDark;
  const nextThemeId = isDark ? 'light' : 'dark';

  const label = isDark
    ? t('navigation.theme-mode.switch-to-light', 'Switch to light theme')
    : t('navigation.theme-mode.switch-to-dark', 'Switch to dark theme');

  const onClick = useCallback(() => {
    reportInteraction('grafana_preferences_theme_changed', {
      toTheme: nextThemeId,
      preferenceType: 'top_bar_toggle',
    });
    void toggleTheme(false);
  }, [nextThemeId]);

  return (
    <ToolbarButton
      type="button"
      data-testid={Components.NavToolbar.themeModeToggle}
      iconOnly
      icon="exchange-alt"
      aria-label={label}
      tooltip={label}
      onClick={onClick}
    />
  );
});
