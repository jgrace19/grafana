import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const tagsInputStyles = stylex.create({
  vertical: {
    display: 'flex',
        flexDirection: 'column',
        gap: themeSpacing(0.25),
  },
  horizontal: {
    display: 'flex',
        flexDirection: 'row',
        gap: themeSpacing(1),
  },
  addTag: {
    marginLeft: themeSpacing(1),
  },
});
