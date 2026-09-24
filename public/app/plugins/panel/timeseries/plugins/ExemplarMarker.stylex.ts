import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const exemplarMarkerStyles = stylex.create({
  markerWrapper: {
    padding: '0 4px 4px 4px',
          width: '8px',
          height: '8px',
          boxSizing: 'content-box',
          transform: 'translate3d(-50%, 0, 0)',
          ':hover': {
            '> svg': {
              transform: 'scale(1.3)',
              opacity: 1,
              filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.5))',
            },
          },
  },
  marker: {
    width: 0,
          height: 0,
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderBottom: `4px solid ${theme.v1.palette.red}`,
          pointerEvents: 'none',
  },
  marble: {
    display: 'block',
          opacity: 0.5,
          [theme.transitions.handleMotion('no-preference')]: {
            transition: 'transform 0.15s ease-out',
          },
  },
  activeMarble: {
    transform: 'scale(1.3)',
          opacity: 1,
          filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.5))',
  },
  tooltipWrapper: {
    background: grafanaTokens.colors_background_elevated,
          maxWidth: maxWidth ?? 'none',
          whiteSpace: 'pre',
          borderRadius: grafanaTokens.shape_radius_default,
          position: 'fixed',
          border: `1px solid ${grafanaTokens.colors_border_weak}`,
          boxShadow: grafanaTokens.shadows_z2,
          userSelect: 'text',
  },
  pinned: {
    boxShadow: grafanaTokens.shadows_z3,
  },
});
