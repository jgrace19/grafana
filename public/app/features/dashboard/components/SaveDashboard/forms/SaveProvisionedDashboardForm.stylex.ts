import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const saveProvisionedDashboardFormStyles = stylex.create({
  json: {
    height: '400px',
        width: '100%',
        overflow: 'auto',
        resize: 'none',
        fontFamily: 'monospace',
  },
});
