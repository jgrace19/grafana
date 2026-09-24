import * as stylex from '@stylexjs/stylex';

import { cssVar, cssVarSpacing } from '../../themes/stylex/cssVar';
import { spacingToken } from '../../themes/stylex/spacingTokens';

export const vizLegendTableStyles = stylex.create({
  table: {
    width: '100%',
        'th:first-child': {
          width: '100%',
          borderBottom: `1px solid ${cssVar('colors.border.weak')}`,
        },
  },
  header: {
    color: cssVar('colors.primary.text'),
        fontWeight: cssVar('typography.fontWeightMedium'),
        borderBottom: `1px solid ${cssVar('colors.border.weak')}`,
        padding: cssVarSpacing(0.25, 1, 0.25, 1),
        fontSize: cssVar('typography.bodySmall.fontSize'),
        textAlign: 'right',
        whiteSpace: 'nowrap',
  },
  nameHeader: {
    textAlign: 'left',
        paddingLeft: '30px',
  },
  withIcon: {
    paddingRight: '4px',
  },
  headerSortable: {
    cursor: 'pointer',
  },
  filterAction: {
    marginLeft: spacingToken(0.5),
        display: 'inline-flex',
        verticalAlign: 'middle',
  },
});

export function vizLegendTableStyleProps(key: keyof typeof vizLegendTableStyles) {
  return stylex.props(vizLegendTableStyles[key]);
}
