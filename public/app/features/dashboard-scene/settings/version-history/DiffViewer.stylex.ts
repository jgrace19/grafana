import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const diffViewerStyles = stylex.create({
  root: {
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
    pre: {
      all: 'revert',
    },
  },
});
