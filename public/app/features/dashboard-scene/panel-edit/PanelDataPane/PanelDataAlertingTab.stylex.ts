import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const panelDataAlertingTabStyles = stylex.create({
  newButton: {
    marginTop: themeSpacing(3),
  },
  noRulesWrapper: {
    margin: themeSpacing(2),
        backgroundColor: grafanaTokens.colors_background_secondary,
        padding: themeSpacing(3),
  },
});
