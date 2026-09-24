import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const breadcrumbsStyles = stylex.create({
  breadcrumbs: {
    display: 'flex',
          alignItems: 'center',
          flexWrap: 'nowrap',
          overflow: 'hidden',
  },
});
