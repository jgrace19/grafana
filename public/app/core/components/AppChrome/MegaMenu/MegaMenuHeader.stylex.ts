import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../stylex/spacing';

export const megaMenuHeaderStyles = stylex.create({
  dockMenuButton: {
    display: 'none',
    
        [theme.breakpoints.up('xl')]: {
          display: 'inline-flex',
        },
  },
  header: {
    alignItems: 'center',
        borderBottom: `1px solid ${grafanaTokens.colors_border_weak}`,
        display: 'flex',
        gap: themeSpacing(1),
        justifyContent: 'space-between',
        padding: themeSpacingShorthand(0, 1, 0, 1),
        height: getChromeHeaderLevelHeight(),
        flexShrink: 0,
  },
  flexGrow: {
    flexGrow: 1
  },
});
