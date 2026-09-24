import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const rowsLayoutManagerRendererStyles = stylex.create({
  wrapper: {
    display: 'flex',
          flexDirection: 'column',
          gap: themeSpacing(1),
          flexGrow: 1,
          width: '100%',
    
          // Show rows layout controls (Add row, etc.) when hovering anywhere in the layout
          // Using > to only affect direct children, not grid controls inside rows
          '&:hover > .dashboard-canvas-controls': {
            opacity: 1,
          },
  },
});
