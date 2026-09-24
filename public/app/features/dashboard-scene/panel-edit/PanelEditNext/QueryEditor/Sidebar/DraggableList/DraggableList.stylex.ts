import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../../../core/stylex/spacing';

export const draggableListStyles = stylex.create({
  droppable: {
    display: 'flex',
          flexDirection: 'column',
          position: 'relative',
  },
  draggableItem: {
    marginBottom: themeSpacing(SIDEBAR_CARD_SPACING),
          '&:last-child': {
            marginBottom: 0,
          },
          '[data-dragging] &': {
            pointerEvents: 'none',
          },
  },
  dropIndicator: {
    position: 'absolute',
          left: themeSpacing(SIDEBAR_CARD_INDENT),
          right: themeSpacing(SIDEBAR_CARD_INDENT),
          background: grafanaTokens.colors_primary_transparent,
          pointerEvents: 'none',
          borderRadius: grafanaTokens.shape_radius_default,
          overflow: 'hidden',
          '::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: grafanaTokens.colors_primary_border,
          },
  },
});
