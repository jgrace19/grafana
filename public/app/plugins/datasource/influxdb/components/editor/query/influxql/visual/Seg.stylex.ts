import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const segStyles = stylex.create({
  selectClass: {
    minWidth: '160px',
  },
  defaultButtonClass: {
    width: 'auto',
      cursor: 'pointer',
  },
});
