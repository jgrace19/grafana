import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const panelNonApplicableDrilldownsSubHeaderStyles = stylex.create({
  container: {
    display: 'flex',
          flexWrap: 'nowrap',
          gap: themeSpacing(1),
          width: '100%',
          overflow: 'hidden',
  },
  pill: {
    padding: themeSpacingShorthand(0.2, 0.4),
          borderRadius: grafanaTokens.shape_radius_default,
          whiteSpace: 'nowrap',
          flexShrink: 0,
          fontSize: grafanaTokens.typography_bodySmall_fontSize,
  },
  disabledPill: {
    background: grafanaTokens.colors_action_selected,
          color: grafanaTokens.colors_text_disabled,
          border: 0,
          ':hover': {
            background: grafanaTokens.colors_action_selected,
          },
  },
  strikethrough: {
    textDecoration: 'line-through',
  },
});
