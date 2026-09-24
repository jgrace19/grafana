import * as stylex from '@stylexjs/stylex';

import { spacingToken } from '../../../themes/stylex/spacingTokens';

export const timeRangeListStyles = stylex.create({
  title: {
    display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px 5px 9px',
  },
  list: {
    padding: spacingToken(0.5),
  },
});

export function timeRangeListStyleProps(key: keyof typeof timeRangeListStyles) {
  return stylex.props(timeRangeListStyles[key]);
}
