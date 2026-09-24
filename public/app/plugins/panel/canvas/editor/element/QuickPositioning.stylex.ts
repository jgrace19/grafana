import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const quickPositioningStyles = stylex.create({
  buttonGroup: {
    display: 'flex',
        flexWrap: 'wrap',
        padding: '12px 0 12px 0',
  },
  button: {
    marginLeft: '5px',
        marginRight: '5px',
  },
});
