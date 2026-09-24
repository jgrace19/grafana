import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const markerStyles = stylex.create({
  mainGroup: {
    cursor: 'pointer',
        fontSize: '10px',
  },
  mainCircle: {
    fill: theme.components.panel.background,
        stroke: grafanaTokens.colors_border_strong,
  },
  text: {
    width: '50px',
        height: '50px',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
  },
});
