import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const dashboardFiltersOverviewSearchStyles = stylex.create({
  container: {
    display: 'flex',
        alignItems: 'center',
        flex: 1,
        overflow: 'hidden',
  },
  input: {
    width: '100%',
  },
});
