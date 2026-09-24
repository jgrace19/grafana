import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const controlledLogRowsStyles = stylex.create({
  scrollableLogRows: {
    overflowY: 'auto',
        width: '100%',
        maxHeight: '80vh',
  },
  forwardedScrollableLogRows: {
    overflowY: 'auto',
        width: '100%',
        maxHeight: '100%',
  },
  logRows: {
    overflowX: 'scroll',
        overflowY: 'visible',
        width: '100%',
  },
  logRowsContainer: {
    display: 'flex',
        flexDirection: 'row-reverse',
        height: '100%',
  },
});
