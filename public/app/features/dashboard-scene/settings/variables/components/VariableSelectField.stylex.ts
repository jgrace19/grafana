import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const variableSelectFieldStyles = stylex.create({
  selectContainer: {
    marginRight: themeSpacing(0.5),
  },
});
