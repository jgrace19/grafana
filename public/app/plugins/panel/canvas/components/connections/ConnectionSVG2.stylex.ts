import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const connectionSVG2Styles = stylex.create({
  connection: {
    position: 'absolute',
        zIndex: 1000,
        pointerEvents: 'none',
  },
  vertex: {
    fill: '#44aaff',
        strokeWidth: 2,
  },
  addVertex: {
    fill: '#44aaff',
        opacity: 0.5,
        strokeWidth: 1,
  },
});
