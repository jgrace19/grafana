import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const canvasSpanGraphStyles = stylex.create({
  CanvasSpanGraph: {
          background: '#fafafa',
          height: '60px',
          position: 'absolute',
          width: '100%',
          imageRendering: 'crisp-edges',
  },
});
