import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const libraryVizPanelInfoStyles = stylex.create({
  info: {
    lineHeight: 1,
  },
  libraryPanelInfo: {
    color: grafanaTokens.colors_text_secondary,
          fontSize: grafanaTokens.typography_bodySmall_fontSize,
  },
  userAvatar: {
    borderRadius: grafanaTokens.shape_radius_circle,
          boxSizing: 'content-box',
          width: '22px',
          height: '22px',
          paddingLeft: themeSpacing(1),
          paddingRight: themeSpacing(1),
  },
});
