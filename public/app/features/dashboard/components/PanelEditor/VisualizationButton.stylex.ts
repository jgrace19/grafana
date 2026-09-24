import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const visualizationButtonStyles = stylex.create({
  wrapper: {
    display: 'flex',
        flexDirection: 'column',
  },
  vizButton: {
    textAlign: 'left',
  },
});
