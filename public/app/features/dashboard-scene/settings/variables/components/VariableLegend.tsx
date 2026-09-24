import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { variableLegendStyles } from './VariableLegend.stylex';

import {Legend} from '@grafana/ui';

export function VariableLegend({ className, ...rest }: Parameters<typeof Legend>['0']) {

  return <Legend {...rest} {...mergeStylexClassName(stylex.props(variableLegendStyles.legend), clsx(className))} />;
}


