import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const splitPaneWrapperStyles = stylex.create({
  resizer: {
    display: hasSplit ? 'block' : 'none',
  },
});
