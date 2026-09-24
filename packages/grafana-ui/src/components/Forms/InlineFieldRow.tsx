
import { mergeStylexClassName } from '../../themes/stylex/mergeClassNames';
import { inlineFieldRowStyleProps } from './InlineFieldRow.stylex'

import { type HTMLProps, type ReactNode } from 'react';



export interface Props extends Omit<HTMLProps<HTMLDivElement>, 'css'> {
  children: ReactNode | ReactNode[];
}

/**
 * Used to align multiple InlineField components in one row. The row will wrap if the width of the children exceeds its own. Equivalent to the div with gf-form-inline class name. Multiple InlineFieldRows vertically stack on each other.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/forms-inlinefieldrow--docs
 */
export const InlineFieldRow = ({ children, className, ...htmlProps }: Props) => {
  return (
    <div {...mergeStylexClassName(inlineFieldRowStyleProps('container'), className)} {...htmlProps}>
      {children}
    </div>
  );
};

;
