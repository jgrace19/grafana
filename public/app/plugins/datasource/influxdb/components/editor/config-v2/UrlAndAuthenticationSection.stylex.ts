import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const urlAndAuthenticationSectionStyles = stylex.create({
  dropdown: {
    display: 'flex',
          alignItems: 'center',
          height: '18px',
  },
  col: {
    flex: '1 1 48%',
          minWidth: '320px',
  },
});
