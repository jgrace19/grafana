import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const annotationMarker2Styles = stylex.create({
  annoMarker: {
    position: 'absolute',
        width: 0,
        height: 0,
        border: 'none',
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderBottomWidth: '5px',
        borderBottomStyle: 'solid',
        transform: 'translateX(-50%)',
        cursor: 'pointer',
        zIndex: 1,
        padding: 0,
        background: 'none',
  },
  annoRegion: {
    border: 'none',
        position: 'absolute',
        height: '5px',
        cursor: 'pointer',
        zIndex: 1,
        padding: 0,
        background: 'none',
  },
  annoBox: {
    top: 0,
        left: 0,
        zIndex: grafanaTokens.zIndex_tooltip,
        borderRadius: grafanaTokens.shape_radius_default,
        position: 'absolute',
        background: grafanaTokens.colors_background_primary,
        border: `1px solid ${grafanaTokens.colors_border_weak}`,
        boxShadow: grafanaTokens.shadows_z2,
        userSelect: 'text',
        minWidth: '300px',
  },
});
