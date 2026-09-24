import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const storedNotificationItemStyles = stylex.create({
  trace: {
    alignItems: 'flex-end',
          alignSelf: 'flex-end',
          color: grafanaTokens.colors_text_secondary,
          display: 'flex',
          flexDirection: 'column',
          fontSize: /* UNMAPPED theme.typography.pxToRem */ 'inherit'(10),
          justifySelf: 'flex-end',
  },
});
