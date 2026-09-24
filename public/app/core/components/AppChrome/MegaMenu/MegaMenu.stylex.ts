import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../stylex/spacing';

export const megaMenuStyles = stylex.create({
  content: {
    display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          flexGrow: 1,
          position: 'relative',
  },
  mobileHeader: {
    display: 'flex',
          justifyContent: 'space-between',
          padding: themeSpacingShorthand(1, 1, 1, 2),
          borderBottom: `1px solid ${grafanaTokens.colors_border_weak}`,
    
          [theme.breakpoints.up('md')]: {
            display: 'none',
          },
  },
  itemList: {
    boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          listStyleType: 'none',
          padding: themeSpacingShorthand(1, 1, 2, 0.5),
          [theme.breakpoints.up('md')]: {
            width: MENU_WIDTH,
          },
  },
  dockMenuButton: {
    display: 'none',
          position: 'relative',
          top: themeSpacing(1),
    
          [theme.breakpoints.up('xl')]: {
            display: 'inline-flex',
          },
  },
});
