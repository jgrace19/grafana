import * as stylex from '@stylexjs/stylex';

import { cssVar, cssVarSpacing } from '../../themes/stylex/cssVar';

export const menuDividerStyles = stylex.create({
  divider: {
    height: 1,
          backgroundColor: cssVar('colors.border.weak'),
          margin: cssVarSpacing(1, 0),
  },
});

export function menuDividerStyleProps(key: keyof typeof menuDividerStyles) {
  return stylex.props(menuDividerStyles[key]);
}
