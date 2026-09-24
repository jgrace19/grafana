import * as stylex from '@stylexjs/stylex';

const blink = stylex.keyframes({
  '0%': { fillOpacity: 0 },
  '50%': { fillOpacity: 1 },
  '100%': { fillOpacity: 0 },
});

export const serverCanvasStyles = stylex.create({
  bulb: {},
  server: {},
  circle: {
    animationName: blink,
    animationIterationCount: 'infinite',
    animationTimingFunction: 'step-end',
    stroke: 'none',
  },
  circleBack: {
    stroke: 'none',
    opacity: 1,
  },
  outline: {
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: '4px',
  },
});
