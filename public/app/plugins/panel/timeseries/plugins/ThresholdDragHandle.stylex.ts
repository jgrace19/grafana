import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const thresholdDragHandleStyles = stylex.create({
  handleText: {
    textAlign: 'center',
          width: '100%',
          display: 'block',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
  },
});
