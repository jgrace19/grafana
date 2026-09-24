import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const connectionAnchors2Styles = stylex.create({
  root: {
    position: 'absolute',
        display: 'none',
        zIndex: `${zIndex.ROOT} !important`,
        pointerEvents: PointerEvents.ROOT,
  },
  mouseoutDiv: {
    position: 'absolute',
        margin: '-30px',
        width: 'calc(100% + 60px)',
        height: 'calc(100% + 60px)',
        pointerEvents: PointerEvents.MOUSEOUT_DIV,
  },
  anchor: {
    padding: `${ANCHOR_PADDING}px`,
        position: 'absolute',
        cursor: 'cursor',
        width: `calc(5px + 2 * ${ANCHOR_PADDING}px)`,
        height: `calc(5px + 2 * ${ANCHOR_PADDING}px)`,
        zIndex: `${zIndex.ANCHOR} !important`,
        pointerEvents: PointerEvents.ANCHOR,
        userSelect: 'none',
  },
  highlightElement: {
    backgroundColor: '#00ff00',
        opacity: 0.3,
        position: 'absolute',
        cursor: 'cursor',
        pointerEvents: PointerEvents.HIGHLIGHT,
        width: '16px',
        height: '16px',
        borderRadius: grafanaTokens.shape_radius_circle,
        display: 'none',
        zIndex: `${zIndex.HIGHLIGHT} !important`,
  },
});
