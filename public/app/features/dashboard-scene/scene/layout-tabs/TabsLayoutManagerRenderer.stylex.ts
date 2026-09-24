import * as stylex from '@stylexjs/stylex';

import { themeSpacing } from '../../../../core/stylex/spacing';

export const tabsLayoutManagerRendererStyles = stylex.create({
  tabLayoutContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
  },
  tabsBar: {
    ':hover .dashboard-canvas-controls, :focus-within .dashboard-canvas-controls': {
      opacity: 1,
    },
  },
  tabsRow: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
  },
  tabsContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    overflowX: 'auto',
    overflowY: 'hidden',
    paddingInline: themeSpacing(0.125),
    paddingTop: 1,
  },
  tabControls: {
    marginLeft: themeSpacing(1),
  },
  nestedTabsMargin: {
    marginLeft: themeSpacing(2),
  },
});
