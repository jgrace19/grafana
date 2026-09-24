import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../themes/stylex/cssVar';
import { spacingToken } from '../../themes/stylex/spacingTokens';

export const seriesTableStyles = stylex.create({
  icon: {
    marginRight: spacingToken(1),
          verticalAlign: 'middle',
  },
  seriesTable: {
    display: 'table',
  },
  seriesTableRow: {
    display: 'table-row',
          fontSize: cssVar('typography.bodySmall.fontSize'),
  },
  seriesTableCell: {
    display: 'table-cell',
  },
  label: {
    wordBreak: 'break-all',
  },
  value: {
    paddingLeft: spacingToken(2),
          textAlign: 'right',
  },
  activeSeries: {
    fontWeight: cssVar('typography.fontWeightBold'),
          color: cssVar('colors.text.maxContrast'),
  },
  timestamp: {
    fontWeight: cssVar('typography.fontWeightBold'),
          fontSize: cssVar('typography.bodySmall.fontSize'),
  },
});

export function seriesTableStyleProps(key: keyof typeof seriesTableStyles) {
  return stylex.props(seriesTableStyles[key]);
}
