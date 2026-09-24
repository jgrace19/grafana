import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const orangeBadgeStyles = stylex.create({
  wrapper: {
    display: 'inline-flex',
          padding: themeSpacingShorthand(0.5, 1),
          borderRadius: grafanaTokens.shape_radius_pill,
          background: grafanaTokens.colors_gradients_brandHorizontal,
          color: grafanaTokens.colors_primary_contrastText,
          fontWeight: grafanaTokens.typography_fontWeightMedium,
          gap: themeSpacing(0.5),
          fontSize: grafanaTokens.typography_bodySmall_fontSize,
          lineHeight: grafanaTokens.typography_bodySmall_lineHeight,
          alignItems: 'center',
          ...(text === undefined && {
            svg: {
              marginRight: 0,
            },
  },
});
