import * as stylex from '@stylexjs/stylex';

import { themeSpacing, themeSpacingShorthand } from '../../../../../../core/stylex/spacing';

export const sidebarHeaderActionsStyles = stylex.create({
  header: {
    padding: themeSpacingShorthand(0.5, 1.5),
    minHeight: themeSpacing(5),
    display: 'flex',
    alignItems: 'center',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    gap: themeSpacing(1),
  },
});
