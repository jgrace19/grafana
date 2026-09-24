import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const appNotificationItemStyles = stylex.create({
  wrapper: {
    display: 'flex',
          flexDirection: 'column',
  },
  trace: {
    fontSize: 8.75rem,
  },
});
