import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const tablePanelStyles = stylex.create({
  wrapper: {
    display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
  },
  selectWrapper: {
    padding: '8px 8px 0px 8px',
  },
});
