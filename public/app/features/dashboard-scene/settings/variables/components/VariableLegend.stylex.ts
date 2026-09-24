import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const variableLegendStyles = stylex.create({
  legend: {
    marginTop: themeSpacing(3),
          marginBottom: themeSpacing(1),
  },
});
