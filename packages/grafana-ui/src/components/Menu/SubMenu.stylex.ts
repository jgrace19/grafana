import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../themes/stylex/cssVar';
import { spacingToken } from '../../themes/stylex/spacingTokens';

export const subMenuStyles = stylex.create({
  iconWrapper: {
    display: 'flex',
          flex: 1,
          justifyContent: 'end',
  },
  icon: {
    opacity: 0.7,
          marginLeft: spacingToken(1),
          color: cssVar('colors.text.secondary'),
  },
  itemsWrapper: {
    background: cssVar('colors.background.elevated'),
          padding: spacingToken(0.5),
          boxShadow: cssVar('shadows.z3'),
          display: 'inline-block',
          borderRadius: cssVar('shape.radius.default'),
  },
  subMenu: {
    zIndex: cssVar('zIndex.dropdown'),
  },
});

export function subMenuStyleProps(key: keyof typeof subMenuStyles) {
  return stylex.props(subMenuStyles[key]);
}
