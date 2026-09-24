import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const logsCrossFadeTransitionStyles = stylex.create({
  logsEnter: {
          position: 'absolute',
          opacity: 0,
          height: 'auto',
          width: '100%',
  },
  logsEnterActive: {
          opacity: 1,
                      transition: `opacity ${transitionDuration}ms ease-out ${transitionDelay}ms`,
          },
  },
  logsExit: {
          position: 'absolute',
          opacity: 1,
          height: 'auto',
          width: '100%',
  },
  logsExitActive: {
          opacity: 0,
                      transition: `opacity ${transitionDuration}ms ease-out ${transitionDelay}ms`,
          },
  },
});
