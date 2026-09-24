import * as stylex from '@stylexjs/stylex';

import { themeSpacing } from '../../../../core/stylex/spacing';

export const tabItemRendererStyles = stylex.create({
  selectedTab: {
    '.dashboard-selected-element': {
      outlineOffset: '-2px',
    },
  },
  dragging: {
    cursor: 'move',
  },
  hidden: {
    opacity: 0.4,
    ':hover': {
      opacity: 1,
    },
  },
  tabContentContainer: {
    backgroundColor: 'transparent',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: themeSpacing(1 + 0.125),
    paddingTop: themeSpacing(1),
    ':hover .dashboard-canvas-controls': {
      opacity: 1,
    },
    ':hover .dashboard-row-wrapper .dashboard-canvas-controls': {
      opacity: 0,
    },
    ':hover .dashboard-row-wrapper:hover .dashboard-canvas-controls': {
      opacity: 1,
    },
  },
});
