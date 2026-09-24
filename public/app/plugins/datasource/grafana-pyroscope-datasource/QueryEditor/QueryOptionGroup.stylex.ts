import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const queryOptionGroupStyles = stylex.create({
  collapse: {
    backgroundColor: 'unset',
          border: 'unset',
          marginBottom: 0,
          ['> button']: {
            padding: themeSpacingShorthand(0, 1),
          },
  },
  wrapper: {
    width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
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
          fontWeight: grafanaTokens.typography_bodySmall_fontWeight,
          paddingLeft: themeSpacing(2),
          gap: themeSpacing(2),
          display: 'flex',
  },
  body: {
    display: 'flex',
          gap: themeSpacing(2),
          flexWrap: 'wrap',
  },
});
