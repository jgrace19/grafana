import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const dashboardFiltersOverviewPaneStyles = stylex.create({
  header: {
    display: 'flex',
        alignItems: 'center',
        gap: themeSpacing(1),
        padding: themeSpacing(1),
        borderBottom: `1px solid ${grafanaTokens.colors_border_weak}`,
        overflow: 'hidden',
        minWidth: 0,
  },
  title: {
    flex: 1,
        minWidth: 0,
        overflow: 'hidden',
  },
  content: {
    display: 'flex',
        flexDirection: 'column',
        padding: themeSpacing(1),
        height: '100%',
        boxSizing: 'border-box',
  },
  body: {
    flex: 1,
        minHeight: 0,
        height: '100%',
  },
});
