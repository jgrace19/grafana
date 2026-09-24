import * as stylex from '@stylexjs/stylex';

import { Legend } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

export function VariableLegend({ xstyle, ...rest }: Parameters<typeof Legend>['0']) {
  return <Legend {...rest} xstyle={[styles.legend, xstyle]} />;
}

const styles = stylex.create({
  legend: {
    marginTop: spacing['--gf-spacing-x3'],
    marginBottom: spacing['--gf-spacing-x1'],
  },
});
