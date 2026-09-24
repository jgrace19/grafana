import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const connectionAnchorsStyles = stylex.create({
  root: {
    position: 'absolute',
        display: 'none',
  },
  mouseoutDiv: {
    position: 'absolute',
        margin: '-30px',
        width: 'calc(100% + 60px)',
        height: 'calc(100% + 60px)',
  },
  anchor: {
    padding: `${ANCHOR_PADDING}px`,
        position: 'absolute',
        cursor: 'cursor',
        width: `calc(5px + 2 * ${ANCHOR_PADDING}px)`,
        height: `calc(5px + 2 * ${ANCHOR_PADDING}px)`,
        zIndex: 100,
  },
  highlightElement: {
    backgroundColor: '#00ff00',
        opacity: 0.3,
        position: 'absolute',
        cursor: 'cursor',
        pointerEvents: 'auto',
        width: '16px',
        height: '16px',
        borderRadius: grafanaTokens.shape_radius_circle,
        display: 'none',
        zIndex: 110,
  },
});
