import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const richHistoryCardStyles = stylex.create({
  queryRow: {
    borderTop: `1px solid ${grafanaTokens.colors_border_weak}`,
        display: 'flex',
        flexDirection: 'row',
        padding: themeSpacingShorthand(0.5, 0),
        gap: themeSpacing(0.5),
        ':first-child': {
          borderTop: 'none',
        },
  },
  dsInfoContainer: {
    display: 'flex',
        alignItems: 'center',
  },
  queryText: {
    wordBreak: 'break-all',
  },
});
