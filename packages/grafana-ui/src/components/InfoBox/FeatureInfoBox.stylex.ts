import * as stylex from '@stylexjs/stylex';

import { spacingToken } from '../../themes/stylex/spacingTokens';

export const featureInfoBoxStyles = stylex.create({
  badge: {
    marginBottom: spacingToken(1),
  },
});

export function featureInfoBoxStyleProps(key: keyof typeof featureInfoBoxStyles) {
  return stylex.props(featureInfoBoxStyles[key]);
}
