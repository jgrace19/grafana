import * as stylex from '@stylexjs/stylex';
import { uniqueId } from 'lodash';
import { forwardRef, type HTMLProps, useRef } from 'react';

import { deprecationWarning } from '@grafana/data';

import { motion } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, components, shadows, shape, spacing } from '../../themes/stylex/tokens.stylex';
import { Icon } from '../Icon/Icon';

import { inlineSwitchMarker, switchMarker } from './markers.stylex';

export interface Props extends Omit<HTMLProps<HTMLInputElement>, 'value'> {
  value?: boolean;
  /** Show an invalid state around the input */
  invalid?: boolean;
}

/**
 * Switch is a representation of an on-off state – like a light switch. So you can use Switch to toggle binary states.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/inputs-switch--docs
 */
export const Switch = forwardRef<HTMLInputElement, Props>(
  ({ value, checked, onChange, id, label, disabled, invalid = false, className, style, ...inputProps }, ref) => {
    if (checked) {
      deprecationWarning('Switch', 'checked prop', 'value');
    }

    const switchIdRef = useRef(id ? id : uniqueId('switch-'));

    return (
      <div {...stylex.props(styles.switch, switchMarker)}>
        <input
          type="checkbox"
          role="switch"
          disabled={disabled}
          checked={value}
          onChange={(event) => {
            !disabled && onChange?.(event);
          }}
          id={switchIdRef.current}
          {...inputProps}
          {...mergeStylexProps(stylex.props(styles.input), { className, style })}
          ref={ref}
        />
        <label
          htmlFor={switchIdRef.current}
          aria-label={label}
          {...stylex.props(styles.label, invalid && styles.invalid)}
        >
          <Icon name="check" size="xs" xstyle={styles.thumb} />
        </label>
      </div>
    );
  }
);

Switch.displayName = 'Switch';

export interface InlineSwitchProps extends Props {
  /** Label to show next to the switch */
  showLabel?: boolean;
  /** Make inline switch's background and border transparent */
  transparent?: boolean;
  /** @internal first-party StyleX overrides for the container, applied last */
  xstyle?: stylex.StyleXStyles;
}

export const InlineSwitch = forwardRef<HTMLInputElement, InlineSwitchProps>(
  ({ transparent, className, showLabel, label, value, id, invalid, xstyle, ...props }, ref) => {
    const variant = transparent ? 'transparent' : props.disabled ? 'disabled' : 'default';

    return (
      <div
        {...mergeStylexProps(
          stylex.props(
            styles.inlineContainer,
            inlineSwitchMarker,
            inlineContainerStyles[variant],
            props.disabled && styles.disabled,
            xstyle
          ),
          { className }
        )}
      >
        {showLabel && (
          <label
            htmlFor={id}
            {...mergeStylexProps(stylex.props(styles.inlineLabel, value && styles.inlineLabelEnabled), {
              className: 'inline-switch-label',
            })}
          >
            {label}
          </label>
        )}
        <Switch {...props} id={id} label={label} ref={ref} value={value} invalid={invalid} />
      </div>
    );
  }
);

InlineSwitch.displayName = 'Switch';

const focusRing = `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`;

// The track and thumb take their states from the hidden checkbox. Conditions whose values differ are kept
// mutually exclusive: StyleX orders them by its own priority, not by source order.
const styles = stylex.create({
  switch: {
    width: spacing['--gf-spacing-x4'],
    height: spacing['--gf-spacing-x2'],
    position: 'relative',
    lineHeight: 1,
  },
  input: {
    height: '100%',
    width: '100%',
    opacity: 0,
    zIndex: -1000,
    position: 'absolute',
  },
  label: {
    width: '100%',
    height: '100%',
    cursor: { default: 'pointer', [stylex.when.ancestor(':has(> input:disabled)', switchMarker)]: 'not-allowed' },
    borderRadius: shape['--gf-shape-radius-pill'],
    backgroundColor: {
      default: components['--gf-components-input-background'],
      ':hover': {
        default: null,
        [stylex.when.ancestor(':has(> input:checked:not(:disabled))', switchMarker)]:
          colors['--gf-colors-primary-shade'],
      },
      [stylex.when.ancestor(':has(> input:checked:not(:disabled))', switchMarker)]: colors['--gf-colors-primary-main'],
      [stylex.when.ancestor(':has(> input:disabled:not(:checked))', switchMarker)]:
        colors['--gf-colors-action-disabled-background'],
      [stylex.when.ancestor(':has(> input:disabled:checked)', switchMarker)]: colors['--gf-colors-primary-transparent'],
    },
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: components['--gf-components-input-border-color'],
      ':hover': {
        default: components['--gf-components-input-border-hover'],
        [stylex.when.ancestor(':has(> input:checked:not(:disabled))', switchMarker)]:
          colors['--gf-colors-primary-main'],
        [stylex.when.ancestor(':has(> input:disabled)', switchMarker)]: colors['--gf-colors-border-weak'],
      },
      [stylex.when.ancestor(':has(> input:checked:not(:disabled))', switchMarker)]: colors['--gf-colors-primary-main'],
      [stylex.when.ancestor(':has(> input:disabled)', switchMarker)]: colors['--gf-colors-border-weak'],
    },
    // Keyboard focus shows the ring; mouse focus removes it.
    outlineStyle: {
      default: null,
      [stylex.when.ancestor(':has(> input:focus-visible)', switchMarker)]: 'dotted',
      [stylex.when.ancestor(':has(> input:focus:not(:focus-visible))', switchMarker)]: 'none',
    },
    outlineWidth: { default: null, [stylex.when.ancestor(':has(> input:focus-visible)', switchMarker)]: '2px' },
    outlineColor: { default: null, [stylex.when.ancestor(':has(> input:focus-visible)', switchMarker)]: 'transparent' },
    outlineOffset: { default: null, [stylex.when.ancestor(':has(> input:focus)', switchMarker)]: '2px' },
    boxShadow: {
      default: null,
      [stylex.when.ancestor(':has(> input:focus-visible)', switchMarker)]: focusRing,
      [stylex.when.ancestor(':has(> input:focus:not(:focus-visible))', switchMarker)]: 'none',
    },
    // Any focus swaps the track's colour transition for the focus ring's, whatever the motion preference.
    transitionProperty: {
      default: null,
      [motion.noPreference]: {
        default: 'all',
        [stylex.when.ancestor(':has(> input:focus)', switchMarker)]: 'outline, outline-offset, box-shadow',
      },
      [motion.reduce]: {
        default: null,
        [stylex.when.ancestor(':has(> input:focus)', switchMarker)]: 'outline, outline-offset, box-shadow',
      },
    },
    transitionDuration: {
      default: null,
      [motion.noPreference]: { default: '0.3s', [stylex.when.ancestor(':has(> input:focus)', switchMarker)]: '0.2s' },
      [motion.reduce]: { default: null, [stylex.when.ancestor(':has(> input:focus)', switchMarker)]: '0.2s' },
    },
    transitionTimingFunction: {
      default: null,
      [motion.noPreference]: {
        default: 'ease',
        [stylex.when.ancestor(':has(> input:focus)', switchMarker)]: 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      [motion.reduce]: {
        default: null,
        [stylex.when.ancestor(':has(> input:focus)', switchMarker)]: 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
  },
  thumb: {
    position: 'absolute',
    display: 'block',
    color: {
      default: 'transparent',
      [stylex.when.ancestor(':has(> input:checked:not(:disabled))', switchMarker)]: colors['--gf-colors-primary-main'],
      [stylex.when.ancestor(':has(> input:disabled:checked)', switchMarker)]:
        colors['--gf-colors-primary-contrast-text'],
    },
    width: `calc(${spacing['--gf-spacing-grid-size']} * 1.5)`,
    height: `calc(${spacing['--gf-spacing-grid-size']} * 1.5)`,
    borderRadius: shape['--gf-shape-radius-circle'],
    backgroundColor: {
      default: colors['--gf-colors-text-secondary'],
      [stylex.when.ancestor(':has(> input:checked:not(:disabled))', switchMarker)]:
        colors['--gf-colors-primary-contrast-text'],
      [stylex.when.ancestor(':has(> input:disabled)', switchMarker)]: colors['--gf-colors-text-disabled'],
    },
    boxShadow: shadows['--gf-shadows-z1'],
    left: 0,
    top: '50%',
    transform: {
      default: `translate3d(${spacing['--gf-spacing-x0-25']}, -50%, 0)`,
      [stylex.when.ancestor(':has(> input:checked)', switchMarker)]:
        `translate3d(calc(${spacing['--gf-spacing-grid-size']} * 2.25), -50%, 0)`,
    },
    transitionProperty: { default: null, [motion.noPreference]: 'transform' },
    transitionDuration: { default: null, [motion.noPreference]: '0.2s' },
    transitionTimingFunction: { default: null, [motion.noPreference]: 'cubic-bezier(0.19, 1, 0.22, 1)' },
    borderWidth: { default: null, '@media (forced-colors: active)': '1px' },
    borderStyle: { default: null, '@media (forced-colors: active)': 'solid' },
    borderColor: { default: null, '@media (forced-colors: active)': colors['--gf-colors-primary-contrast-text'] },
  },
  // A disabled, unchecked switch keeps its disabled border unless its checkbox is hovered.
  invalid: {
    borderColor: {
      default: colors['--gf-colors-error-border'],
      [stylex.when.ancestor(':has(> input:disabled:not(:checked):not(:hover))', switchMarker)]:
        colors['--gf-colors-border-weak'],
    },
  },
  inlineContainer: {
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x1'],
    height: `calc(${spacing['--gf-spacing-grid-size']} * ${components['--gf-components-height-md']})`,
    display: 'inline-flex',
    alignItems: 'center',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: shape['--gf-shape-radius-default'],
  },
  disabled: {
    color: 'rgba(204, 204, 220, 0.6)',
  },
  inlineLabel: {
    cursor: 'pointer',
    paddingRight: spacing['--gf-spacing-x1'],
    color: {
      default: colors['--gf-colors-text-secondary'],
      [stylex.when.ancestor(':hover', inlineSwitchMarker)]: colors['--gf-colors-text-primary'],
    },
    whiteSpace: 'nowrap',
  },
  inlineLabelEnabled: {
    color: colors['--gf-colors-text-primary'],
  },
});

// A disabled InlineSwitch keeps the hover border colour.
const inlineContainerStyles = stylex.create({
  default: {
    backgroundColor: components['--gf-components-input-background'],
    borderColor: {
      default: components['--gf-components-input-border-color'],
      ':hover': components['--gf-components-input-border-hover'],
    },
  },
  disabled: {
    backgroundColor: 'rgba(204, 204, 220, 0.04)',
    borderColor: { default: 'rgba(204, 204, 220, 0.04)', ':hover': components['--gf-components-input-border-hover'] },
  },
  transparent: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
});
