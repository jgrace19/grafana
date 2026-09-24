import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const lokiCheatSheetStyles = stylex.create({
  cheatSheetItem: {
    margin: themeSpacingShorthand(3, 0),
  },
  cheatSheetItemTitle: {
    fontSize: grafanaTokens.typography_h3_fontSize,
  },
  cheatSheetExample: {
    margin: themeSpacingShorthand(0.5, 0),
        // element is interactive, clear button styles
        textAlign: 'left',
        border: 'none',
        background: 'transparent',
        display: 'block',
  },
});
