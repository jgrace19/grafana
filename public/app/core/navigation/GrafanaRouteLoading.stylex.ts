import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const grafanaRouteLoadingStyles = stylex.create({
  loadingPage: {
    backgroundColor: grafanaTokens.colors_background_primary,
        flex: 1,
        flexDrection: 'column',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
  },
});
