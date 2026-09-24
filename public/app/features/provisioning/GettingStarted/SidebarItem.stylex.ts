import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const sidebarItemStyles = stylex.create({
  stepItem: {
    padding: themeSpacing(1),
        cursor: 'pointer',
        ':hover': {
          background: grafanaTokens.colors_action_hover,
        },
  },
  activeStep: {
    color: grafanaTokens.colors_primary_text,
  },
  plainCard: {
    background: 'transparent',
        border: 'none',
        boxShadow: 'none',
  },
});
