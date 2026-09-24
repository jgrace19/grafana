import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const logsCheatSheetStyles = stylex.create({
  heading: {
    marginBottom: themeSpacing(2),
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
