import * as stylex from '@stylexjs/stylex';

import { spacing } from '@grafana/ui/stylex/tokens.stylex';

export const formStyles = stylex.create({
  input: {
    flex: '1',
  },
  promDurationInput: {
    maxWidth: `calc(${spacing['--gf-spacing-grid-size']} * 32)`,
  },
  timingFormContainer: {
    padding: spacing['--gf-spacing-x1'],
  },
});
