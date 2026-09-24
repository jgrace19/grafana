import * as React from 'react';

import { mergeStylexClassName } from '../../themes/stylex/mergeClassNames';
import { labelStyleProps } from './Label.stylex';
import { Icon } from '../Icon/Icon';

export { getLabelStyles } from '../../themes/compat/labelStyles';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  description?: React.ReactNode;
  category?: React.ReactNode[];
}

export const Label = ({ children, description, className, category, ...labelProps }: LabelProps) => {
  const categories = category?.map((c, i) => {
    return (
      <span {...labelStyleProps('categories')} key={`${c}/${i}`}>
        <span>{c}</span>
        <Icon name="angle-right" {...labelStyleProps('chevron')} />
      </span>
    );
  });

  return (
    <div {...mergeStylexClassName(labelStyleProps('label'), className)}>
      <label {...labelProps}>
        <div {...labelStyleProps('labelContent')}>
          {categories}
          {children}
        </div>
        {description && <span {...labelStyleProps('description')}>{description}</span>}
      </label>
    </div>
  );
};
