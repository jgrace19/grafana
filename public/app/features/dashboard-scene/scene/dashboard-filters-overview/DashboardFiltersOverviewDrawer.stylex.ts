import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const dashboardFiltersOverviewDrawerStyles = stylex.create({
  drawerHeader: {
    display: 'flex',
        alignItems: 'center',
        gap: themeSpacing(1),
        width: '100%',
        overflow: 'hidden',
        minWidth: 0,
        paddingRight: themeSpacing(2),
  },
  drawerTitle: {
    flex: 1,
        minWidth: 0,
        overflow: 'hidden',
  },
});
