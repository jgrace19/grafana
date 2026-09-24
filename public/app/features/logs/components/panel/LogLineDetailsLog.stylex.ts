import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const logLineDetailsLogStyles = stylex.create({
  logLineWrapper: {
    maxHeight: '50vh',
        overflow: 'auto',
  },
  noHover: {
    // Disable hover style
        pointerEvents: 'none',
  },
});
