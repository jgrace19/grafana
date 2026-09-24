import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const ticksStyles = stylex.create({
  Ticks: {
        pointerEvents: 'none',
  },
  TicksTick: {
        position: 'absolute',
        height: '100%',
        width: '1px',
        background: '#d8d8d8',
        ':last-child': {
          width: 0,
        },
  },
  TicksTickLabel: {
        left: '0.25rem',
        position: 'absolute',
        whiteSpace: 'nowrap',
  },
  TicksTickLabelEndAnchor: {
        left: 'initial',
        right: '0.25rem',
  },
});
