import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const cardTitleStyles = stylex.create({
  title: {
    overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textDecoration: 'none',
          color: grafanaTokens.colors_text_primary,
          fontWeight: grafanaTokens.typography_fontWeightLight,
  },
  hidden: {
    textDecoration: 'line-through',
  },
});
