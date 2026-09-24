import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../core/stylex/spacing';

export const featureTogglePageStyles = stylex.create({
  root: {
    marginTop: themeSpacing(2),
  },
});
