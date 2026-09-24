import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const explorePaneContainerStyles = stylex.create({
  containerStyles: {
    label: 'explorePaneContainer',
      display: 'flex',
      flexDirection: 'column',
      minWidth: '600px',
      height: '100%',
  },
});
