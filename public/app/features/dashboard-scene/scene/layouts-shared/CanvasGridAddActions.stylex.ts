import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const canvasGridAddActionsStyles = stylex.create({
  addAction: {
    position: 'absolute',
        padding: themeSpacingShorthand(1, 0),
        height: themeSpacing(5),
        bottom: 0,
        left: 0,
        opacity: 0,
        ['@media (prefers-reduced-motion: no-preference), @media (prefers-reduced-motion: reduce)']: {
          transitionProperty: 'opacity',
          transitionDuration: '150ms',
        },
  },
  menuOpen: {
    '&.dashboard-canvas-controls': {
          opacity: 1,
        },
  },
  disabledMenuItem: {
    // Make the label inherit the disabled text color from the parent
        '& > div > span': {
          color: 'inherit',
        },
  },
});
