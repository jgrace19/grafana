import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../../themes/stylex/cssVar';

export const timeZoneTitleStyles = stylex.create({
  title: {
    fontWeight: cssVar('typography.fontWeightRegular'),
          textOverflow: 'ellipsis',
  },
});

export function timeZoneTitleStyleProps(key: keyof typeof timeZoneTitleStyles) {
  return stylex.props(timeZoneTitleStyles[key]);
}
