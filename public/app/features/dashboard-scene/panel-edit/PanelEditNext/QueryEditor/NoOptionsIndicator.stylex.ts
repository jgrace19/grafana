import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const noOptionsIndicatorStyles = stylex.create({
  wrapper: {
    display: 'flex',
        alignItems: 'center',
        gap: themeSpacing(1.5),
        padding: themeSpacing(2),
        borderRadius: grafanaTokens.shape_radius_default,
        overflow: 'hidden',
        position: 'relative',
        background: `color-mix(in srgb, ${QUERY_EDITOR_COLORS.transformation} 10%, ${grafanaTokens.colors_background_secondary} 100%)`,
    
        '::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: QUERY_EDITOR_COLORS.transformation,
        },
  },
  icon: {
    color: QUERY_EDITOR_COLORS.transformation,
        flexShrink: 0,
  },
  title: {
    fontSize: grafanaTokens.typography_body_fontSize,
        fontWeight: grafanaTokens.typography_fontWeightMedium,
        color: grafanaTokens.colors_text_primary,
  },
  description: {
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
        color: grafanaTokens.colors_text_secondary,
  },
});
