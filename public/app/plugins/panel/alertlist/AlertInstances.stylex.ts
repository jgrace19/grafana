import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const alertInstancesStyles = stylex.create({
  clickable: {
    cursor: 'pointer',
  },
  footerRow: {
    display: 'flex',
        flexDirection: 'column',
        gap: themeSpacing(1),
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
  },
});
