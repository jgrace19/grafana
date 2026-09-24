import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const dashboardAnnotationsListStyles = stylex.create({
  color: {
    display: 'inline-block',
          width: themeSpacing(1),
          height: themeSpacing(1),
          borderRadius: grafanaTokens.shape_radius_default,
          backgroundColor: grafanaTokens.colors_text_primary,
          marginRight: themeSpacing(0.5),
  },
  muted: {
    fontStyle: 'italic',
          color: grafanaTokens.colors_text_secondary,
          ':hover': {
            color: grafanaTokens.colors_text_link,
          },
  },
});
