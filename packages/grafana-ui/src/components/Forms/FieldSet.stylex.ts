import * as stylex from '@stylexjs/stylex';

import { spacingToken } from '../../themes/stylex/spacingTokens';

export const fieldSetStyles = stylex.create({
  wrapper: {
    marginBottom: spacingToken(4),
    
        ':last-child': {
          marginBottom: 0,
        },
  },
});

export function fieldSetStyleProps(key: keyof typeof fieldSetStyles) {
  return stylex.props(fieldSetStyles[key]);
}
