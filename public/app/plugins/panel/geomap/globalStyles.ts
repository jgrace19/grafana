import { type GrafanaTheme2 } from '@grafana/data';

import 'ol/ol.css';
import 'ol-ext/dist/ol-ext.css';

/**
 * Will be loaded *after* the css above
 */
export function getGlobalStylesCss(theme: GrafanaTheme2): string {
  const borderWeak = theme.colors.border.weak;
  const textPrimary = theme.colors.text.primary;
  const bgPrimary = theme.colors.background.primary;
  const bgSecondary = theme.colors.background.secondary;
  const secondaryText = theme.colors.secondary.text;
  const secondaryMain = theme.colors.secondary.main;
  const secondaryShade = theme.colors.secondary.shade;

  return `
    .ol-scale-line { background: ${borderWeak}; }
    .ol-scale-line-inner {
      border: 1px solid ${textPrimary};
      border-top: 0;
      color: ${textPrimary};
    }
    .ol-control { background-color: ${bgPrimary}; }
    .ol-control:hover { background-color: ${bgSecondary}; }
    .ol-control button {
      color: ${secondaryText};
      background-color: ${secondaryMain};
    }
    .ol-control button:hover {
      color: ${secondaryText};
      background-color: ${secondaryShade};
    }
    .ol-control button:focus {
      color: ${secondaryText};
      background-color: ${secondaryMain};
    }
    .ol-attribution ul {
      color: ${textPrimary};
      text-shadow: none;
    }
    .ol-attribution:not(.ol-collapsed) {
      background-color: ${bgSecondary};
    }
  `;
}
