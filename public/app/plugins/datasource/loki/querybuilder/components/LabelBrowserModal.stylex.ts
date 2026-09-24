import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const labelBrowserModalStyles = stylex.create({
  modal: {
    width: '85vw',
        '@media (max-width: 768.95px)': {
            width: '100%',
          },
  },
});
