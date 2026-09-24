import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing } from '../../stylex/spacing';

import { MENU_WIDTH } from './MegaMenu/MegaMenu';

const upXl = '@media (min-width: 1200px)';

export const appChromeStyles = stylex.create({
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    height: 'auto',
  },
  contentWithSidebar: {
    height: '100vh',
    overflow: 'hidden',
  },
  contentChromeless: {
    paddingTop: 0,
  },
  dockedMegaMenu: {
    background: grafanaTokens.colors_background_primary,
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: grafanaTokens.colors_border_weak,
    display: 'none',
    height: '100%',
    position: 'fixed',
    top: 0,
    width: MENU_WIDTH,
    zIndex: 2,
    [upXl]: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  scopesDashboardsContainer: {
    position: 'fixed',
    zIndex: 1,
  },
  scopesDashboardsContainerDocked: {
    left: MENU_WIDTH,
  },
  topNav: {
    display: 'flex',
    position: 'fixed',
    zIndex: grafanaTokens.zIndex_navbarFixed,
    left: 0,
    right: 0,
    background: grafanaTokens.colors_background_primary,
    flexDirection: 'column',
  },
  topNavMenuDocked: {
    left: MENU_WIDTH,
  },
  panes: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  panesWithSidebar: {
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  pageContainerMenuDocked: {
    paddingLeft: MENU_WIDTH,
  },
  pageContainerMenuDockedScopes: {
    paddingLeft: `calc(${MENU_WIDTH} * 2)`,
  },
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  pageContainerWithSidebar: {
    overflow: 'auto',
    height: '100%',
    minHeight: 0,
  },
  skipLink: {
    position: 'fixed',
    top: -1000,
    ':focus': {
      left: themeSpacing(1),
      top: themeSpacing(1),
      zIndex: grafanaTokens.zIndex_portal,
    },
  },
  sidebarContainer: {
    position: 'fixed',
    bottom: 0,
    zIndex: grafanaTokens.zIndex_navbarFixed + 1,
    right: 0,
  },
});
