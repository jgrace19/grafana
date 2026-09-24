import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../../core/stylex/spacing';

export const timelineHeaderRowStyles = stylex.create({
  TimelineHeaderRow: {
          background: '#ececec',
          borderBottom: `1px solid ${'#ccc'}`,
          height: '38px',
          lineHeight: '38px',
          width: '100%',
          zIndex: 4,
          position: 'relative',
  },
  TimelineHeaderRowTitle: {
          flex: 1,
          overflow: 'hidden',
          margin: 0,
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
  },
  TimelineHeaderWrapper: {
          alignItems: 'center',
          display: 'flex',
          paddingLeft: themeSpacing(1),
          paddingRight: themeSpacing(1),
  },
});
