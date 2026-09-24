import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const dashboardGridItemRendererStyles = stylex.create({
  panelWrapper: {
    display: 'flex',
      flexGrow: 1,
      position: 'relative',
      width: '100%',
      height: '100%',
  },
});
