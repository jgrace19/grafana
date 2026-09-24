import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const variableEditorFormStyles = stylex.create({
  buttonContainer: {
    marginTop: themeSpacing(2),
  },
  loadingPlaceHolder: {
    marginBottom: 0,
  },
});
