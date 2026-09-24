import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

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
    padding: grafanaTokens.spacing_x1,
    marginTop: grafanaTokens.spacing_x1,
  },
  spacing: {
    marginBottom: grafanaTokens.spacing_x1,
  },
});
