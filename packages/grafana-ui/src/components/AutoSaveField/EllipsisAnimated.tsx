import * as stylex from '@stylexjs/stylex';
import { memo } from 'react';

import { motion } from '../../themes/stylex/constants.stylex';

export const EllipsisAnimated = memo(() => {
  return (
    <div {...stylex.props(styles.ellipsis)}>
      <span {...stylex.props(styles.dot, styles.firstDot)}>{'.'}</span>
      <span {...stylex.props(styles.dot, styles.secondDot)}>{'.'}</span>
      <span {...stylex.props(styles.dot, styles.thirdDot)}>{'.'}</span>
    </div>
  );
});

EllipsisAnimated.displayName = 'EllipsisAnimated';

const firstDot = stylex.keyframes({
  '0%': { opacity: 1 },
  '65%': { opacity: 1 },
  '66%': { opacity: 0.5 },
  '100%': { opacity: 0 },
});

const secondDot = stylex.keyframes({
  '0%': { opacity: 0 },
  '21%': { opacity: 0.5 },
  '22%': { opacity: 1 },
  '65%': { opacity: 1 },
  '66%': { opacity: 0.5 },
  '100%': { opacity: 0 },
});

const thirdDot = stylex.keyframes({
  '0%': { opacity: 0 },
  '43%': { opacity: 0.5 },
  '44%': { opacity: 1 },
  '65%': { opacity: 1 },
  '66%': { opacity: 0.5 },
  '100%': { opacity: 0 },
});

const styles = stylex.create({
  ellipsis: {
    display: 'inline',
  },
  dot: {
    animationDuration: { default: null, [motion.noPreferenceOrReduce]: '2s' },
    animationTimingFunction: { default: null, [motion.noPreferenceOrReduce]: 'linear' },
    animationIterationCount: { default: null, [motion.noPreferenceOrReduce]: 'infinite' },
  },
  firstDot: {
    animationName: { default: null, [motion.noPreferenceOrReduce]: firstDot },
  },
  secondDot: {
    animationName: { default: null, [motion.noPreferenceOrReduce]: secondDot },
  },
  thirdDot: {
    animationName: { default: null, [motion.noPreferenceOrReduce]: thirdDot },
  },
});
