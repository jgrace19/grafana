import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const queryBuilderHintsStyles = stylex.create({
  root: {
    padding: grafanaTokens.spacing_x0_5,
  },
  container: {
    display: 'flex',
    alignItems: 'start',
  },
  hint: {
    marginRight: grafanaTokens.spacing_x1,
    marginBottom: grafanaTokens.spacing_x1,
  },
});
