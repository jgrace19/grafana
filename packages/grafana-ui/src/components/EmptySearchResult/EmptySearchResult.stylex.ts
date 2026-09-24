import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../themes/stylex/cssVar';
import { spacingToken } from '../../themes/stylex/spacingTokens';

export const emptySearchResultStyles = stylex.create({
  container: {
    borderLeft: `3px solid ${cssVar('colors.info.main')}`,
          backgroundColor: `${cssVar('colors.background.secondary')}`,
          padding: spacingToken(2),
          minWidth: '350px',
          borderRadius: cssVar('shape.radius.default'),
          marginBottom: spacingToken(4),
  },
});

export function emptySearchResultStyleProps(key: keyof typeof emptySearchResultStyles) {
  return stylex.props(emptySearchResultStyles[key]);
}
