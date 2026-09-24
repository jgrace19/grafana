import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const traceQLSearchStyles = stylex.create({
  alert: {
    maxWidth: '75ch',
        marginTop: themeSpacing(2),
  },
  container: {
    display: 'flex',
        gap: '4px',
        flexWrap: 'wrap',
        flexDirection: 'column',
  },
  rawQueryContainer: {
    alignItems: 'center',
        backgroundColor: grafanaTokens.colors_background_secondary,
        display: 'flex',
        justifyContent: 'space-between',
        padding: themeSpacing(1),
  },
});
