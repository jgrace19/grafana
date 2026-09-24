import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const nameCellStyles = stylex.create({
  icon: {
    display: 'block',
    width: grafanaTokens.spacing_x8,
    height: grafanaTokens.spacing_x8,
  },
});
