import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const virtualizedTraceViewStyles = stylex.create({
  rowsWrapper: {
    width: '100%',
  },
  row: {
    width: '100%',
  },
  scrollToTopButton: {
    display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '40px',
        height: '40px',
        position: 'absolute',
        bottom: '30px',
        right: '30px',
        zIndex: 1,
  },
});
