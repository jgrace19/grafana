import * as stylex from '@stylexjs/stylex';
import { type HTMLProps, useCallback } from 'react';
import * as React from 'react';

import { motion } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, components, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';

import { labelStyles } from './Label';
import { checkboxInputMarker } from './markers.stylex';

export interface CheckboxProps extends Omit<HTMLProps<HTMLInputElement>, 'value'> {
  /** Label to display next to checkbox */
  label?: string;
  /** Description to display under the label */
  description?: string | React.ReactElement;
  /** Current value of the checkbox */
  value?: boolean;
  /** htmlValue allows to specify the input "value" attribute */
  htmlValue?: string | number;
  /** Sets the checkbox into a "mixed" state */
  indeterminate?: boolean;
  /** Show an invalid state around the input */
  invalid?: boolean;
  /** @internal first-party StyleX overrides for the wrapping label */
  xstyle?: stylex.StyleXStyles;
}

/**
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/inputs-checkbox--docs
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      value,
      htmlValue,
      onChange,
      disabled,
      className,
      indeterminate,
      invalid,
      xstyle,
      ...inputProps
    },
    ref
  ) => {
    const handleOnChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
          onChange(e);
        }
      },
      [onChange]
    );

    return (
      <label {...mergeStylexProps(stylex.props(styles.wrapper, xstyle), { className })}>
        <div {...stylex.props(styles.checkboxWrapper)}>
          <input
            type="checkbox"
            {...stylex.props(styles.input, checkboxInputMarker)}
            checked={value}
            disabled={disabled}
            onChange={handleOnChange}
            value={htmlValue}
            {...inputProps}
            ref={(element) => {
              if (element && indeterminate) {
                element.indeterminate = true;
              }

              // we have to manually assign the ref since we need to modify the indeterminate property
              if (ref) {
                if (typeof ref === 'function') {
                  ref(element);
                } else {
                  ref.current = element;
                }
              }
            }}
          />
          <span
            {...stylex.props(
              styles.checkmark,
              indeterminate && indeterminateStyles.checkmark,
              invalid && styles.checkmarkInvalid
            )}
          />
        </div>
        {label && <span {...stylex.props(labelStyles.label, styles.label)}>{label}</span>}
        {description && <span {...stylex.props(labelStyles.description, styles.description)}>{description}</span>}
      </label>
    );
  }
);

// The checkmark takes its states from the hidden input before it. Conditions whose values differ are kept
// mutually exclusive: StyleX orders them by its own priority, not by source order.
const styles = stylex.create({
  wrapper: {
    display: 'inline-grid',
    alignItems: 'center',
    columnGap: spacing['--gf-spacing-x1'],
    // gridAutoRows is needed to prevent https://github.com/grafana/grafana/issues/68570 in safari
    gridAutoRows: 'max-content',
    position: 'relative',
    verticalAlign: 'middle',
  },
  input: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
  },
  checkboxWrapper: {
    display: 'flex',
    alignItems: 'center',
    gridColumnStart: 1,
    gridRowStart: 1,
  },
  checkmark: {
    position: 'relative' /* Checkbox should be layered on top of the invisible input so it recieves :hover */,
    zIndex: 2,
    display: 'inline-block',
    width: spacing['--gf-spacing-x2'],
    height: spacing['--gf-spacing-x2'],
    borderRadius: shape['--gf-shape-radius-sm'],
    backgroundColor: {
      default: components['--gf-components-input-background'],
      ':hover': {
        default: null,
        [stylex.when.siblingBefore(':checked:not(:disabled)', checkboxInputMarker)]:
          colors['--gf-colors-primary-shade'],
      },
      [stylex.when.siblingBefore(':checked:not(:disabled)', checkboxInputMarker)]: colors['--gf-colors-primary-main'],
      [stylex.when.siblingBefore(':disabled', checkboxInputMarker)]: colors['--gf-colors-action-disabled-background'],
    },
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: components['--gf-components-input-border-color'],
      ':hover': {
        default: components['--gf-components-input-border-hover'],
        [stylex.when.siblingBefore(':checked:not(:disabled)', checkboxInputMarker)]: colors['--gf-colors-primary-main'],
        [stylex.when.siblingBefore(':disabled', checkboxInputMarker)]: colors['--gf-colors-action-disabled-background'],
      },
      [stylex.when.siblingBefore(':checked:not(:disabled)', checkboxInputMarker)]: colors['--gf-colors-primary-main'],
      [stylex.when.siblingBefore(':disabled', checkboxInputMarker)]: colors['--gf-colors-action-disabled-background'],
    },
    cursor: {
      default: null,
      ':hover': { default: 'pointer', [stylex.when.siblingBefore(':disabled', checkboxInputMarker)]: 'not-allowed' },
      [stylex.when.siblingBefore(':disabled', checkboxInputMarker)]: 'not-allowed',
    },
    // Keyboard focus shows the ring; mouse focus removes it.
    outlineStyle: {
      default: null,
      [stylex.when.siblingBefore(':focus-visible', checkboxInputMarker)]: 'dotted',
      [stylex.when.siblingBefore(':focus:not(:focus-visible)', checkboxInputMarker)]: 'none',
    },
    outlineWidth: { default: null, [stylex.when.siblingBefore(':focus-visible', checkboxInputMarker)]: '2px' },
    outlineColor: { default: null, [stylex.when.siblingBefore(':focus-visible', checkboxInputMarker)]: 'transparent' },
    outlineOffset: { default: null, [stylex.when.siblingBefore(':focus', checkboxInputMarker)]: '2px' },
    boxShadow: {
      default: null,
      [stylex.when.siblingBefore(':focus-visible', checkboxInputMarker)]:
        `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`,
      [stylex.when.siblingBefore(':focus:not(:focus-visible)', checkboxInputMarker)]: 'none',
    },
    transitionProperty: {
      default: null,
      [stylex.when.siblingBefore(':focus', checkboxInputMarker)]: 'outline, outline-offset, box-shadow',
    },
    transitionDuration: {
      default: null,
      [motion.noPreferenceOrReduce]: {
        default: null,
        [stylex.when.siblingBefore(':focus', checkboxInputMarker)]: '0.2s',
      },
    },
    transitionTimingFunction: {
      default: null,
      [motion.noPreferenceOrReduce]: {
        default: null,
        [stylex.when.siblingBefore(':focus', checkboxInputMarker)]: 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
    // The tick, shown while checked.
    '::after': {
      content: { default: null, [stylex.when.siblingBefore(':checked', checkboxInputMarker)]: '""' },
      position: 'absolute',
      zIndex: 2,
      left: spacing['--gf-spacing-x0-5'],
      top: 0,
      width: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
      height: `calc(${spacing['--gf-spacing-grid-size']} * 1.5)`,
      borderStyle: 'solid',
      borderColor: {
        default: colors['--gf-colors-primary-contrast-text'],
        [stylex.when.siblingBefore(':disabled', checkboxInputMarker)]: colors['--gf-colors-action-disabled-text'],
      },
      borderTopWidth: 0,
      borderRightWidth: '3px',
      borderBottomWidth: '3px',
      borderLeftWidth: 0,
      transform: 'rotate(45deg)',
    },
  },
  checkmarkInvalid: {
    borderColor: colors['--gf-colors-error-border'],
  },
  label: {
    gridColumnStart: 2,
    gridRowStart: 1,
    position: 'relative',
    zIndex: 2,
    cursor: 'pointer',
    maxWidth: 'fit-content',
    lineHeight: typography['--gf-typography-body-small-line-height'],
    marginBottom: 0,
  },
  description: {
    gridColumnStart: 2,
    gridRowStart: 2,
    lineHeight: typography['--gf-typography-body-small-line-height'],
    marginTop: 0 /* The margin effectively comes from the top: -2px on the label above it */,
    // Enable interacting with description when checkbox is disabled
    zIndex: 1,
  },
});

// Replaces the checkmark properties the mixed state changes: the tick becomes a horizontal bar. The mixed state
// beats checked and disabled, unless the input is disabled with aria-checked="mixed".
const indeterminateStyles = stylex.create({
  checkmark: {
    backgroundColor: {
      default: components['--gf-components-input-background'],
      ':hover': {
        default: null,
        [stylex.when.siblingBefore(':checked:not(:disabled):not(:indeterminate)', checkboxInputMarker)]:
          colors['--gf-colors-primary-shade'],
        [stylex.when.siblingBefore(':indeterminate:not(:disabled[aria-checked="mixed"])', checkboxInputMarker)]:
          colors['--gf-colors-primary-shade'],
      },
      [stylex.when.siblingBefore(':checked:not(:disabled):not(:indeterminate)', checkboxInputMarker)]:
        colors['--gf-colors-primary-main'],
      [stylex.when.siblingBefore(':disabled:not(:indeterminate):not([aria-checked="mixed"])', checkboxInputMarker)]:
        colors['--gf-colors-action-disabled-background'],
      [stylex.when.siblingBefore(':indeterminate:not(:disabled[aria-checked="mixed"])', checkboxInputMarker)]:
        colors['--gf-colors-primary-main'],
      [stylex.when.siblingBefore(':disabled[aria-checked="mixed"]', checkboxInputMarker)]:
        colors['--gf-colors-action-disabled-background'],
    },
    borderColor: {
      default: components['--gf-components-input-border-color'],
      ':hover': {
        default: components['--gf-components-input-border-hover'],
        [stylex.when.siblingBefore(':checked:not(:disabled):not(:indeterminate)', checkboxInputMarker)]:
          colors['--gf-colors-primary-main'],
        [stylex.when.siblingBefore(':disabled:not(:indeterminate):not([aria-checked="mixed"])', checkboxInputMarker)]:
          colors['--gf-colors-action-disabled-background'],
        [stylex.when.siblingBefore(':indeterminate:not(:disabled[aria-checked="mixed"])', checkboxInputMarker)]:
          colors['--gf-colors-primary-main'],
        [stylex.when.siblingBefore(':disabled[aria-checked="mixed"]', checkboxInputMarker)]:
          colors['--gf-colors-error-transparent'],
      },
      [stylex.when.siblingBefore(':checked:not(:disabled):not(:indeterminate)', checkboxInputMarker)]:
        colors['--gf-colors-primary-main'],
      [stylex.when.siblingBefore(':disabled:not(:indeterminate):not([aria-checked="mixed"])', checkboxInputMarker)]:
        colors['--gf-colors-action-disabled-background'],
      [stylex.when.siblingBefore(':indeterminate:not(:disabled[aria-checked="mixed"])', checkboxInputMarker)]:
        colors['--gf-colors-primary-main'],
      [stylex.when.siblingBefore(':disabled[aria-checked="mixed"]', checkboxInputMarker)]:
        colors['--gf-colors-error-transparent'],
    },
    '::after': {
      content: {
        default: null,
        [stylex.when.siblingBefore(':checked', checkboxInputMarker)]: '""',
        [stylex.when.siblingBefore(':indeterminate', checkboxInputMarker)]: '""',
      },
      left: {
        default: spacing['--gf-spacing-x0-5'],
        [stylex.when.siblingBefore(':indeterminate', checkboxInputMarker)]: '2px',
      },
      right: { default: null, [stylex.when.siblingBefore(':indeterminate', checkboxInputMarker)]: '2px' },
      top: { default: 0, [stylex.when.siblingBefore(':indeterminate', checkboxInputMarker)]: 'calc(50% - 1.5px)' },
      width: {
        default: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
        [stylex.when.siblingBefore(':indeterminate', checkboxInputMarker)]: 'auto',
      },
      height: {
        default: `calc(${spacing['--gf-spacing-grid-size']} * 1.5)`,
        [stylex.when.siblingBefore(':indeterminate', checkboxInputMarker)]: '3px',
      },
      borderColor: {
        default: colors['--gf-colors-primary-contrast-text'],
        [stylex.when.siblingBefore(':disabled:not(:indeterminate):not([aria-checked="mixed"])', checkboxInputMarker)]:
          colors['--gf-colors-action-disabled-text'],
        [stylex.when.siblingBefore(':disabled[aria-checked="mixed"]', checkboxInputMarker)]:
          colors['--gf-colors-action-disabled-text'],
      },
      borderTopWidth: { default: 0, [stylex.when.siblingBefore(':indeterminate', checkboxInputMarker)]: '1.5px' },
      borderRightWidth: { default: '3px', [stylex.when.siblingBefore(':indeterminate', checkboxInputMarker)]: '1.5px' },
      borderBottomWidth: {
        default: '3px',
        [stylex.when.siblingBefore(':indeterminate', checkboxInputMarker)]: '1.5px',
      },
      borderLeftWidth: { default: 0, [stylex.when.siblingBefore(':indeterminate', checkboxInputMarker)]: '1.5px' },
      backgroundColor: {
        default: null,
        [stylex.when.siblingBefore(':indeterminate', checkboxInputMarker)]: colors['--gf-colors-primary-contrast-text'],
      },
      transform: {
        default: 'rotate(45deg)',
        [stylex.when.siblingBefore(':indeterminate', checkboxInputMarker)]: 'none',
      },
    },
  },
});

Checkbox.displayName = 'Checkbox';
