import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const tableNGWrapStyles = stylex.create({
  listControlsWrapper: {
    height: '100%',
          width: controlsWidth,
          // Needed to keep the panel menu from overlapping the logs options when there's no title
          marginTop: hasTitle
            ? 0
            : `calc(${theme.spacing.gridSize * theme.components.panel.headerHeight}px + ${listControlsWrapperTableHeaderOffset
  },
  tableWrapper: {
    position: 'relative',
          paddingLeft: fieldSelectorWidth,
          paddingRight: controlsWidth,
          height,
          width: tableWidth,
  },
});
