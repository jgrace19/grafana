import * as stylex from '@stylexjs/stylex';

import { spacingToken } from '../../../themes/stylex/spacingTokens';

export const radioButtonListStyles = stylex.create({
  container: {
    display: 'grid',
        gap: spacingToken(1),
  },
});

export function radioButtonListStyleProps(key: keyof typeof radioButtonListStyles) {
  return stylex.props(radioButtonListStyles[key]);
}
