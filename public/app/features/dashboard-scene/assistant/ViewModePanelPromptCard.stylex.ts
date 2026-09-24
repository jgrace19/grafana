import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

const popIn = stylex.keyframes({
  from: { opacity: 0 },
    to: { opacity: 1 },
});

export const viewModePanelPromptCardStyles = stylex.create({
  floatingContainer: {
          zIndex: grafanaTokens.zIndex_tooltip,
          width: 380,
          ['@media (prefers-reduced-motion: no-preference)']: {
            animation: `${popIn} 150ms ease-out`,
          },
  },
  card: {
          width: '100%',
  },
});
