import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const droppableCategoryStyles = stylex.create({
  category: {
    ' :has(> ul)': {
            padding: themeSpacingShorthand(0, 2, 1, 2),
          },
  },
});
