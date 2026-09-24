import * as stylex from '@stylexjs/stylex';

import { cssVar, cssVarSpacing } from '../../themes/stylex/cssVar';

export const menuGroupStyles = stylex.create({
  groupLabel: {
    color: cssVar('colors.text.secondary'),
          fontSize: cssVar('typography.size.sm'),
          padding: cssVarSpacing(0.5, 1),
  },
});

export function menuGroupStyleProps(key: keyof typeof menuGroupStyles) {
  return stylex.props(menuGroupStyles[key]);
}
