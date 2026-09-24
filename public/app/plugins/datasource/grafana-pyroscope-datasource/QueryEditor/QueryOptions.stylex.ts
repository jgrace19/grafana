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
  body: {
    display: 'flex',
          paddingTop: themeSpacing(2),
          gap: themeSpacing(2),
          flexWrap: 'wrap',
  },
});
