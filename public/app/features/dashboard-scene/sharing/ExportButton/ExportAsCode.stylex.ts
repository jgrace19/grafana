import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const exportAsCodeStyles = stylex.create({
  container: {
    height: '100%',
  },
  codeEditorBox: {
    margin: `${themeSpacingShorthand(2, 0)}`,
          height: '75%',
  },
  buttonsContainer: {
    paddingBottom: themeSpacing(2),
  },
});
