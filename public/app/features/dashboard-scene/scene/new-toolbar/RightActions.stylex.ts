import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const rightActionsStyles = stylex.create({
  container: {
    paddingLeft: themeSpacing(0.5)
  },
});
