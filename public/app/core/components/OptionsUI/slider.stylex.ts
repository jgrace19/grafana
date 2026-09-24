import * as stylex from '@stylexjs/stylex';

import { themeSpacing } from '../../stylex/spacing';

export const sliderEditorStyles = stylex.create({
  numberInputWrapper: {
    marginLeft: themeSpacing(3),
    maxHeight: '32px',
    overflow: 'visible',
    width: '100%',
  },
});
