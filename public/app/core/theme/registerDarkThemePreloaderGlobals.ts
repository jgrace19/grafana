import { css, injectGlobal } from '@emotion/css';

import { getThemeById, type GrafanaTheme2 } from '@grafana/data';

/** Last boot-time theme id we injected html/body globals for (handles extra dark themes). */
let lastInjectedPreloaderThemeId: string | undefined;

function injectDarkBootstrapGlobals(themeId: string, theme: GrafanaTheme2): void {
  if (!theme.isDark) {
    lastInjectedPreloaderThemeId = undefined;
    return;
  }

  if (lastInjectedPreloaderThemeId === themeId) {
    return;
  }
  lastInjectedPreloaderThemeId = themeId;

  injectGlobal(
    css({
      html: {
        fontSize: `${theme.typography.htmlFontSize}px`,
        height: '100%',
      },

      ':root': {
        colorScheme: theme.colors.mode,
      },

      body: {
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.body.fontSize,
        lineHeight: theme.typography.body.lineHeight,
        color: theme.colors.text.primary,
        backgroundColor: theme.colors.background.canvas,
        height: '100%',
        width: '100%',
        margin: 0,
        position: 'absolute',
      },
    })
  );
}

/**
 * Mirrors the legacy `public/sass/_grafana.scss` html/body preload rules using GrafanaTheme2
 * from boot data (`getThemeById`), so `grafana.dark.scss` only needs sass for FontAwesome + Angular remnants.
 *
 * Runs before `./initApp` so deferred JS applies canvas/text colors shortly after stylesheet load.
 */
export function registerDarkThemePreloaderGlobals(): void {
  if (typeof document === 'undefined') {
    return;
  }

  const themeId = window.grafanaBootData?.user?.theme;
  if (!themeId) {
    return;
  }

  injectDarkBootstrapGlobals(themeId, getThemeById(themeId));
}
