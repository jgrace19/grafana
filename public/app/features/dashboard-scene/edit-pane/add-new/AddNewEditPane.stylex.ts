import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const addNewEditPaneStyles = stylex.create({
  wrapper: {
    display: 'flex',
          flexDirection: 'column',
          flex: '1 1 0',
          height: '100%',
  },
  dragging: {
    cursor: 'move',
  },
  imageContainer: {
    cursor: 'pointer',
          opacity: 0.8,
          overflow: 'hidden',
          borderRadius: grafanaTokens.shape_radius_sm,
          width: '100%',
          ':hover': {
            opacity: 1,
          },
  },
  pasteButton: {
    width: '100%',
          marginTop: themeSpacing(2),
  },
});
