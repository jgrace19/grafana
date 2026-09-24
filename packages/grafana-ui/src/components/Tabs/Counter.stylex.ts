import * as stylex from '@stylexjs/stylex';

import { cssVar, cssVarSpacing } from '../../themes/stylex/cssVar';
import { spacingToken } from '../../themes/stylex/spacingTokens';

export const counterStyles = stylex.create({
  counterPrimary: {
    label: 'counter',
    marginLeft: spacingToken(1),
    borderRadius: spacingToken(3),
    backgroundColor: cssVar('colors.primary.main'),
    padding: cssVarSpacing(0.25, 1),
    color: cssVar('colors.text.secondary'),
    fontWeight: cssVar('typography.fontWeightMedium'),
    fontSize: cssVar('typography.size.sm'),
  },
  counterSecondary: {
    label: 'counter',
    marginLeft: spacingToken(1),
    borderRadius: spacingToken(3),
    backgroundColor: cssVar('colors.secondary.main'),
    padding: cssVarSpacing(0.25, 1),
    color: cssVar('colors.text.secondary'),
    fontWeight: cssVar('typography.fontWeightMedium'),
    fontSize: cssVar('typography.size.sm'),
  },
});

export function counterStyleProps(key: keyof typeof counterStyles) {
  return stylex.props(counterStyles[key]);
}
