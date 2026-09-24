import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const elementEditPaneStyles = stylex.create({
  wrapper: {
    display: 'flex',
          flexDirection: 'column',
          flex: '1 1 0',
          height: '100%',
  },
  categories: {
    display: 'flex',
          flexDirection: 'column',
          borderBottom: `1px solid ${grafanaTokens.colors_border_weak}`,
  },
});
