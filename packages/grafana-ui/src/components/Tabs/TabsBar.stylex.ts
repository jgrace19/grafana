import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../themes/stylex/cssVar';

export const tabsBarStyles = stylex.create({
  tabsWrapper: {
    borderBottom: `1px solid ${cssVar('colors.border.weak')}`,
        overflowX: 'auto',
  },
  noBorder: {
    borderBottom: 0,
  },
  tabs: {
    position: 'relative',
        display: 'flex',
        alignItems: 'center',
  },
});

export function tabsBarStyleProps(key: keyof typeof tabsBarStyles) {
  return stylex.props(tabsBarStyles[key]);
}
