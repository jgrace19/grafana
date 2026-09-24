import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const filtersOverviewRowStyles = stylex.create({
  groupRow: {
    display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: themeSpacingShorthand(1, 0.5),
  },
  groupButton: {
    width: '100%',
        display: 'flex',
        alignItems: 'center',
        background: 'transparent',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        color: 'inherit',
        textAlign: 'left',
  },
  groupButtonInner: {
    display: 'flex',
        alignItems: 'center',
        gap: themeSpacing(0.75),
  },
  groupLabel: {
    fontWeight: grafanaTokens.typography_fontWeightMedium,
  },
});
