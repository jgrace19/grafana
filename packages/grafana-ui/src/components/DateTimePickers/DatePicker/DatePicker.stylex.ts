import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../../themes/stylex/cssVar';

export const datePickerStyles = stylex.create({
  modal: {
    zIndex: cssVar('zIndex.modal'),
          boxShadow: cssVar('shadows.z3'),
          backgroundColor: cssVar('colors.background.primary'),
          border: `1px solid ${cssVar('colors.border.weak')}`,
          borderTopLeftRadius: cssVar('shape.radius.default'),
          borderBottomLeftRadius: cssVar('shape.radius.default'),
    
          'button:disabled': {
            color: cssVar('colors.text.disabled'),
          },
  },
});

export function datePickerStyleProps(key: keyof typeof datePickerStyles) {
  return stylex.props(datePickerStyles[key]);
}
