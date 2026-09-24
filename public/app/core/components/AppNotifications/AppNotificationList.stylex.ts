import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const appNotificationListStyles = stylex.create({
  wrapper: {
    label: 'app-notifications-list',
          zIndex: grafanaTokens.zIndex_portal,
          minWidth: 400,
          maxWidth: 600,
          position: 'fixed',
          right: 6,
          top: 88,
  },
});
