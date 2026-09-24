import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../themes/stylex/cssVar';
import { spacingToken } from '../../themes/stylex/spacingTokens';

export const confirmContentStyles = stylex.create({
  text: {
    fontSize: cssVar('typography.h5.fontSize'),
        color: cssVar('colors.text.primary'),
  },
  description: {
    fontSize: cssVar('typography.body.fontSize'),
  },
  confirmationInput: {
    paddingTop: spacingToken(1),
  },
  buttonsContainer: {
    paddingTop: spacingToken(3),
  },
});

export function confirmContentStyleProps(key: keyof typeof confirmContentStyles) {
  return stylex.props(confirmContentStyles[key]);
}
