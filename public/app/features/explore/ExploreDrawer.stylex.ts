import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const exploreDrawerStyles = stylex.create({
  fixed: {
    position: 'absolute !important',
  },
  container: {
    bottom: 0,
        background: grafanaTokens.colors_background_primary,
        borderTop: `1px solid ${grafanaTokens.colors_border_weak}`,
        boxShadow: grafanaTokens.shadows_z3,
        zIndex: grafanaTokens.zIndex_navbarFixed,
  },
  drawerActive: {
    opacity: 1,
        [theme.transitions.handleMotion('no-preference')]: {
          animation: `0.5s ease-out ${drawerSlide(theme)}`,
        },
  },
});
