import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const conditionalRenderingOverlayStyles = stylex.create({
  container: {
    display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        height: '100%',
        bottom: 0,
        right: 0,
        zIndex: 1,
    
        ['@media (prefers-reduced-motion: no-preference), @media (prefers-reduced-motion: reduce)']: {
          transition: 'all 0.2s ease',
        },
    
        '::before': {
          content: '""',
          opacity: 0.6,
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          backgroundColor: grafanaTokens.colors_background_canvas,
          pointerEvents: 'none',
        },
    
        '& > svg': {
          height: '48px',
          width: '48px',
          maxWidth: '75%',
          maxHeight: '75%',
        },
    
        '.dashboard-visible-hidden-element:hover > &': {
          width: '30px',
          height: '30px',
          top: 'unset',
          left: 'unset',
          right: 0,
          bottom: 0,
        },
  },
});
