import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../../../core/stylex/spacing';

export const alertsViewStyles = stylex.create({
  container: {
    display: 'flex',
        flexDirection: 'column',
        gap: themeSpacing(1),
        marginTop: themeSpacing(3),
  },
  buttonWrapper: {
    position: 'relative',
        marginInlineStart: themeSpacing(2),
        minHeight: '30px',
  },
});
