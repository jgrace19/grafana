import { clsx } from 'clsx';

import { Legend } from '@grafana/ui';

import './VariableLegend.css';

export function VariableLegend({ className, ...rest }: Parameters<typeof Legend>['0']) {
  return <Legend {...rest} className={clsx('gf-variable-legend', className)} />;
}
