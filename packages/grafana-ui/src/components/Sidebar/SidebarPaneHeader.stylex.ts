import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../themes/stylex/cssVar';
import { spacingToken } from '../../themes/stylex/spacingTokens';

export const sidebarPaneHeaderStyles = stylex.create({
  wrapper: {
    display: 'flex',
          alignItems: 'center',
          padding: spacingToken(1.5),
          height: spacingToken(6),
          gap: spacingToken(1),
          borderBottom: `1px solid ${cssVar('colors.border.weak')}`,
  },
  flexGrow: {
    flexGrow: 1,
  },
});

export function sidebarPaneHeaderStyleProps(key: keyof typeof sidebarPaneHeaderStyles) {
  return stylex.props(sidebarPaneHeaderStyles[key]);
}
