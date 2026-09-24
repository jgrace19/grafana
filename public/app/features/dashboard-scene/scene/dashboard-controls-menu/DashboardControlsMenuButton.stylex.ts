import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const dashboardControlsMenuButtonStyles = stylex.create({
  dropdownButton: {
    display: 'inline-flex',
        marginBottom: themeSpacing(1),
        marginRight: themeSpacing(1),
  },
});
