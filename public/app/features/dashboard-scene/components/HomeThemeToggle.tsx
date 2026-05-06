import { css } from '@emotion/css';

import { type GrafanaTheme2 } from '@grafana/data';
import { t } from '@grafana/i18n';
import { useChromeHeaderHeight } from '@grafana/runtime';
import { InlineSwitch, Tooltip, useStyles2, useTheme2 } from '@grafana/ui';
import { toggleTheme } from 'app/core/services/theme';

export function HomeThemeToggle() {
  const theme = useTheme2();
  const chromeTop = useChromeHeaderHeight() ?? 0;
  const styles = useStyles2(getStyles);
  const isDark = theme.isDark;
  const tooltip = isDark
    ? t('home.theme-toggle.switch-to-light', 'Switch to light theme')
    : t('home.theme-toggle.switch-to-dark', 'Switch to dark theme');
  const label = t('home.theme-toggle.dark-mode', 'Dark mode');

  return (
    <div
      className={styles.wrap}
      data-testid="home-theme-toggle"
      style={{ top: chromeTop + theme.spacing(2) }}
    >
      <Tooltip content={tooltip}>
        <InlineSwitch
          label={label}
          showLabel
          transparent
          value={isDark}
          onChange={(e) => {
            const nextDark = e.currentTarget.checked;
            if (nextDark !== isDark) {
              void toggleTheme(false);
            }
          }}
        />
      </Tooltip>
    </div>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  wrap: css({
    position: 'fixed',
    right: theme.spacing(3),
    zIndex: theme.zIndex.navbarFixed + 1,
    boxShadow: theme.shadows.z2,
    borderRadius: theme.shape.radius.default,
    background: theme.colors.background.primary,
    padding: theme.spacing(0.5, 1),
  }),
});
