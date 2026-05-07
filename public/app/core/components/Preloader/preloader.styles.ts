import { css } from '@emotion/react';

import { type GrafanaTheme2 } from '@grafana/data';

/** html/body baseline for the static preloader and early load; GlobalStyles layers on top. */
export function getPreloaderGlobalStyles(theme: GrafanaTheme2) {
  return css({
    html: {
      fontSize: `${theme.typography.htmlFontSize}px`,
      height: '100%',
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
  });
}
