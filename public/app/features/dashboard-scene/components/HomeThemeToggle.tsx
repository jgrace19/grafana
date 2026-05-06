import { css } from '@emotion/css';

import { type GrafanaTheme2 } from '@grafana/data';
import { t } from '@grafana/i18n';
import { ToolbarButton, useStyles2, useTheme2 } from '@grafana/ui';
import { toggleTheme } from 'app/core/services/theme';

export function HomeThemeToggle() {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);
  const isDark = theme.isDark;
  const tooltip = isDark
    ? t('home.theme-toggle.switch-to-light', 'Switch to light theme')
    : t('home.theme-toggle.switch-to-dark', 'Switch to dark theme');
  const label = isDark
    ? t('home.theme-toggle.light', 'Light')
    : t('home.theme-toggle.dark', 'Dark');

  return (
    <div className={styles.wrap} data-testid="home-theme-toggle">
      <ToolbarButton
        icon="palette"
        variant="canvas"
        tooltip={tooltip}
        aria-label={tooltip}
        onClick={() => {
          void toggleTheme(false);
        }}
        narrow
      >
        {label}
      </ToolbarButton>
    </div>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  wrap: css({
    position: 'fixed',
    right: theme.spacing(3),
    bottom: theme.spacing(3),
    zIndex: theme.zIndex.navbarFixed + 1,
    boxShadow: theme.shadows.z2,
    borderRadius: theme.shape.radius.default,
    background: theme.colors.background.primary,
  }),
});
