import * as stylex from '@stylexjs/stylex';

const spin = stylex.keyframes({ '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(359deg)' } });

export const spinnerStyles = stylex.create({
  inline: { display: 'inline-block', lineHeight: 0 },
  spin: {
    '@media (prefers-reduced-motion: no-preference)': {
      animationName: spin,
      animationDuration: '2s',
      animationIterationCount: 'infinite',
      animationTimingFunction: 'linear',
    },
  },
  deprecatedWrapper: { fontSize: 'var(--grafana-spinner-size, 16px)' },
  deprecatedIcon: { display: 'inline-block', fill: 'currentColor', flexShrink: 0, lineHeight: 0, verticalAlign: 'middle' },
});
