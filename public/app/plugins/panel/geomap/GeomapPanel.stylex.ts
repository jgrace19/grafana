import * as stylex from '@stylexjs/stylex';

export const geomapPanelStyles = stylex.create({
  wrap: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  map: {
    position: 'absolute',
    zIndex: 0,
    width: '100%',
    height: '100%',
  },
});
