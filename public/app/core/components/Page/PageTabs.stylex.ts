import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const pageTabsStyles = stylex.create({
  tabsWrapper: {
    paddingBottom: themeSpacing(3),
  },
});
