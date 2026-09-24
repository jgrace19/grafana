import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const logsCrossFadeTransitionStyles = stylex.create({
  logsEnter: {
    label: 'logsEnter',
          position: 'absolute',
          opacity: 0,
          height: 'auto',
          width: '100%',
  },
  logsEnterActive: {
    label: 'logsEnterActive',
          opacity: 1,
          [theme.transitions.handleMotion('no-preference', 'reduce')]: {
            transition: `opacity ${transitionDuration}ms ease-out ${transitionDelay}ms`,
          },
  },
  logsExit: {
    label: 'logsExit',
          position: 'absolute',
          opacity: 1,
          height: 'auto',
          width: '100%',
  },
  logsExitActive: {
    label: 'logsExitActive',
          opacity: 0,
          [theme.transitions.handleMotion('no-preference', 'reduce')]: {
            transition: `opacity ${transitionDuration}ms ease-out ${transitionDelay}ms`,
          },
  },
});
