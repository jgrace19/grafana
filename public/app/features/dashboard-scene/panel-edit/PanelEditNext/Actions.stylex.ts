import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const actionsStyles = stylex.create({
  errorIcon: {
    margin: themeSpacingShorthand(0, 0.5, 0, 0.5),
  },
});
