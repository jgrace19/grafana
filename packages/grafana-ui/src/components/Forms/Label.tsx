import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, spacing, typography } from '../../themes/stylex/tokens.stylex';
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
      <span {...stylex.props(labelStyles.categories)} key={`${c}/${i}`}>
        <span>{c}</span>
        <Icon name="angle-right" xstyle={labelStyles.chevron} />
      </span>
    );
  });

  return (
    <div {...mergeStylexProps(stylex.props(labelStyles.label), { className })}>
      <label {...labelProps}>
        <div {...stylex.props(labelStyles.labelContent)}>
          {categories}
          {children}
        </div>
        {description && <span {...stylex.props(labelStyles.description)}>{description}</span>}
      </label>
    </div>
  );
};

/** Shared with the components that render a Label-like heading (Checkbox, Field's legend). */
export const labelStyles = stylex.create({
  label: {
    fontSize: typography['--gf-typography-size-sm'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    lineHeight: 1.25,
    marginBottom: spacing['--gf-spacing-x0-5'],
    color: colors['--gf-colors-text-primary'],
    maxWidth: '480px',
  },
  labelContent: {
    display: 'flex',
    alignItems: 'center',
  },
  description: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-size-sm'],
    fontWeight: typography['--gf-typography-font-weight-regular'],
    marginTop: spacing['--gf-spacing-x0-25'],
    display: 'block',
  },
  categories: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  chevron: {
    marginTop: 0,
    marginRight: spacing['--gf-spacing-x0-25'],
    marginBottom: 0,
    marginLeft: spacing['--gf-spacing-x0-25'],
  },
});
