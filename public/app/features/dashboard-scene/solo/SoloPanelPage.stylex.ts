import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const soloPanelPageStyles = stylex.create({
  container: {
    position: 'fixed',
          bottom: 0,
          right: 0,
          margin: 0,
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
  },
});
