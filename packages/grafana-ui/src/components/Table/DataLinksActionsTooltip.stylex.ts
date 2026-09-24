import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../themes/stylex/cssVar';
import { spacingToken } from '../../themes/stylex/spacingTokens';

export const dataLinksActionsTooltipStyles = stylex.create({
  tooltipWrapper: {
    whiteSpace: 'pre',
          borderRadius: cssVar('shape.radius.default'),
          background: cssVar('colors.background.primary'),
          border: `1px solid ${cssVar('colors.border.weak')}`,
          boxShadow: cssVar('shadows.z3'),
          maxHeight: `calc(100vh - ${spacingToken(4)})`,
          overflowX: 'hidden',
          userSelect: 'text',
          fontSize: cssVar('typography.bodySmall.fontSize'),
  },
});

export function dataLinksActionsTooltipStyleProps(key: keyof typeof dataLinksActionsTooltipStyles) {
  return stylex.props(dataLinksActionsTooltipStyles[key]);
}
