import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const ticksStyles = stylex.create({
  Ticks: {
    label: 'Ticks',
        pointerEvents: 'none',
  },
  TicksTick: {
    label: 'TicksTick',
        position: 'absolute',
        height: '100%',
        width: '1px',
        background: autoColor(theme, '#d8d8d8'),
        ':last-child': {
          width: 0,
        },
  },
  TicksTickLabel: {
    label: 'TicksTickLabel',
        left: '0.25rem',
        position: 'absolute',
        whiteSpace: 'nowrap',
  },
  TicksTickLabelEndAnchor: {
    label: 'TicksTickLabelEndAnchor',
        left: 'initial',
        right: '0.25rem',
  },
});
