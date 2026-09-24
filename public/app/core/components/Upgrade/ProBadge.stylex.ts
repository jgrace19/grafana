import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const proBadgeStyles = stylex.create({
  badge: {
    marginLeft: themeSpacing(1.25),
  },
});
