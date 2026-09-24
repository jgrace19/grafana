import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const tagMappingStyles = stylex.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: grafanaTokens.spacing_x0_5,
  },
  pair: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  operator: {
    color: '#ff9830',
    width: 'auto',
  },
  removeTag: {
    marginRight: grafanaTokens.spacing_x0_5,
  },
});
