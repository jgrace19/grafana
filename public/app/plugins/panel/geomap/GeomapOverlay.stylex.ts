import * as stylex from '@stylexjs/stylex';

export const geomapOverlayStyles = stylex.create({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 500,
    pointerEvents: 'none',
  },
  tr1: {
    right: '0.5em',
    pointerEvents: 'auto',
    position: 'absolute',
    top: '0.5em',
  },
  tr2Default: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    pointerEvents: 'auto',
  },
  tr2Offset: {
    position: 'absolute',
    top: '80px',
    right: '8px',
    pointerEvents: 'auto',
  },
  bl: {
    position: 'absolute',
    bottom: '8px',
    left: '8px',
    pointerEvents: 'auto',
  },
});
