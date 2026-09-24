import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { type StringSelector, selectors } from '@grafana/e2e-selectors';

import { motion } from '../../../themes/stylex/constants.stylex';
import { colors, components, shape, spacing, typography } from '../../../themes/stylex/tokens.stylex';
import { Tooltip } from '../../Tooltip/Tooltip';

import { radioInputMarker } from './markers.stylex';

export const RADIO_GROUP_PADDING = 2;
export type RadioButtonSize = 'sm' | 'md';

export interface RadioButtonProps {
  size?: RadioButtonSize;
  disabled?: boolean;
  name?: string;
  description?: string;
  active: boolean;
  id: string;
  onChange: () => void;
  onClick: () => void;
  fullWidth?: boolean;
  'aria-label'?: StringSelector;
  children?: React.ReactNode;
}

export const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>(
  (
    {
      children,
      active = false,
      disabled = false,
      size = 'md',
      onChange,
      onClick,
      id,
      name = undefined,
      description,
      fullWidth,
      'aria-label': ariaLabel,
    },
    ref
  ) => {
    const inputRadioButton = (
      <input
        type="radio"
        {...stylex.props(styles.radio, radioInputMarker)}
        onChange={onChange}
        onClick={onClick}
        disabled={disabled}
        id={id}
        checked={active}
        name={name}
        aria-label={ariaLabel}
        ref={ref}
      />
    );
    return description ? (
      <div
        {...stylex.props(styles.radioOption, fullWidth && styles.fullWidth)}
        data-testid={selectors.components.RadioButton.container}
      >
        <Tooltip content={description} placement="bottom">
          {inputRadioButton}
        </Tooltip>
        <label {...stylex.props(styles.radioLabel, sizeStyles[size])} htmlFor={id} title={description || ariaLabel}>
          {children}
        </label>
      </div>
    ) : (
      <div
        {...stylex.props(styles.radioOption, fullWidth && styles.fullWidth)}
        data-testid={selectors.components.RadioButton.container}
      >
        {inputRadioButton}
        <label {...stylex.props(styles.radioLabel, sizeStyles[size])} htmlFor={id} title={description || ariaLabel}>
          {children}
        </label>
      </div>
    );
  }
);

RadioButton.displayName = 'RadioButton';

// The label fills the group minus its 2px inner padding (RADIO_GROUP_PADDING) and 1px border on each side;
// line-height matches it for perfect vertical centering on windows and linux.
const labelHeight = (height: string) => `calc(${height} * ${spacing['--gf-spacing-grid-size']} - 4px - 2px)`;

// The label takes its states from the hidden radio input before it. StyleX ranks a :checked sibling above a
// :disabled one, so the checked colour excludes disabled inputs.
const styles = stylex.create({
  radioOption: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    textAlign: 'center',
  },
  fullWidth: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
  },
  radio: {
    position: 'absolute',
    opacity: 0,
    zIndex: 2,
    width: '100%',
    height: '100%',
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: {
      default: colors['--gf-colors-text-secondary'],
      ':hover': {
        default: colors['--gf-colors-text-primary'],
        [stylex.when.siblingBefore(':disabled', radioInputMarker)]: colors['--gf-colors-text-disabled'],
      },
      [stylex.when.siblingBefore(':checked:not(:disabled)', radioInputMarker)]: colors['--gf-colors-text-primary'],
      [stylex.when.siblingBefore(':disabled', radioInputMarker)]: colors['--gf-colors-text-disabled'],
    },
    borderRadius: `calc(max(0px, ${shape['--gf-shape-radius-default']} - 2px - 1px))`,
    backgroundColor: {
      default: colors['--gf-colors-background-primary'],
      [stylex.when.siblingBefore(':checked', radioInputMarker)]: colors['--gf-colors-action-selected'],
    },
    fontWeight: {
      default: null,
      [stylex.when.siblingBefore(':checked', radioInputMarker)]: typography['--gf-typography-font-weight-medium'],
    },
    zIndex: { default: null, [stylex.when.siblingBefore(':checked', radioInputMarker)]: 1 },
    cursor: { default: 'pointer', [stylex.when.siblingBefore(':disabled', radioInputMarker)]: 'not-allowed' },
    userSelect: 'none',
    whiteSpace: 'nowrap',
    flexGrow: 1,
    // Keyboard focus shows the ring; mouse focus removes it.
    outlineStyle: {
      default: null,
      [stylex.when.siblingBefore(':focus-visible', radioInputMarker)]: 'dotted',
      [stylex.when.siblingBefore(':focus:not(:focus-visible)', radioInputMarker)]: 'none',
    },
    outlineWidth: { default: null, [stylex.when.siblingBefore(':focus-visible', radioInputMarker)]: '2px' },
    outlineColor: { default: null, [stylex.when.siblingBefore(':focus-visible', radioInputMarker)]: 'transparent' },
    outlineOffset: { default: null, [stylex.when.siblingBefore(':focus', radioInputMarker)]: '2px' },
    boxShadow: {
      default: null,
      [stylex.when.siblingBefore(':focus-visible', radioInputMarker)]:
        `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`,
      [stylex.when.siblingBefore(':focus:not(:focus-visible)', radioInputMarker)]: 'none',
    },
    transitionProperty: {
      default: null,
      [stylex.when.siblingBefore(':focus', radioInputMarker)]: 'outline, outline-offset, box-shadow',
    },
    transitionDuration: {
      default: null,
      [motion.noPreferenceOrReduce]: { default: null, [stylex.when.siblingBefore(':focus', radioInputMarker)]: '0.2s' },
    },
    transitionTimingFunction: {
      default: null,
      [motion.noPreferenceOrReduce]: {
        default: null,
        [stylex.when.siblingBefore(':focus', radioInputMarker)]: 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
  },
});

const sizeStyles = stylex.create({
  sm: {
    fontSize: typography['--gf-typography-size-sm'],
    height: labelHeight(components['--gf-components-height-sm']),
    lineHeight: labelHeight(components['--gf-components-height-sm']),
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x1'],
  },
  md: {
    fontSize: typography['--gf-typography-size-md'],
    height: labelHeight(components['--gf-components-height-md']),
    lineHeight: labelHeight(components['--gf-components-height-md']),
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x2'],
  },
});
