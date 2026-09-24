import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const versionHistoryTableStyles = stylex.create({
  margin: {
    marginBottom: themeSpacing(4),
  },
  table: {
    td: {
            whiteSpace: 'normal !important',
          },
  },
});
