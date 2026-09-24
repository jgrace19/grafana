import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const expressionStatusIndicatorStyles = stylex.create({
  actionLink: {
    color: grafanaTokens.colors_text_link,
          cursor: 'pointer',
    
          ':hover': {
            textDecoration: 'underline',
          },
  },
});
