import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const edgeLabelStyles = stylex.create({
  mainGroup: {
    pointerEvents: 'none',
          fontSize: '8px',
  },
  background: {
    fill: theme.components.tooltip.background,
  },
  text: {
    fill: theme.components.tooltip.text,
  },
});
