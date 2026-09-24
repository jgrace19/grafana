import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const appChromeMenuStyles = stylex.create({
  backdrop: {
    backgroundColor: theme.components.overlay.background,
          bottom: 0,
          left: 0,
          position: 'fixed',
          right: 0,
          top: 0,
          zIndex: grafanaTokens.zIndex_modalBackdrop,
  },
  menu: {
    display: 'flex',
          bottom: 0,
          flexDirection: 'column',
          left: 0,
          right: 0,
          // Needs to below navbar should we change the navbarFixed? add add a new level?
          zIndex: grafanaTokens.zIndex_modal,
          position: 'fixed',
          top: 0,
          backgroundColor: grafanaTokens.colors_background_primary,
          flex: '1 1 0',
    
          [theme.breakpoints.up('md')]: {
            right: 'unset',
          },
  },
  wrapper: {
    position: 'fixed',
          display: 'grid',
          gridAutoFlow: 'column',
          height: '100%',
          zIndex: grafanaTokens.zIndex_sidemenu,
  },
});
