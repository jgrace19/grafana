import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const promExploreExtraFieldStyles = stylex.create({
  queryTypeField: {
    marginRight: grafanaTokens.spacing_x0_5,
  },
  nowrap: {
    flexWrap: 'nowrap',
  },
});
