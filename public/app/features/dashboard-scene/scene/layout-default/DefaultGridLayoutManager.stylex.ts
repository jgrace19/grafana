import * as stylex from '@stylexjs/stylex';

import { themeSpacing } from '../../../../core/stylex/spacing';

export const defaultGridLayoutManagerStyles = stylex.create({
  container: {
    width: '100%',
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
  },
  containerEditing: {
    ':hover .dashboard-canvas-controls': {
      opacity: 1,
    },
    ' > div:first-child': {
      flexGrow: '0 !important',
      minHeight: 1,
    },
  },
  actionsWrapper: {
    position: 'relative',
    paddingBottom: themeSpacing(5),
  },
});
