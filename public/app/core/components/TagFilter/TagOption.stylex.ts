import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const tagOptionStyles = stylex.create({
  option: {
    padding: themeSpacing(0.5),
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          borderLeft: '2px solid transparent',
          borderRadius: grafanaTokens.shape_radius_default,
          ':hover': {
            background: grafanaTokens.colors_action_hover,
          },
  },
  optionFocused: {
    background: grafanaTokens.colors_action_focus,
          borderStyle: 'solid',
          borderTop: 0,
          borderRight: 0,
          borderBottom: 0,
          borderLeftWidth: '2px',
  },
  optionInner: {
    position: 'relative',
          textAlign: 'left',
          width: '100%',
          display: 'block',
          cursor: 'pointer',
          padding: '2px 0',
  },
});
