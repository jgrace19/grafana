import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const fieldColorStyles = stylex.create({
  group: {
    display: 'flex',
  },
  select: {
    marginRight: themeSpacing(1),
          flexGrow: 1,
  },
});
