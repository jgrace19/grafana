import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const configurationEditorStyles = stylex.create({
  ulPadding: {
    margin: themeSpacingShorthand(1, 0),
          paddingLeft: themeSpacing(5),
  },
});
