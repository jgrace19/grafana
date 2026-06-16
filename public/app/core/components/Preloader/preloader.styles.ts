import { css, type SerializedStyles } from '@emotion/react';

import { type GrafanaTheme2 } from '@grafana/data';

const PRELOADER_STYLE_ID = 'grafana-preloader-root-styles';

/**
 * Matches the legacy `public/sass/_grafana.scss` html/body scaffolding using GrafanaTheme2 tokens.
 * Loaded via Emotion `Global` at runtime (see {@link ./PreloaderGlobalStyles.tsx}). Injected briefly
 * before React mounts via {@link injectPreloaderDocumentStyles} because theme CSS bundles no longer emit these rules at link time.
 */
export function getPreloaderRootStyles(theme: GrafanaTheme2): SerializedStyles {
  return css({
    html: {
      fontSize: `${(theme.typography.htmlFontSize ?? theme.typography.fontSize)}px`,
      height: '100%',
    },
    body: {
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.body.fontSize,
      lineHeight: theme.typography.body.lineHeight,
      fontWeight: theme.typography.body.fontWeight,
      color: theme.colors.text.primary,
      backgroundColor: theme.colors.background.canvas,
      height: '100%',
      width: '100%',
      margin: 0,
      position: 'absolute',
    },
  });
}

/** Before React renders, restores the scoped html/body rules that used to ship in theme CSS bundles. */
export function injectPreloaderDocumentStyles(theme: GrafanaTheme2): void {
  if (document.getElementById(PRELOADER_STYLE_ID)) {
    return;
  }
  const style = document.createElement('style');
  style.id = PRELOADER_STYLE_ID;
  style.textContent = `
html{font-size:${(theme.typography.htmlFontSize ?? theme.typography.fontSize)}px;height:100%}
body{font-family:${theme.typography.fontFamily};font-size:${theme.typography.body.fontSize};line-height:${theme.typography.body.lineHeight};font-weight:${theme.typography.body.fontWeight};color:${theme.colors.text.primary};background-color:${theme.colors.background.canvas};height:100%;width:100%;margin:0;position:absolute}
`;
  document.head.appendChild(style);
}
