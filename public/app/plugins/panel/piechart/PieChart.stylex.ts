import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const pieChartStyles = stylex.create({
  container: {
    width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
  },
  normal: {
    [theme.transitions.handleMotion('no-preference')]: {
              transition: 'all 200ms ease-in-out',
            },
  },
  highlighted: {
    [theme.transitions.handleMotion('no-preference')]: {
              transition: 'all 200ms ease-in-out',
            },
            transform: 'scale3d(1.03, 1.03, 1)',
  },
  deemphasized: {
    [theme.transitions.handleMotion('no-preference')]: {
              transition: 'all 200ms ease-in-out',
            },
            fillOpacity: 0.5,
  },
});
