import * as stylex from '@stylexjs/stylex';
import { type ReactNode } from 'react';
import * as React from 'react';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { spacing, typography } from '../../themes/stylex/tokens.stylex';

export interface LabelProps extends React.HTMLAttributes<HTMLLegendElement> {
  children: string | ReactNode;
  description?: string;
}

/**
 * Legend should be used to add a caption to a group of related form elements that have been grouped toegheter into a `FieldSet`.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/forms-legend--docs
 */
export const Legend = ({ children, className, ...legendProps }: LabelProps) => {
  return (
    <legend {...mergeStylexProps(stylex.props(styles.legend), { className })} {...legendProps}>
      {children}
    </legend>
  );
};

const styles = stylex.create({
  legend: {
    fontSize: typography['--gf-typography-h3-font-size'],
    fontWeight: typography['--gf-typography-font-weight-regular'],
    marginTop: 0,
    marginRight: 0,
    marginBottom: spacing['--gf-spacing-x2'],
    marginLeft: 0,
  },
});
