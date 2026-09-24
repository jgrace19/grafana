import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const navToolbarSeparatorStyles = stylex.create({
  leftActionsSeparator: {
    display: 'flex',
          flexGrow: 1,
  },
  line: {
    width: 1,
          backgroundColor: grafanaTokens.colors_border_medium,
          height: 24,
          flexShrink: 0,
          flexGrow: 0,
          [@media (max-width: 543.95px)]: {
            display: 'none',
          },
  },
});
