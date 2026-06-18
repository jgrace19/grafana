import { css } from '@emotion/css';
import { useCallback } from 'react';

import { type GrafanaTheme2 } from '@grafana/data';
import { t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { Stack, Switch, Text, useStyles2, useTheme2 } from '@grafana/ui';

import { changeTheme } from 'app/core/services/theme';

export function HomeThemeToggle() {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);
  const isDark = theme.isDark;

  const onChange = useCallback(() => {
    const nextTheme = isDark ? 'light' : 'dark';
    reportInteraction('grafana_home_page_theme_toggle', { toTheme: nextTheme });
    void changeTheme(nextTheme, false);
  }, [isDark]);

  return (
    <div
      className={styles.container}
      data-testid="home-theme-toggle"
      role="region"
      aria-label={t('home.theme-toggle.region', 'Color mode')}
    >
      <Stack direction="row" gap={1} alignItems="center" wrap={false}>
        <Text variant="bodySmall" color="secondary">
          {t('home.theme-toggle.light', 'Light')}
        </Text>
        <Switch
          value={isDark}
          onChange={onChange}
          label={t('home.theme-toggle.aria', 'Switch between light and dark color mode')}
        />
        <Text variant="bodySmall" color="secondary">
          {t('home.theme-toggle.dark', 'Dark')}
        </Text>
      </Stack>
    </div>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  container: css({
    label: 'home-theme-toggle',
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: theme.zIndex.navbarFixed + 1,
    padding: theme.spacing(1, 1.5),
    borderRadius: theme.shape.borderRadius(),
    background: theme.colors.background.elevated,
    border: `1px solid ${theme.colors.border.weak}`,
    boxShadow: theme.shadows.z1,
  }),
});
