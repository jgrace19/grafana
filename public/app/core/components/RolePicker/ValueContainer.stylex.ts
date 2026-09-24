import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const valueContainerStyles = stylex.create({
  container: {
    position: 'relative',
    padding: themeSpacingShorthand(0.5, 1, 0.5, 1),
    ' svg': {
      marginRight: themeSpacing(0.5),
    },
  },
});
