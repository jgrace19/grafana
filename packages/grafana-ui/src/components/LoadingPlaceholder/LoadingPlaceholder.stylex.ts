import * as stylex from '@stylexjs/stylex';

import { spacingToken } from '../../themes/stylex/spacingTokens';

export const loadingPlaceholderStyles = stylex.create({
  container: {
    marginBottom: spacingToken(4),
  },
});

export function loadingPlaceholderStyleProps(key: keyof typeof loadingPlaceholderStyles) {
  return stylex.props(loadingPlaceholderStyles[key]);
}
