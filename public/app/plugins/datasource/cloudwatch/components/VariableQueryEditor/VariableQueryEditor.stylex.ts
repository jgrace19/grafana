import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const variableQueryEditorStyles = stylex.create({
  formStyles: {
    maxWidth: themeSpacing(30),
  },
  dimensionsWidth: {
    width: themeSpacing(50),
  },
});
