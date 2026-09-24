import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const connectionSVGStyles = stylex.create({
  editorSVG: {
    position: 'absolute',
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        zIndex: 1000,
        display: 'none',
  },
  connection: {
    position: 'absolute',
        width: '100%',
        height: '100%',
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
