import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const dashboardFailedStyles = stylex.create({
  dashboardLoading: {
    height: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
  },
});
