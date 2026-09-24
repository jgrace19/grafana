import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

const ghostBlobFloat = stylex.keyframes({
  '0%, 100%': {
      transform: 'translate3d(0, 0, 0) scale(1)',
      backgroundPosition: '12% 28%, 84% 18%, 44% 82%',
    },
    '33%': {
      transform: 'translate3d(3.8%, -5.2%, 0) scale(1.08)',
      backgroundPosition: '24% 16%, 72% 38%, 58% 70%',
    },
    '66%': {
      transform: 'translate3d(-4.2%, 3.6%, 0) scale(0.92)',
      backgroundPosition: '36% 26%, 66% 68%, 24% 76%',
    },
});

const ghostBlobPulse = stylex.keyframes({
  '0%, 100%': {
      opacity: 0.42,
    },
    '50%': {
      opacity: 1.2,
    },
});

export const sidebarCardGhostStylesStyles = stylex.create({
});
