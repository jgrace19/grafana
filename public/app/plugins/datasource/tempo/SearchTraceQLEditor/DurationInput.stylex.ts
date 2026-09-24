import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const durationInputStyles = stylex.create({
  noBoxShadow: {
    boxShadow: 'none',
        '*:focus': {
          boxShadow: 'none',
        },
  },
});
