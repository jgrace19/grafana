import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const operationListStyles = stylex.create({
  operationList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: grafanaTokens.spacing_x2,
  },
  addButton: {
    width: 126,
    paddingBottom: grafanaTokens.spacing_x1,
  },
});
