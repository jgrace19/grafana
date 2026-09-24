
import { mergeStylexClassName } from '../../themes/stylex/mergeClassNames';
import { legendStyleProps } from './Legend.stylex'

import { type ReactNode } from 'react';
import * as React from 'react';



export interface LabelProps extends React.HTMLAttributes<HTMLLegendElement> {
  children: string | ReactNode;
  description?: string;
}

;

/**
 * Legend should be used to add a caption to a group of related form elements that have been grouped toegheter into a `FieldSet`.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/forms-legend--docs
 */
export const Legend = ({ children, className, ...legendProps }: LabelProps) => {

  return (
    <legend {...mergeStylexClassName(legendStyleProps('legend'), className)} {...legendProps}>
      {children}
    </legend>
  );
};
