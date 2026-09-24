import * as stylex from '@stylexjs/stylex';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const layoutControlsStyles = stylex.create({
  controls: {
    display: 'flex',
    flexDirection: 'row',
    gap: themeSpacing(1),
    padding: themeSpacingShorthand(1, 0),
    height: themeSpacing(5),
    bottom: 0,
    left: 0,
    minWidth: 'min-content',
  },
});
