import * as stylex from '@stylexjs/stylex';

import { themeSpacing } from '../../../core/stylex/spacing';

export const iconCircleStyles = stylex.create({
  iconCircle: {
    borderRadius: '50%',
    padding: themeSpacing(1),
  },
});
