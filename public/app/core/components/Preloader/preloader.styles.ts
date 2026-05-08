import { css } from '@emotion/react';

import { type GrafanaTheme2 } from '@grafana/data';

/**
 * Base html/body rules previously shipped in `public/sass/_grafana.scss` so the linked
 * theme CSS bundled them before React. They are mirrored here via Emotion alongside
 * the rest of Grafana global styles (`getElementStyles` in @grafana/ui).
 */
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
      letterSpacing: theme.typography.body.letterSpacing,
      fontWeight: theme.typography.body.fontWeight,
      color: theme.colors.text.primary,
      backgroundColor: theme.colors.background.canvas,
      height: '100%',
      width: '100%',
      margin: 0,
    },
  });
}
