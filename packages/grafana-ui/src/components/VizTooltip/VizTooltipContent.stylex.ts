import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../themes/stylex/cssVar';
import { spacingToken } from '../../themes/stylex/spacingTokens';

export const vizTooltipContentStyles = stylex.create({
  wrapper: {
    display: 'flex',
        flexDirection: 'column',
        flex: 1,
        gap: 2,
        borderTop: `1px solid ${cssVar('colors.border.weak')}`,
        padding: spacingToken(1),
  },
});

export function vizTooltipContentStyleProps(key: keyof typeof vizTooltipContentStyles) {
  return stylex.props(vizTooltipContentStyles[key]);
}
