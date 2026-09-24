import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const legendStyles = stylex.create({
  item: {
    flexGrow: 0,
  },
  legend: {
    pointerEvents: 'all',
  },
});
