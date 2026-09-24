import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../themes/stylex/cssVar';
import { spacingToken } from '../../themes/stylex/spacingTokens';

export const segmentSectionStyles = stylex.create({
  label: {
    color: cssVar('colors.primary.text'),
  },
  fill: {
    flexGrow: 1,
        marginBottom: spacingToken(0.5),
  },
});

export function segmentSectionStyleProps(key: keyof typeof segmentSectionStyles) {
  return stylex.props(segmentSectionStyles[key]);
}
