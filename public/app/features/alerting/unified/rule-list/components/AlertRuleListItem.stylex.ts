import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const alertRuleListItemStyles = stylex.create({
  logo: {
    height: '12px',
        width: '12px',
        borderRadius: grafanaTokens.shape_radius_default,
  },
  filter: {
    filter: `invert(${theme.isLight ? 1 : 0})`,
  },
});
