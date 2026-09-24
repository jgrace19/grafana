import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const timelineHeaderRowStyles = stylex.create({
  TimelineHeaderRow: {
    label: 'TimelineHeaderRow',
          background: autoColor(theme, '#ececec'),
          borderBottom: `1px solid ${autoColor(theme, '#ccc')}`,
          height: '38px',
          lineHeight: '38px',
          width: '100%',
          zIndex: 4,
          position: 'relative',
  },
  TimelineHeaderRowTitle: {
    label: 'TimelineHeaderRowTitle',
          flex: 1,
          overflow: 'hidden',
          margin: 0,
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
  },
  TimelineHeaderWrapper: {
    label: 'TimelineHeaderWrapper',
          alignItems: 'center',
          display: 'flex',
          paddingLeft: themeSpacing(1),
          paddingRight: themeSpacing(1),
  },
});
