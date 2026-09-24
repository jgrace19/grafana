import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const variableTypeSelectionPaneStyles = stylex.create({
  cardDescription: {
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
          marginTop: themeSpacing(0),
  },
});
