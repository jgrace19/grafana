import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../themes/stylex/cssVar';

const spinKeyframes = stylex.keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(359deg)' },
});

export const iconStyles = stylex.create({
  icon: {
    display: 'inline-block',
    fill: 'currentColor',
    flexShrink: 0,
    label: 'Icon',
    lineHeight: 0,
    verticalAlign: 'middle',
  },
  orange: {
    fill: cssVar('colors.warning.main'),
  },
  spin: {
    '@media (prefers-reduced-motion: no-preference)': {
      animationName: spinKeyframes,
      animationDuration: '2s',
      animationIterationCount: 'infinite',
      animationTimingFunction: 'linear',
    },
  },
});
