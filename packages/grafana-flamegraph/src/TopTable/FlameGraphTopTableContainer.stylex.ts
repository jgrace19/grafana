import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const topTableStyles = stylex.create({
  topTableContainer: {
    padding: grafanaTokens.spacing_x1,
    backgroundColor: grafanaTokens.colors_background_secondary,
    height: '100%',
  },
  actionCellWrapper: {
    display: 'flex',
    height: '24px',
  },
  actionCellButton: {
    marginRight: 0,
    width: '24px',
  },
});
