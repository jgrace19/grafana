import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const configEditorStyles = stylex.create({
  hideOnSmallScreen: {
    width: '250px',
          flex: '0 0 250px',
        '@media (max-width: 543.95px)': {
            display: 'none',
          },
  },
  leftSticky: {
    position: 'sticky',
          top: '100px',
          alignSelf: 'flex-start',
          maxHeight: 'calc(100vh - 100px)',
          overflow: 'hidden',
  },
  alertHeight: {
    height: '100px',
  },
});
