import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { deprecationWarning } from '@grafana/data';

import { motion } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, shape, spacing } from '../../themes/stylex/tokens.stylex';
import { type IconName, type IconSize, type IconType } from '../../types/icon';
import { type ComponentSize } from '../../types/size';
import { IconRenderer } from '../Button/Button';
import { getSvgSize } from '../Icon/utils';
import { Tooltip } from '../Tooltip/Tooltip';
import { type PopoverContent, type TooltipPlacement } from '../Tooltip/types';

export type IconButtonVariant = 'primary' | 'secondary' | 'destructive';

type LimitedIconSize = ComponentSize | 'xl';

interface BaseProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** Name of the icon **/
  name: IconName;
  /** Icon size - sizes xxl and xxxl are deprecated and when used being decreased to xl*/
  size?: IconSize;
  /** Type of the icon - mono or default */
  iconType?: IconType;
  /** Variant to change the color of the Icon */
  variant?: IconButtonVariant;
  /** @internal first-party StyleX overrides, applied last */
  xstyle?: stylex.StyleXStyles;
}

export interface BasePropsWithTooltip extends BaseProps {
  /** Tooltip content to display on hover and as the aria-label */
  tooltip: PopoverContent;
  /** Position of the tooltip */
  tooltipPlacement?: TooltipPlacement;
}

interface BasePropsWithAriaLabel extends BaseProps {
  /** @deprecated use aria-label instead*/
  ariaLabel?: string;
  /** Text available only for screen readers. No tooltip will be set in this case. */
  ['aria-label']: string;
}

interface BasePropsWithAriaLabelledBy extends BaseProps {
  /** Reference to an element id that labels the button. No tooltip will be set in this case. */
  ['aria-labelledby']: string;
}

export type Props = BasePropsWithTooltip | BasePropsWithAriaLabel | BasePropsWithAriaLabelledBy;

/**
 * This component looks just like an icon but behaves like a button.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/inputs-iconbutton--docs
 */
export const IconButton = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { size = 'md', variant = 'secondary', xstyle } = props;
  let limitedIconSize: LimitedIconSize;

  // very large icons (xl to xxxl) are unified to size xl
  if (size === 'xxl' || size === 'xxxl') {
    deprecationWarning('IconButton', 'size="xxl" and size="xxxl"', 'size="xl"');
    limitedIconSize = 'xl';
  } else {
    limitedIconSize = size;
  }

  // Overall size of the hover background: the icon size plus 2 × 4px padding.
  const hoverSize = `calc(${getSvgSize(limitedIconSize)}px + ${spacing['--gf-spacing-grid-size']})`;
  const buttonStyles = [
    styles.button,
    variantStyles[variant],
    styles.hoverSize(hoverSize),
    props.disabled && styles.disabled,
    xstyle,
  ];

  let ariaLabel: string | undefined;
  let buttonRef: typeof ref | undefined;

  if ('tooltip' in props) {
    const { tooltip } = props;
    ariaLabel = typeof tooltip === 'string' ? tooltip : undefined;
  } else if ('ariaLabel' in props || 'aria-label' in props) {
    const { ariaLabel: deprecatedAriaLabel, ['aria-label']: ariaLabelProp } = props;
    ariaLabel = ariaLabelProp || deprecatedAriaLabel;
    buttonRef = ref;
  }

  // When using tooltip, ref is forwarded to Tooltip component instead for https://github.com/grafana/grafana/issues/65632
  if ('tooltip' in props) {
    const { name, iconType, className, style, tooltip, tooltipPlacement, xstyle: _xstyle, ...restProps } = props;
    return (
      <Tooltip ref={ref} content={tooltip} placement={tooltipPlacement}>
        <button
          {...restProps}
          ref={buttonRef}
          aria-label={ariaLabel}
          {...mergeStylexProps(stylex.props(buttonStyles), { className, style })}
          type="button"
        >
          <IconRenderer icon={name} size={limitedIconSize} xstyle={styles.icon} iconType={iconType} />
        </button>
      </Tooltip>
    );
  } else {
    const { name, iconType, className, style, xstyle: _xstyle, ...restProps } = props;
    return (
      <button
        {...restProps}
        ref={buttonRef}
        aria-label={ariaLabel}
        {...mergeStylexProps(stylex.props(buttonStyles), { className, style })}
        type="button"
      >
        <IconRenderer icon={name} size={limitedIconSize} xstyle={styles.icon} iconType={iconType} />
      </button>
    );
  }
});

IconButton.displayName = 'IconButton';

const focusRing = `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`;

// Any focus shows the ring; a mouse focus (:focus:not(:focus-visible)) removes it again.
const styles = stylex.create({
  button: {
    zIndex: 0,
    position: 'relative',
    marginTop: 0,
    marginRight: spacing['--gf-spacing-x0-5'],
    marginBottom: 0,
    marginLeft: 0,
    boxShadow: { default: 'none', ':focus': { default: focusRing, ':not(:focus-visible)': 'none' } },
    borderStyle: 'none',
    display: 'inline-flex',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    borderRadius: shape['--gf-shape-radius-default'],
    outlineStyle: { default: null, ':focus': { default: 'dotted', ':not(:focus-visible)': 'none' } },
    outlineWidth: { default: null, ':focus': '2px' },
    outlineColor: { default: null, ':focus': 'transparent' },
    outlineOffset: { default: null, ':focus': '2px' },
    transitionProperty: { default: null, ':focus': 'outline, outline-offset, box-shadow' },
    transitionDuration: { default: null, ':focus': { default: null, [motion.noPreferenceOrReduce]: '0.2s' } },
    transitionTimingFunction: {
      default: null,
      ':focus': { default: null, [motion.noPreferenceOrReduce]: 'cubic-bezier(0.19, 1, 0.22, 1)' },
    },
    '::before': {
      zIndex: -1,
      position: 'absolute',
      opacity: { default: 0, ':hover': 1 },
      borderRadius: shape['--gf-shape-radius-default'],
      content: '""',
      transitionDuration: { default: null, [motion.noPreferenceOrReduce]: '0.2s' },
      transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'opacity' },
    },
  },
  hoverSize: (size: string) => ({
    '::before': {
      width: size,
      height: size,
    },
  }),
  // A native :disabled button wins over hover/active, so this replaces the hover background. The values sit under
  // `:disabled`, like main's `&:disabled` rule, so they also beat a consumer's className (scripts/stylex/stateRules.js).
  disabled: {
    cursor: { default: null, ':disabled': 'not-allowed' },
    color: { default: null, ':disabled': colors['--gf-colors-action-disabled-text'] },
    opacity: { default: null, ':disabled': 0.65 },
    '::before': {
      backgroundColor: { default: null, ':disabled': 'transparent' },
    },
  },
  icon: {
    verticalAlign: 'baseline',
  },
});

// Pressing shows no background (a transparent secondary text button's active state).
const variantStyles = stylex.create({
  primary: {
    color: colors['--gf-colors-primary-text'],
    '::before': {
      backgroundColor: { default: null, ':hover': colors['--gf-colors-primary-transparent'], ':active': 'transparent' },
    },
  },
  secondary: {
    color: colors['--gf-colors-secondary-text'],
    '::before': {
      backgroundColor: {
        default: null,
        ':hover': colors['--gf-colors-secondary-transparent'],
        ':active': 'transparent',
      },
    },
  },
  destructive: {
    color: colors['--gf-colors-error-text'],
    '::before': {
      backgroundColor: { default: null, ':hover': colors['--gf-colors-error-transparent'], ':active': 'transparent' },
    },
  },
});
