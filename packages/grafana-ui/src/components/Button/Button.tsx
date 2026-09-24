import * as stylex from '@stylexjs/stylex';
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react';
import * as React from 'react';

import { type GrafanaTheme2 } from '@grafana/data';

import { useTheme2 } from '../../themes/ThemeContext';
import { durations, easings, motion } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, components, shadows, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { type IconName, type IconSize, type IconType } from '../../types/icon';
import { type ComponentSize } from '../../types/size';
import { Icon } from '../Icon/Icon';
import { Tooltip } from '../Tooltip/Tooltip';
import { type PopoverContent, type TooltipPlacement } from '../Tooltip/types';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'success';
export const allButtonVariants: ButtonVariant[] = ['primary', 'secondary', 'destructive'];
export type ButtonFill = 'solid' | 'outline' | 'text';
export const allButtonFills: ButtonFill[] = ['solid', 'outline', 'text'];

type BaseProps = {
  size?: ComponentSize;
  variant?: ButtonVariant;
  fill?: ButtonFill;
  icon?: IconName | React.ReactElement<IconElementProps>;
  className?: string;
  fullWidth?: boolean;
  type?: string;
  tooltip?: PopoverContent;
  tooltipPlacement?: TooltipPlacement;
  /** Position of the icon */
  iconPlacement?: 'left' | 'right';
  /** @internal first-party StyleX overrides, applied last */
  xstyle?: stylex.StyleXStyles;
};

// either aria-label or tooltip is required for buttons without children
type NoChildrenAriaLabel = BaseProps & {
  children?: never;
  'aria-label': string;
};
type NoChildrenTooltip = BaseProps & {
  children?: never;
  tooltip: PopoverContent;
  tooltipPlacement?: TooltipPlacement;
};

type BasePropsWithChildren = BaseProps & {
  children: React.ReactNode;
};

type CommonProps = BasePropsWithChildren | NoChildrenTooltip | NoChildrenAriaLabel;

export type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/inputs-button--docs
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      'aria-label': ariaLabel,
      variant = 'primary',
      size = 'md',
      fill = 'solid',
      icon,
      fullWidth,
      children,
      className,
      style,
      type = 'button',
      tooltip,
      disabled,
      tooltipPlacement,
      iconPlacement = 'left',
      onClick,
      xstyle,
      ...otherProps
    },
    ref
  ) => {
    const theme = useTheme2();
    const hasTooltip = Boolean(tooltip);
    // With a tooltip the button stays focusable and uses aria-disabled, which keeps hover/focus styles (see ariaDisabled).
    const buttonProps = mergeStylexProps(
      stylex.props(
        getButtonStyles(theme, variant, fill, size, fullWidth),
        disabled && !hasTooltip && disabledStyles[fill],
        xstyle
      ),
      { className, style }
    );

    const iconComponent = icon && (
      <IconRenderer icon={icon} size={size} xstyle={!children && iconOnlyStyles[toButtonSize(size)]} />
    );

    // In order to standardise Button please always consider using IconButton when you need a button with an icon only
    // When using tooltip, ref is forwarded to Tooltip component instead for https://github.com/grafana/grafana/issues/65632
    const button = (
      <button
        {...buttonProps}
        type={type}
        onClick={disabled ? undefined : onClick}
        {...otherProps}
        // In order for the tooltip to be accessible when disabled,
        // we need to set aria-disabled instead of the native disabled attribute
        aria-disabled={hasTooltip && disabled}
        disabled={!hasTooltip && disabled}
        ref={tooltip ? undefined : ref}
        aria-label={ariaLabel ?? (!children && typeof tooltip === 'string' ? tooltip : undefined)}
      >
        {iconPlacement === 'left' && iconComponent}
        {children && <span {...stylex.props(styles.content)}>{children}</span>}
        {iconPlacement === 'right' && iconComponent}
      </button>
    );

    if (tooltip) {
      return (
        <Tooltip ref={ref} content={tooltip} placement={tooltipPlacement}>
          {button}
        </Tooltip>
      );
    }

    return button;
  }
);

Button.displayName = 'Button';

export type ButtonLinkProps = ButtonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'aria-label'>;

export const LinkButton = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      'aria-label': ariaLabel,
      variant = 'primary',
      size = 'md',
      fill = 'solid',
      icon,
      iconPlacement = 'left',
      fullWidth,
      children,
      className,
      style,
      onBlur,
      onFocus,
      disabled,
      tooltip,
      tooltipPlacement,
      xstyle,
      ...otherProps
    },
    ref
  ) => {
    const theme = useTheme2();
    // Links can't be :disabled; aria-disabled drives the disabled look (see ariaDisabled).
    const linkButtonProps = mergeStylexProps(
      stylex.props(getButtonStyles(theme, variant, fill, size, fullWidth), disabled && styles.linkDisabled, xstyle),
      { className, style }
    );

    const iconComponent = icon && (
      <IconRenderer icon={icon} size={size} xstyle={!children && iconOnlyStyles[toButtonSize(size)]} />
    );

    // When using tooltip, ref is forwarded to Tooltip component instead for https://github.com/grafana/grafana/issues/65632
    const button = (
      <a
        {...linkButtonProps}
        {...otherProps}
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        ref={tooltip ? undefined : ref}
        aria-label={ariaLabel ?? (!children && typeof tooltip === 'string' ? tooltip : undefined)}
      >
        {iconPlacement === 'left' && iconComponent}
        {children && <span {...stylex.props(styles.content)}>{children}</span>}
        {iconPlacement === 'right' && iconComponent}
      </a>
    );

    if (tooltip) {
      return (
        <Tooltip ref={ref} content={tooltip} placement={tooltipPlacement}>
          {button}
        </Tooltip>
      );
    }

    return button;
  }
);

LinkButton.displayName = 'LinkButton';

type IconElementProps = {
  className?: string;
  size?: IconSize;
};

interface IconRendererProps {
  icon?: IconName | React.ReactElement<IconElementProps>;
  size?: IconSize;
  className?: string;
  /** StyleX overrides for the icon, applied after `className`. */
  xstyle?: stylex.StyleXStyles;
  iconType?: IconType;
}
export const IconRenderer = ({ icon, size, className, xstyle, iconType }: IconRendererProps) => {
  if (!icon) {
    return null;
  }
  if (React.isValidElement(icon)) {
    return React.cloneElement(icon, {
      className: mergeStylexProps(stylex.props(xstyle), { className }).className,
      size,
    });
  }
  return <Icon name={icon} size={size} className={className} xstyle={xstyle} type={iconType} />;
};

// `xs` has no button size of its own and renders as `md`.
const toButtonSize = (size: ComponentSize) => (size === 'sm' || size === 'lg' ? size : 'md');

function getRichColor(theme: GrafanaTheme2, variant: ButtonVariant) {
  switch (variant) {
    case 'secondary':
      return theme.colors.secondary;
    case 'destructive':
      return theme.colors.error;
    case 'success':
      return theme.colors.success;
    case 'primary':
    default:
      return theme.colors.primary;
  }
}

/**
 * Border colours involve colour math (`emphasize`), so they're computed from the theme in JS and passed
 * as a dynamic style: [default, aria-disabled, hover, focus].
 */
function getBorderColors(
  theme: GrafanaTheme2,
  variant: ButtonVariant,
  fill: ButtonFill
): [string, string, string | null, string | null] {
  const color = getRichColor(theme, variant);
  if (fill === 'text') {
    return ['transparent', 'transparent', null, null];
  }
  if (fill === 'outline') {
    // Secondary lacks a token for "outline button border", so it uses border.strong.
    const border = variant === 'secondary' ? theme.colors.border.strong : color.border;
    const emphasized = theme.colors.emphasize(border, 0.25);
    return [border, theme.colors.border.weak, emphasized, emphasized];
  }
  if (variant === 'secondary') {
    return [color.border, 'transparent', theme.colors.emphasize(color.border, 0.25), null];
  }
  return ['transparent', 'transparent', 'transparent', null];
}

function getButtonStyles(
  theme: GrafanaTheme2,
  variant: ButtonVariant,
  fill: ButtonFill,
  size: ComponentSize,
  fullWidth: boolean | undefined
) {
  return [
    styles.button,
    sizeStyles[toButtonSize(size)],
    fillStyles[fill],
    fill === 'outline' ? outlineStyles[variant] : fill === 'text' ? textStyles[variant] : solidStyles[variant],
    styles.borderColor(...getBorderColors(theme, variant, fill)),
    fullWidth && styles.fullWidth,
  ];
}

// A disabled Button with a tooltip (and a disabled LinkButton) sets aria-disabled instead of `disabled`.
// Its disabled look sits below :hover/:focus/:active, so those states still apply on top of it. `:where` keeps it
// layered: main applied it as a toggled class, which a consumer's className beat.
const ariaDisabled = ':where([aria-disabled="true"])';
const focusRing = `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`;
const focusEasing = 'cubic-bezier(0.19, 1, 0.22, 1)';
const buttonHeight = (height: string) => `calc(${spacing['--gf-spacing-grid-size']} * ${height})`;

const styles = stylex.create({
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    fontFamily: typography['--gf-typography-font-family'],
    paddingTop: 0,
    paddingBottom: 0,
    verticalAlign: 'middle',
    cursor: { default: 'pointer', [ariaDisabled]: 'not-allowed' },
    borderRadius: shape['--gf-shape-radius-default'],
    borderWidth: '1px',
    borderStyle: 'solid',
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'background-color, border-color, color' },
  },
  borderColor: (base: string, ariaDisabledColor: string, hover: string | null, focus: string | null) => ({
    borderColor: { default: base, [ariaDisabled]: ariaDisabledColor, ':hover': hover, ':focus': focus },
  }),
  fullWidth: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  linkDisabled: {
    pointerEvents: 'none',
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    height: '100%',
  },
});

// Horizontal padding deducts the 1px border; line-height deducts both borders for vertical centering on Windows and Linux.
const sizeStyles = stylex.create({
  sm: {
    fontSize: typography['--gf-typography-size-sm'],
    height: buttonHeight(components['--gf-components-height-sm']),
    lineHeight: `calc(${buttonHeight(components['--gf-components-height-sm'])} - 2px)`,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} - 1px)`,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} - 1px)`,
  },
  md: {
    fontSize: typography['--gf-typography-size-md'],
    height: buttonHeight(components['--gf-components-height-md']),
    lineHeight: `calc(${buttonHeight(components['--gf-components-height-md'])} - 2px)`,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 2 - 1px)`,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 2 - 1px)`,
  },
  lg: {
    fontSize: typography['--gf-typography-size-lg'],
    height: buttonHeight(components['--gf-components-height-lg']),
    lineHeight: `calc(${buttonHeight(components['--gf-components-height-lg'])} - 2px)`,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 3 - 1px)`,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 3 - 1px)`,
  },
});

// Don't set margin-bottom here: it would override the icon's own bottom margin.
const iconOnlyStyles = stylex.create({
  sm: {
    marginRight: `calc(${spacing['--gf-spacing-grid-size']} * -0.5)`,
    marginLeft: `calc(${spacing['--gf-spacing-grid-size']} * -0.5)`,
  },
  md: {
    marginRight: `calc(${spacing['--gf-spacing-grid-size']} * -1)`,
    marginLeft: `calc(${spacing['--gf-spacing-grid-size']} * -1)`,
  },
  lg: {
    marginRight: `calc(${spacing['--gf-spacing-grid-size']} * -1.5)`,
    marginLeft: `calc(${spacing['--gf-spacing-grid-size']} * -1.5)`,
  },
});

// Focus behaviour differs by fill: solid shows the ring only for :focus-visible and adds a hover shadow;
// outline and text also apply the ring's transition on plain :focus, and text drops the outline on hover/focus.
// A mouse focus (:focus:not(:focus-visible)) always removes the ring, even while hovered.
const fillStyles = stylex.create({
  solid: {
    boxShadow: {
      default: null,
      ':focus-visible': focusRing,
      ':hover': shadows['--gf-shadows-z1'],
      ':focus': { default: null, ':not(:focus-visible)': 'none' },
    },
    outlineStyle: {
      default: null,
      ':focus-visible': 'dotted',
      ':focus': { default: null, ':not(:focus-visible)': 'none' },
    },
    outlineWidth: { default: null, ':focus-visible': '2px' },
    outlineColor: { default: null, ':focus-visible': 'transparent' },
    outlineOffset: { default: null, ':focus-visible': '2px' },
    transitionDuration: {
      default: null,
      [motion.noPreferenceOrReduce]: { default: durations.short, ':focus-visible': '0.2s' },
    },
    transitionTimingFunction: {
      default: null,
      [motion.noPreferenceOrReduce]: { default: easings.easeInOut, ':focus-visible': focusEasing },
    },
  },
  outline: {
    boxShadow: {
      default: null,
      ':focus-visible': focusRing,
      ':focus': { default: focusRing, ':not(:focus-visible)': 'none' },
    },
    outlineStyle: {
      default: null,
      ':focus-visible': 'dotted',
      ':focus': { default: 'dotted', ':not(:focus-visible)': 'none' },
    },
    outlineWidth: { default: null, ':focus-visible': '2px', ':focus': '2px' },
    outlineColor: { default: null, ':focus-visible': 'transparent', ':focus': 'transparent' },
    outlineOffset: { default: null, ':focus-visible': '2px', ':focus': '2px' },
    transitionDuration: {
      default: null,
      [motion.noPreferenceOrReduce]: { default: durations.short, ':focus': '0.2s' },
    },
    transitionTimingFunction: {
      default: null,
      [motion.noPreferenceOrReduce]: { default: easings.easeInOut, ':focus': focusEasing },
    },
  },
  text: {
    boxShadow: {
      default: null,
      ':focus-visible': focusRing,
      ':focus': { default: focusRing, ':not(:focus-visible)': 'none' },
    },
    outlineStyle: { default: null, ':hover': 'none', ':focus': 'none' },
    outlineOffset: { default: null, ':focus-visible': '2px', ':focus': '2px' },
    textDecoration: { default: null, ':hover': 'none', ':focus': 'none' },
    transitionDuration: {
      default: null,
      [motion.noPreferenceOrReduce]: { default: durations.short, ':focus': '0.2s' },
    },
    transitionTimingFunction: {
      default: null,
      [motion.noPreferenceOrReduce]: { default: easings.easeInOut, ':focus': focusEasing },
    },
  },
});

const solidStyles = stylex.create({
  primary: {
    backgroundColor: {
      default: colors['--gf-colors-primary-main'],
      [ariaDisabled]: colors['--gf-colors-action-disabled-background'],
      ':hover': colors['--gf-colors-primary-shade'],
      ':focus': colors['--gf-colors-primary-shade'],
      ':active': colors['--gf-colors-primary-main'],
    },
    color: {
      default: colors['--gf-colors-primary-contrast-text'],
      [ariaDisabled]: colors['--gf-colors-text-disabled'],
      ':hover': colors['--gf-colors-primary-contrast-text'],
      ':focus': colors['--gf-colors-primary-contrast-text'],
    },
  },
  secondary: {
    backgroundColor: {
      default: colors['--gf-colors-secondary-main'],
      [ariaDisabled]: colors['--gf-colors-action-disabled-background'],
      ':hover': colors['--gf-colors-secondary-shade'],
      ':focus': colors['--gf-colors-secondary-shade'],
      ':active': colors['--gf-colors-secondary-main'],
    },
    color: {
      default: colors['--gf-colors-secondary-contrast-text'],
      [ariaDisabled]: colors['--gf-colors-text-disabled'],
      ':hover': colors['--gf-colors-secondary-contrast-text'],
      ':focus': colors['--gf-colors-secondary-contrast-text'],
    },
  },
  destructive: {
    backgroundColor: {
      default: colors['--gf-colors-error-main'],
      [ariaDisabled]: colors['--gf-colors-action-disabled-background'],
      ':hover': colors['--gf-colors-error-shade'],
      ':focus': colors['--gf-colors-error-shade'],
      ':active': colors['--gf-colors-error-main'],
    },
    color: {
      default: colors['--gf-colors-error-contrast-text'],
      [ariaDisabled]: colors['--gf-colors-text-disabled'],
      ':hover': colors['--gf-colors-error-contrast-text'],
      ':focus': colors['--gf-colors-error-contrast-text'],
    },
  },
  success: {
    backgroundColor: {
      default: colors['--gf-colors-success-main'],
      [ariaDisabled]: colors['--gf-colors-action-disabled-background'],
      ':hover': colors['--gf-colors-success-shade'],
      ':focus': colors['--gf-colors-success-shade'],
      ':active': colors['--gf-colors-success-main'],
    },
    color: {
      default: colors['--gf-colors-success-contrast-text'],
      [ariaDisabled]: colors['--gf-colors-text-disabled'],
      ':hover': colors['--gf-colors-success-contrast-text'],
      ':focus': colors['--gf-colors-success-contrast-text'],
    },
  },
});

const outlineStyles = stylex.create({
  primary: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colors['--gf-colors-primary-transparent'],
      ':focus': colors['--gf-colors-primary-transparent'],
      ':active': 'transparent',
    },
    color: {
      default: colors['--gf-colors-primary-text'],
      [ariaDisabled]: colors['--gf-colors-text-disabled'],
      ':hover': colors['--gf-colors-primary-text'],
      ':focus': colors['--gf-colors-primary-text'],
    },
  },
  secondary: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colors['--gf-colors-secondary-transparent'],
      ':focus': colors['--gf-colors-secondary-transparent'],
      ':active': 'transparent',
    },
    color: {
      default: colors['--gf-colors-secondary-text'],
      [ariaDisabled]: colors['--gf-colors-text-disabled'],
      ':hover': colors['--gf-colors-secondary-text'],
      ':focus': colors['--gf-colors-secondary-text'],
    },
  },
  destructive: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colors['--gf-colors-error-transparent'],
      ':focus': colors['--gf-colors-error-transparent'],
      ':active': 'transparent',
    },
    color: {
      default: colors['--gf-colors-error-text'],
      [ariaDisabled]: colors['--gf-colors-text-disabled'],
      ':hover': colors['--gf-colors-error-text'],
      ':focus': colors['--gf-colors-error-text'],
    },
  },
  success: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colors['--gf-colors-success-transparent'],
      ':focus': colors['--gf-colors-success-transparent'],
      ':active': 'transparent',
    },
    color: {
      default: colors['--gf-colors-success-text'],
      [ariaDisabled]: colors['--gf-colors-text-disabled'],
      ':hover': colors['--gf-colors-success-text'],
      ':focus': colors['--gf-colors-success-text'],
    },
  },
});

const textStyles = stylex.create({
  primary: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colors['--gf-colors-primary-transparent'],
      ':focus': colors['--gf-colors-primary-transparent'],
      ':active': 'transparent',
    },
    color: { default: colors['--gf-colors-primary-text'], [ariaDisabled]: colors['--gf-colors-text-disabled'] },
  },
  secondary: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colors['--gf-colors-secondary-transparent'],
      ':focus': colors['--gf-colors-secondary-transparent'],
      ':active': 'transparent',
    },
    color: { default: colors['--gf-colors-secondary-text'], [ariaDisabled]: colors['--gf-colors-text-disabled'] },
  },
  destructive: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colors['--gf-colors-error-transparent'],
      ':focus': colors['--gf-colors-error-transparent'],
      ':active': 'transparent',
    },
    color: { default: colors['--gf-colors-error-text'], [ariaDisabled]: colors['--gf-colors-text-disabled'] },
  },
  success: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colors['--gf-colors-success-transparent'],
      ':focus': colors['--gf-colors-success-transparent'],
      ':active': 'transparent',
    },
    color: { default: colors['--gf-colors-success-text'], [ariaDisabled]: colors['--gf-colors-text-disabled'] },
  },
});

// A native :disabled button wins over every interaction state, so these replace the whole property. The values sit
// under `:disabled`, like main's `&:disabled` rule, so they also beat a consumer's className (scripts/stylex/stateRules.js).
const disabledStyles = stylex.create({
  solid: {
    cursor: { default: null, ':disabled': 'not-allowed' },
    boxShadow: { default: null, ':disabled': 'none' },
    color: { default: null, ':disabled': colors['--gf-colors-text-disabled'] },
    transitionProperty: { default: null, ':disabled': 'none' },
    backgroundColor: { default: null, ':disabled': colors['--gf-colors-action-disabled-background'] },
    borderColor: { default: null, ':disabled': 'transparent' },
  },
  outline: {
    cursor: { default: null, ':disabled': 'not-allowed' },
    boxShadow: { default: null, ':disabled': 'none' },
    color: { default: null, ':disabled': colors['--gf-colors-text-disabled'] },
    transitionProperty: { default: null, ':disabled': 'none' },
    backgroundColor: { default: null, ':disabled': 'transparent' },
    borderColor: { default: null, ':disabled': colors['--gf-colors-border-weak'] },
  },
  text: {
    cursor: { default: null, ':disabled': 'not-allowed' },
    boxShadow: { default: null, ':disabled': 'none' },
    color: { default: null, ':disabled': colors['--gf-colors-text-disabled'] },
    transitionProperty: { default: null, ':disabled': 'none' },
    backgroundColor: { default: null, ':disabled': 'transparent' },
    borderColor: { default: null, ':disabled': 'transparent' },
  },
});

/**
 * Button's StyleX styles, for first-party components that look like a Button without rendering one (FileUpload).
 *
 * @internal
 */
export { getButtonStyles as getButtonStylexStyles };
