import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const adHocVariableFormStyles = stylex.create({
  originFiltersWrapper: {
    maxWidth: themeSpacing(55),
  },
});
