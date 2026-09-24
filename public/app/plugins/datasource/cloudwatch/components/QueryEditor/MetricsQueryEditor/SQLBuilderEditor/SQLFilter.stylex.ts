import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const sQLFilterStyles = stylex.create({
  container: {
    display: 'inline-block'
  },
  alert: {
    minWidth: '100%', width: 'min-content'
  },
});
