import { css } from '@emotion/css';
import * as React from 'react';

import { type GrafanaTheme2 } from '@grafana/data';

import { mergeStylexClassName } from '../../themes/stylex/mergeClassNames';
import { labelStyleProps } from './Label.stylex';


import { Icon } from '../Icon/Icon';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  description?: React.ReactNode;
  category?: React.ReactNode[];
}

/**
 * The label component can be used to label form inputs with a heading/"Option name" and a description. To automatically have the right arrangement of this component with a form input, use the `Field` component.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/forms-label--docs
 */
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

/** @deprecated Emotion styles for Field/Checkbox compatibility */
export const getLabelStyles = (theme: GrafanaTheme2) => ({
  label: css({
    label: 'Label',
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: 1.25,
    marginBottom: theme.spacing(0.5),
    color: theme.colors.text.primary,
    maxWidth: '480px',
  }),
  labelContent: css({
    display: 'flex',
    alignItems: 'center',
  }),
  description: css({
    label: 'Label-description',
    color: theme.colors.text.secondary,
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.fontWeightRegular,
    marginTop: theme.spacing(0.25),
    display: 'block',
  }),
  categories: css({
    label: 'Label-categories',
    display: 'inline-flex',
    alignItems: 'center',
  }),
  chevron: css({
    margin: theme.spacing(0, 0.25),
  }),
});

