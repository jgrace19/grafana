import * as stylex from '@stylexjs/stylex';

import { themeSpacing } from '../../../../../core/stylex/spacing';

export const variableStaticOptionsFormStyles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: themeSpacing(2),
    width: '100%',
    maxWidth: themeSpacing(60),
  },
  containerModal: {
    maxWidth: '100%',
    maxHeight: 'calc(80vh - 170px)',
    overflow: 'auto',
    minHeight: themeSpacing(5),
  },
});
