import * as stylex from '@stylexjs/stylex';

const fadeIn = stylex.keyframes({
  '0%': {
    opacity: 0,
    animationTimingFunction: 'cubic-bezier(0, 0, 0.5, 1)',
  },
  '100%': {
    opacity: 1,
  },
});

const pulse = stylex.keyframes({
  '0%': {
    opacity: 0,
  },
  '50%': {
    opacity: 1,
  },
  '100%': {
    opacity: 0,
  },
});

const bounce = stylex.keyframes({
  'from, to': {
    transform: 'translateY(0px)',
    animationTimingFunction: 'cubic-bezier(0.3, 0, 0.1, 1)',
  },
  '50%': {
    transform: 'translateY(-50px)',
    animationTimingFunction: 'cubic-bezier(0.9, 0, 0.7, 1)',
  },
});

const squash = stylex.keyframes({
  '0%': {
    transform: 'scaleX(1.3) scaleY(0.8)',
    animationTimingFunction: 'cubic-bezier(0.3, 0, 0.1, 1)',
  },
  '15%': {
    transform: 'scaleX(0.75) scaleY(1.25)',
    animationTimingFunction: 'cubic-bezier(0, 0, 0.7, 0.75)',
  },
  '55%': {
    transform: 'scaleX(1.05) scaleY(0.95)',
    animationTimingFunction: 'cubic-bezier(0.9, 0, 1, 1)',
  },
  '95%': {
    transform: 'scaleX(0.75) scaleY(1.25)',
    animationTimingFunction: 'cubic-bezier(0, 0, 0, 1)',
  },
  '100%': {
    transform: 'scaleX(1.3) scaleY(0.8)',
    animationTimingFunction: 'cubic-bezier(0, 0, 0.7, 1)',
  },
});

const motionNoPreference = '@media (prefers-reduced-motion: no-preference)';
const motionReduce = '@media (prefers-reduced-motion: reduce)';

export const bouncingLoaderStyles = stylex.create({
  container: {
    opacity: 0,
    [motionNoPreference]: {
      animationName: fadeIn,
      animationIterationCount: 1,
      animationDuration: '0.9s',
      animationDelay: '0.5s',
      animationFillMode: 'forwards',
    },
    [motionReduce]: {
      animationName: pulse,
      animationIterationCount: 'infinite',
      animationDuration: '4s',
      animationDelay: '0.5s',
    },
  },
  bounce: {
    textAlign: 'center',
    [motionNoPreference]: {
      animationName: bounce,
      animationDuration: '0.9s',
      animationIterationCount: 'infinite',
    },
  },
  logo: {
    display: 'inline-block',
    width: '60px',
    height: '60px',
    [motionNoPreference]: {
      animationName: squash,
      animationDuration: '0.9s',
      animationIterationCount: 'infinite',
    },
  },
});
