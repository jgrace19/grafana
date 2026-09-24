import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const entityNotFoundStyles = stylex.create({
  container: {
    padding: themeSpacingShorthand(8, 2, 2, 2),
  },
});
