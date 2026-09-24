import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { colors, shape, spacing, typography, v1 } from '../../../themes/stylex/tokens.stylex';

export interface RadioButtonDotProps<T>
  extends Omit<React.HTMLProps<HTMLInputElement>, 'label' | 'value' | 'onChange' | 'type'> {
  id: string;
  name: string;
  checked?: boolean;
  value?: T;
  disabled?: boolean;
  label: React.ReactNode;
  description?: string;
  onChange?: (id: string) => void;
}

export const RadioButtonDot = <T extends string | number | readonly string[]>({
  id,
  name,
  label,
  checked,
  value,
  disabled,
  description,
  onChange,
  ...props
}: RadioButtonDotProps<T>) => {
  return (
    <label title={description} {...stylex.props(styles.label)}>
      <input
        {...props}
        id={id}
        name={name}
        type="radio"
        checked={checked}
        value={value}
        disabled={disabled}
        {...stylex.props(styles.input)}
        onChange={() => onChange && onChange(id)}
      />
      <div>
        {label}
        {description && <div {...stylex.props(styles.description)}>{description}</div>}
      </div>
    </label>
  );
};

const styles = stylex.create({
  input: {
    position: 'relative',
    appearance: 'none',
    outlineStyle: 'none',
    // StyleX ranks :checked above :disabled; `:is(:checked)` ranks below it, so the disabled look wins.
    backgroundColor: {
      default: colors['--gf-colors-background-canvas'],
      ':is(:checked)': v1['--gf-v1-palette-white'],
      ':disabled': colors['--gf-colors-action-disabled-background'],
    },
    width: spacing['--gf-spacing-x2'],
    height: spacing['--gf-spacing-x2'],
    borderStyle: 'solid',
    borderWidth: { default: '1px', ':is(:checked)': '5px', ':disabled': '1px' },
    borderColor: {
      default: colors['--gf-colors-border-medium'],
      ':is(:checked)': colors['--gf-colors-primary-main'],
      ':disabled': colors['--gf-colors-border-weak'],
    },
    borderRadius: shape['--gf-shape-radius-circle'],
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    marginTop: '3px' /* Space for box-shadow when focused */,
    marginRight: 0,
    marginBottom: '3px',
    marginLeft: 0,
    boxShadow: {
      default: null,
      ':focus': `0 0 0 1px ${colors['--gf-colors-background-canvas']}, 0 0 0 3px ${colors['--gf-colors-primary-main']}`,
    },
    '::after': {
      content: { default: null, ':disabled:checked': '""' },
      width: '6px',
      height: '6px',
      backgroundColor: colors['--gf-colors-text-disabled'],
      borderRadius: shape['--gf-shape-radius-circle'],
      display: 'inline-block',
      position: 'absolute',
      top: '4px',
      left: '4px',
    },
  },
  label: {
    fontSize: typography['--gf-typography-font-size'],
    lineHeight: '22px' /* 16px for the radio button and 6px for the focus shadow */,
    display: 'grid',
    gridTemplateColumns: `${spacing['--gf-spacing-x2']} auto`,
    gap: spacing['--gf-spacing-x1'],
    cursor: 'pointer',
  },
  description: {
    fontSize: typography['--gf-typography-size-sm'],
    color: colors['--gf-colors-text-secondary'],
  },
});
