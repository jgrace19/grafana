import * as stylex from '@stylexjs/stylex';

import { themeSpacing, themeSpacingShorthand } from '../stylex/spacing';

export const paginationStyles = stylex.create({
  root: {
    float: 'none',
    display: 'flex',
    justifyContent: 'flex-start',
    margin: themeSpacingShorthand(2, 0),
  },
});
