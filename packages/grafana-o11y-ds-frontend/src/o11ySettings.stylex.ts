import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const o11yFullWidth = stylex.create({
  fullWidth: {
    width: '100%',
  },
});

export const o11yInfoTextStyles = stylex.create({
  infoText: {
    fontSize: grafanaTokens.typography_size_sm,
    paddingBottom: grafanaTokens.spacing_x2,
    color: grafanaTokens.colors_text_secondary,
  },
  row: {
    alignItems: 'baseline',
  },
  queryRow: {
    display: 'flex',
    flexFlow: 'wrap',
  },
  container: {
    width: '100%',
  },
});
