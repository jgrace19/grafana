import * as stylex from '@stylexjs/stylex';

export const flameGraphCanvasStyles = stylex.create({
  graph: {
    overflow: 'auto',
    flexGrow: 1,
    flexBasis: '50%',
  },
  canvasContainer: {
    display: 'flex',
  },
  canvasWrapper: {
    cursor: 'pointer',
    flex: 1,
    overflow: 'hidden',
  },
  sandwichMarker: {
    writingMode: 'vertical-lr',
    transform: 'rotate(180deg)',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  sandwichMarkerIcon: {
    verticalAlign: 'baseline',
  },
});
