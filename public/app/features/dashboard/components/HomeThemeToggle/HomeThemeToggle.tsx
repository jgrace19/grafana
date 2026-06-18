import { css } from '@emotion/css';

import { type GrafanaTheme2 } from '@grafana/data';
import { t } from '@grafana/i18n';
import { RadioButtonGroup, useStyles2, useTheme2 } from '@grafana/ui';
import { changeTheme } from 'app/core/services/theme';

export function HomeThemeToggle() {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);

  const onChange = (value: string) => {
    if (value === 'light' || value === 'dark') {
      void changeTheme(value);
    }
  };

  return (
    <div className={styles.wrapper} data-testid="home-theme-toggle">
      <RadioButtonGroup
        options={[
          { value: 'light', label: t('command-palette.action.light-theme', 'Light') },
          { value: 'dark', label: t('command-palette.action.dark-theme', 'Dark') },
        ]}
        value={theme.colors.mode}
        onChange={onChange}
        size="sm"
        aria-label={t('dashboard.home-theme-toggle.aria-label', 'Color scheme')}
      />
    </div>
  );
}

function getStyles(theme: GrafanaTheme2) {
  return {
    wrapper: css({
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      zIndex: theme.zIndex.portal,
      padding: theme.spacing(0.25, 0.5),
      borderRadius: theme.shape.radius.default,
      backgroundColor: theme.colors.background.primary,
      border: `1px solid ${theme.colors.border.weak}`,
      boxShadow: theme.shadows.z3,
    }),
  };
}
