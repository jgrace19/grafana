import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../themes/stylex/cssVar';
import { spacingToken } from '../../themes/stylex/spacingTokens';

export const vizLegendListItemStyles = stylex.create({
  label: {
    label: 'LegendLabel',
    whiteSpace: 'nowrap',
    background: 'none',
    border: 'none',
    fontSize: 'inherit',
    padding: 0,
    userSelect: 'text',
  },
  itemDisabled: { label: 'LegendLabelDisabled', color: cssVar('colors.text.disabled') },
  itemWrapper: {
    label: 'LegendItemWrapper',
    display: 'flex',
    whiteSpace: 'nowrap',
    alignItems: 'center',
    gap: spacingToken(1),
    flexGrow: 1,
  },
});

export function vizLegendListItemStyleProps(key: keyof typeof vizLegendListItemStyles) {
  return stylex.props(vizLegendListItemStyles[key]);
}
