import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from './stylex/spacing';

export const alertWarningStyles = stylex.create({
  warning: {
    margin: themeSpacing(4),
  },
});
