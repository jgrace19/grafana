import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const queryPatternStyles = stylex.create({
  card: {
    width: '49.5%',
          display: 'flex',
          flexDirection: 'column',
  },
  rawQueryContainer: {
    flexGrow: 1,
  },
  rawQuery: {
    backgroundColor: grafanaTokens.colors_background_primary,
          padding: themeSpacing(1),
          marginTop: themeSpacing(1),
  },
  spacing: {
    marginBottom: themeSpacing(1),
  },
});
