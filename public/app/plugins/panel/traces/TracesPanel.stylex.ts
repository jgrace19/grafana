import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const tracesPanelStyles = stylex.create({
  wrapper: {
    height: '100%',
        overflow: 'scroll',
  },
});
