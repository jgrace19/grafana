import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const colorBarCellStyles = stylex.create({
  colorBarContainer: {
    width: '100%',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
  },
  colorBar: {
    height: '16px',
    minWidth: '2px',
    borderRadius: grafanaTokens.shape_radius_default,
  },
});
