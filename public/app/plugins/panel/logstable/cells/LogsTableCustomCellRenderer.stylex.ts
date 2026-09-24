import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const logsTableCustomCellRendererStyles = stylex.create({
  firstColumnCell: {
    paddingLeft: cellPadding,
  },
});
