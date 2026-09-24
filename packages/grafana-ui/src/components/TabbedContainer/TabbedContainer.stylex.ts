import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../themes/stylex/cssVar';
import { spacingToken } from '../../themes/stylex/spacingTokens';

export const tabbedContainerStyles = stylex.create({
  container: {
    height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 0',
        minHeight: 0,
  },
  tabContent: {
    padding: spacingToken(2),
        backgroundColor: cssVar('colors.background.primary'),
        flex: 1,
  },
  tabs: {
    paddingTop: spacingToken(0.5),
        borderColor: cssVar('colors.border.weak'),
        ul: {
          marginLeft: spacingToken(2),
        },
  },
});

export function tabbedContainerStyleProps(key: keyof typeof tabbedContainerStyles) {
  return stylex.props(tabbedContainerStyles[key]);
}
