import * as stylex from '@stylexjs/stylex';

import { spacingToken } from '../../themes/stylex/spacingTokens';

export const infoBoxStyles = stylex.create({
  docsLink: {
    display: 'inline-block',
        marginTop: spacingToken(2),
  },
});

export function infoBoxStyleProps(key: keyof typeof infoBoxStyles) {
  return stylex.props(infoBoxStyles[key]);
}
