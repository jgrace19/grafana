import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const temporaryAlertStyles = stylex.create({
  alert: {
    position: 'absolute',
    zIndex: grafanaTokens.zIndex_portal,
    top: 0,
    right: 10,
  },
});
