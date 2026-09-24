import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const actionButtonStyles = stylex.create({
  ActionButton: {
    label: 'ActionButton',
        overflow: 'hidden',
        position: 'relative',
        '::after': {
          content: '""',
          background: grafanaTokens.colors_primary_main,
          display: 'block',
          position: 'absolute',
          right: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          [theme.transitions.handleMotion('no-preference')]: {
            transition: 'all 0.8s',
          },
        },
        '&:active:after': {
          margin: 0,
          opacity: 0.3,
          [theme.transitions.handleMotion('no-preference', 'reduce')]: {
            transition: '0s',
          },
        },
  },
});
