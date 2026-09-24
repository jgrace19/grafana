import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

const slideInAndPulse = stylex.keyframes({
  '0%': {
      opacity: 0,
      transform: 'translateX(24px) scale(0.6)',
    },
    '60%': {
      opacity: 1,
      transform: 'translateX(0) scale(1.2)',
    },
    '80%': {
      transform: 'translateX(0) scale(0.9)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateX(0) scale(1)',
    },
});

export const experimentalFeedbackButtonStyles = stylex.create({
});
