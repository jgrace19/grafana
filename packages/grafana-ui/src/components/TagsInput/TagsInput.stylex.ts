import * as stylex from '@stylexjs/stylex';

import { spacingToken } from '../../themes/stylex/spacingTokens';

export const tagsInputStyles = stylex.create({
  wrapper: {
    minHeight: spacingToken(4),
        display: 'flex',
        flexDirection: 'column',
        gap: spacingToken(1),
        flexWrap: 'wrap',
  },
  tags: {
    display: 'flex',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        gap: spacingToken(0.5),
  },
  addButtonStyle: {
    margin: `0 -${spacingToken(1)}`,
  },
});

export function tagsInputStyleProps(key: keyof typeof tagsInputStyles) {
  return stylex.props(tagsInputStyles[key]);
}
