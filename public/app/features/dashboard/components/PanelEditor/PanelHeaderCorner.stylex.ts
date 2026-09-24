import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const panelHeaderCornerStyles = stylex.create({
  icon: {
    position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 2,
          fill: grafanaTokens.colors_text_maxContrast,
  },
  iconLinks: {
    left: themeSpacing(0.5),
          top: themeSpacing(0.25),
  },
  inner: {
    width: 0,
          height: 0,
          position: 'absolute',
          left: 0,
          bottom: 0,
          borderBottom: `${themeSpacing(4)} solid transparent`,
          borderLeft: `${themeSpacing(4)} solid ${grafanaTokens.colors_background_secondary}`,
  },
  error: {
    borderLeftColor: grafanaTokens.colors_error_main,
  },
  infoCorner: {
    background: 'none',
          border: 'none',
          color: grafanaTokens.colors_text_secondary,
          cursor: 'pointer',
          position: 'absolute',
          left: 0,
          top: 0,
          width: themeSpacing(4),
          height: themeSpacing(4),
          zIndex: 3,
  },
});
