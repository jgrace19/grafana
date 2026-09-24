import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const queryOptionsStyles = stylex.create({
  switchLabel: {
    color: grafanaTokens.colors_text_secondary,
          cursor: 'pointer',
          fontSize: grafanaTokens.typography_bodySmall_fontSize,
          ':hover': {
            color: grafanaTokens.colors_text_primary,
          },
  },
  header: {
    display: 'flex',
          cursor: 'pointer',
          alignItems: 'baseline',
          color: grafanaTokens.colors_text_primary,
          ':hover': {
            background: /* UNMAPPED theme.colors.emphasize */ 'inherit'(grafanaTokens.colors_background_primary, 0.03),
          },
  },
  title: {
    flexGrow: 1,
          overflow: 'hidden',
          fontSize: grafanaTokens.typography_bodySmall_fontSize,
          fontWeight: grafanaTokens.typography_fontWeightMedium,
          margin: 0,
  },
  description: {
    color: grafanaTokens.colors_text_secondary,
          fontSize: grafanaTokens.typography_bodySmall_fontSize,
          paddingLeft: themeSpacing(2),
          gap: themeSpacing(2),
          display: 'flex',
  },
  body: {
    display: 'flex',
          paddingTop: themeSpacing(2),
          gap: themeSpacing(2),
          flexWrap: 'wrap',
  },
  toggle: {
    color: grafanaTokens.colors_text_secondary,
          marginRight: `${themeSpacing(1)}`,
  },
});
