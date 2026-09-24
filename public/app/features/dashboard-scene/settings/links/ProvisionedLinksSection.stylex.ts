import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const provisionedLinksSectionStyles = stylex.create({
  titleWrapper: {
    width: '20vw',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        display: 'inline-block',
  },
  urlWrapper: {
    width: '40vw',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        display: 'inline-block',
  },
  sourceCell: {
    width: '1%',
        textAlign: 'center' as const,
  },
});
