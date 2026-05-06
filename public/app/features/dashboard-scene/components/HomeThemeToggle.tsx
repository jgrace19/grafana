import { css } from '@emotion/css';
import { createPortal } from 'react-dom';

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

  // Portals keep `position: fixed` relative to the viewport. Without this, ancestors
  // (e.g. #floating-boundary / transformed layout) create a containing block so `top`
  // aligns to page panes instead of the visible header — the control can sit under chrome.
  return createPortal(
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
    </div>,
    document.body
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  wrap: css({
    position: 'fixed',
    right: theme.spacing(3),
    zIndex: theme.zIndex.tooltip,
    boxShadow: theme.shadows.z2,
    borderRadius: theme.shape.radius.default,
    background: theme.colors.background.primary,
    padding: theme.spacing(0.5, 1),
  }),
});
