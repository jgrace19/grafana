import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const dashboardFiltersOverviewStyles = stylex.create({
  container: {
    width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        overflow: 'hidden',
  },
  skeletonContainer: {
    display: 'flex',
        flexDirection: 'column',
        gap: ROW_GAP,
        width: '100%',
  },
  skeletonRow: {
    display: 'block',
        lineHeight: 1,
  },
  listContainer: {
    width: '100%',
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
  },
  footer: {
    flexShrink: 0,
        marginTop: themeSpacing(2),
        paddingTop: themeSpacing(1.5),
        borderTop: `1px solid ${grafanaTokens.colors_border_weak}`,
  },
});
