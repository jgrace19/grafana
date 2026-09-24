
import { mergeStylexClassName } from '../../themes/stylex/mergeClassNames';
import { fieldSetStyleProps } from './FieldSet.stylex'

import { type HTMLProps } from 'react';
import * as React from 'react';



import { Legend } from './Legend';

export interface Props extends Omit<HTMLProps<HTMLFieldSetElement>, 'label'> {
  children: React.ReactNode[] | React.ReactNode;
  /** Label for the fieldset's legend */
  label?: React.ReactNode;
}

/**
 * Component used to group form elements inside a form, equivalent to HTML's [fieldset](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset) tag. Accepts optional label, which, if provided, is used as a text for the set's legend.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/forms-fieldset--docs
 */
export const FieldSet = ({ label, children, className, ...rest }: Props) => {

  return (
    <fieldset {...mergeStylexClassName(fieldSetStyleProps('wrapper'), className)} {...rest}>
      {label && <Legend>{label}</Legend>}
      {children}
    </fieldset>
  );
};

