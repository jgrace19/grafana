import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const operationRowHelpStyles = stylex.create({
  wrapper: {
    padding: themeSpacing(2),
          border: `2px solid ${themeBackgroundColor}`,
          borderTop: borderTop ? borderTop + themeBackgroundColor : 'none',
          borderRadius: `0 0 ${borderRadius} ${borderRadius}`,
          position: 'relative',
          top: '-4px',
  },
});
