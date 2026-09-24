import * as stylex from '@stylexjs/stylex';

import { spacingToken } from '../../themes/stylex/spacingTokens';

export const emptyStateStyles = stylex.create({
  container: {
    display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: spacingToken(4),
        maxWidth: '600px',
  },
});

export function emptyStateStyleProps(key: keyof typeof emptyStateStyles) {
  return stylex.props(emptyStateStyles[key]);
}
