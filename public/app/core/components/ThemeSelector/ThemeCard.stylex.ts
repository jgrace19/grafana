import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const themeCardStyles = stylex.create({
  card: {
    border: `1px solid ${grafanaTokens.colors_border_weak}`,
          borderRadius: grafanaTokens.shape_radius_default,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          cursor: 'pointer',
          ':hover': {
            border: `1px solid ${grafanaTokens.colors_border_medium}`,
          },
  },
  header: {
    alignItems: 'center',
          borderBottom: `1px solid ${grafanaTokens.colors_border_weak}`,
          display: 'flex',
          justifyContent: 'space-between',
          padding: themeSpacing(1),
          // The RadioButtonDot is not correctly implemented at the moment, missing cursor (And click ability for the label and input)
          '> label': {
            cursor: 'pointer',
          },
  },
});
