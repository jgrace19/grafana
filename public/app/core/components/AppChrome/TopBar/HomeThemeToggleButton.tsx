import { css } from '@emotion/css';
import { type ChangeEvent, memo, useCallback, useId, useState } from 'react';
import { useLocation } from 'react-router-dom-v5-compat';

import { type GrafanaTheme2 } from '@grafana/data';
import { t } from '@grafana/i18n';
import { config, reportInteraction } from '@grafana/runtime';
import { InlineSwitch, useStyles2, useTheme2 } from '@grafana/ui';
import { changeTheme } from 'app/core/services/theme';

/** True when the URL is the Grafana home route (`/` or `{appSubUrl}/`). */
export function isHomePath(pathname: string): boolean {
  const base = config.appSubUrl || '';
  return pathname === `${base}/` || pathname === base;
}

export const HomeThemeToggleButton = memo(function HomeThemeToggleButton() {
  const { pathname } = useLocation();
  const theme = useTheme2();
  const [busy, setBusy] = useState(false);
  const switchId = useId();
  const styles = useStyles2(getStyles);

  const isDark = theme.isDark;

  const onChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const nextIsDark = event.currentTarget.checked;
      const nextTheme = nextIsDark ? 'dark' : 'light';
      reportInteraction('grafana_home_theme_toggle_clicked', { toTheme: nextTheme });
      setBusy(true);
      try {
        await changeTheme(nextTheme, false);
      } finally {
        setBusy(false);
      }
    },
    []
  );

  if (!isHomePath(pathname)) {
    return null;
  }

  const label = t('navigation.home-theme-toggle.dark-mode', 'Dark mode');

  return (
    <div className={styles.root}>
      <InlineSwitch
        id={switchId}
        transparent
        showLabel
        label={label}
        value={isDark}
        disabled={busy}
        onChange={onChange}
      />
    </div>
  );
});

HomeThemeToggleButton.displayName = 'HomeThemeToggleButton';

function getStyles(theme: GrafanaTheme2) {
  return {
    root: css({
      display: 'inline-flex',
      alignItems: 'center',
      flexShrink: 0,
      minHeight: theme.spacing(4),
    }),
  };
}
