import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const autoGridLayoutManagerEditorStyles = stylex.create({
  wideSelector: {
    minWidth: themeSpacing(14),
        flex: `1 1 ${themeSpacing(14)}`,
  },
  narrowSelector: {
    width: themeSpacing(10),
  },
});
