import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../../themes/stylex/cssVar';

export const timeZoneDescriptionStyles = stylex.create({
  description: {
    fontWeight: 'normal',
          fontSize: cssVar('typography.size.sm'),
          color: cssVar('colors.text.secondary'),
          whiteSpace: 'normal',
          textOverflow: 'ellipsis',
  },
});

export function timeZoneDescriptionStyleProps(key: keyof typeof timeZoneDescriptionStyles) {
  return stylex.props(timeZoneDescriptionStyles[key]);
}
