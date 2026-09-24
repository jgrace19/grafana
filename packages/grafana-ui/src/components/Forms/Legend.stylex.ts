import * as stylex from '@stylexjs/stylex';

import { cssVar, cssVarSpacing } from '../../themes/stylex/cssVar';

export const legendStyles = stylex.create({
  legend: {
    fontSize: cssVar('typography.h3.fontSize'),
          fontWeight: cssVar('typography.fontWeightRegular'),
          margin: cssVarSpacing(0, 0, 2, 0),
  },
});

export function legendStyleProps(key: keyof typeof legendStyles) {
  return stylex.props(legendStyles[key]);
}
