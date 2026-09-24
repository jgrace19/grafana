import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const getFieldOverrideElementsStyles = stylex.create({
  root: {
    borderTop: `1px solid ${grafanaTokens.colors_border_weak}`, padding: `${themeSpacing(2)}`, display: 'flex'
  },
});
