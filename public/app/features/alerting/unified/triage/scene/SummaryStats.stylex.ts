import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const summaryStatsStyles = stylex.create({
  statsGrid: {
    display: 'grid',
        gridTemplateColumns: 'max-content max-content max-content max-content',
        alignItems: 'center',
        columnGap: themeSpacing(1.5),
        rowGap: themeSpacing(0.5),
        fontSize: grafanaTokens.typography_body_fontSize,
  },
  statRow: {
    gridColumn: '1 / -1',
        display: 'grid',
        gridTemplateColumns: 'subgrid',
        alignItems: 'center',
  },
  statValue: {
    fontWeight: grafanaTokens.typography_fontWeightBold,
        fontSize: grafanaTokens.typography_h4_fontSize,
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
  },
  errorColor: {
    color: grafanaTokens.colors_error_text,
  },
  warningColor: {
    color: grafanaTokens.colors_warning_text,
  },
});
