import { Global, css, type SerializedStyles } from '@emotion/react';

import { type GrafanaTheme2 } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';

/**
 * Legacy `public/sass/_grafana.scss` html/body rules, expressed with GrafanaTheme2.
 * Injects before the main app GlobalStyles; the latter refines body layout (e.g. position)
 * for the running application.
 */
export function getPreloaderGlobalStyles(theme: GrafanaTheme2): SerializedStyles {
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

/** Emotion global styles for the initial document shell (formerly Sass preloader rules). */
export function PreloaderGlobalStyles() {
  const theme = useTheme2();
  return <Global styles={getPreloaderGlobalStyles(theme)} />;
}
