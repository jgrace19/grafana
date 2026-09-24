import * as stylex from '@stylexjs/stylex';

import { themeSpacing } from '../../../core/stylex/spacing';

export const tableContainerStyles = stylex.create({
  framesStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: themeSpacing(1),
  },
});
