import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const dashboardControlsMenuStyles = stylex.create({
  items: {
    display: 'flex',
        flexDirection: 'column',
        gap: themeSpacing(0.5),
        padding: themeSpacing(1),
  },
  divider: {
    marginTop: themeSpacing(1),
        padding: themeSpacingShorthand(0, 0.5),
  },
});
