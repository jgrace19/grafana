import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const diffGroupStyles = stylex.create({
  container: {

  },
  list: {
    marginLeft: themeSpacing(4),
  },
  listItem: {
    marginBottom: themeSpacing(1),
        '&:last-child': {
          marginBottom: 0,
        },
  },
});
