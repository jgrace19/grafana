import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../../themes/stylex/cssVar';

export const timeRangeLabelStyles = stylex.create({
  placeholder: {
    color: cssVar('colors.text.disabled'),
          opacity: 1,
  },
});

export function timeRangeLabelStyleProps(key: keyof typeof timeRangeLabelStyles) {
  return stylex.props(timeRangeLabelStyles[key]);
}
