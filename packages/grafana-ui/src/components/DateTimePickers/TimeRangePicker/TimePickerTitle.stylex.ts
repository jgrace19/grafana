import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../../themes/stylex/cssVar';

export const timePickerTitleStyles = stylex.create({
  text: {
    fontSize: cssVar('typography.size.md'),
          fontWeight: cssVar('typography.fontWeightMedium'),
          color: cssVar('colors.text.primary'),
          margin: 0,
          display: 'flex',
  },
});

export function timePickerTitleStyleProps(key: keyof typeof timePickerTitleStyles) {
  return stylex.props(timePickerTitleStyles[key]);
}
