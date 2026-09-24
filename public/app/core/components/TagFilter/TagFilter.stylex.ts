import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const tagFilterStyles = stylex.create({
  tagFilter: {
    position: 'relative',
          minWidth: '180px',
          flexGrow: 1,
    
          [`.${tagBadgeStyles.badge}`]: {
            marginLeft: '6px',
            cursor: 'pointer',
          },
  },
  clear: {
    background: 'none',
          border: 'none',
          textDecoration: 'underline',
          fontSize: '12px',
          padding: 'none',
          position: 'absolute',
          top: '-17px',
          right: 0,
          cursor: 'pointer',
          color: grafanaTokens.colors_text_secondary,
    
          ':hover': {
            color: grafanaTokens.colors_text_primary,
          },
  },
});
