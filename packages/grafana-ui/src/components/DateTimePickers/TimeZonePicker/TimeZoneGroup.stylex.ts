import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../../themes/stylex/cssVar';

export const timeZoneGroupStyles = stylex.create({
  header: {
    padding: '7px 10px',
          width: '100%',
          borderTop: `1px solid ${cssVar('colors.border.weak')}`,
          textTransform: 'capitalize',
  },
  label: {
    fontSize: cssVar('typography.size.sm'),
          color: cssVar('colors.text.secondary'),
          fontWeight: cssVar('typography.fontWeightMedium'),
  },
});

export function timeZoneGroupStyleProps(key: keyof typeof timeZoneGroupStyles) {
  return stylex.props(timeZoneGroupStyles[key]);
}
