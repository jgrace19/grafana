import * as stylex from '@stylexjs/stylex';

import { cssVar, cssVarSpacing } from '../../themes/stylex/cssVar';
import { spacingToken } from '../../themes/stylex/spacingTokens';

export const labelStyles = stylex.create({
  label: {
    label: 'Label',
        fontSize: cssVar('typography.size.sm'),
        fontWeight: cssVar('typography.fontWeightMedium'),
        lineHeight: 1.25,
        marginBottom: spacingToken(0.5),
        color: cssVar('colors.text.primary'),
        maxWidth: '480px',
  },
  labelContent: {
    display: 'flex',
        alignItems: 'center',
  },
  description: {
    label: 'Label-description',
        color: cssVar('colors.text.secondary'),
        fontSize: cssVar('typography.size.sm'),
        fontWeight: cssVar('typography.fontWeightRegular'),
        marginTop: spacingToken(0.25),
        display: 'block',
  },
  categories: {
    label: 'Label-categories',
        display: 'inline-flex',
        alignItems: 'center',
  },
  chevron: {
    margin: cssVarSpacing(0, 0.25),
  },
});

export function labelStyleProps(key: keyof typeof labelStyles) {
  return stylex.props(labelStyles[key]);
}
