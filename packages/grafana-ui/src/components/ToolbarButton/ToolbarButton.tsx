import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import * as React from 'react';

import { type IconName, isIconName } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';

import { durations, easings, motion } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, components, shadows, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { type IconSize } from '../../types/icon';
import { Icon } from '../Icon/Icon';
import { Tooltip } from '../Tooltip/Tooltip';

import './ToolbarButton.css';

interface BaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon name */
  icon?: IconName | React.ReactNode;
  /** Icon size */
  iconSize?: IconSize;
  /** Tooltip */
  tooltip?: string;
  /** For image icons */
  imgSrc?: string;
  /** Alt text for imgSrc */
  imgAlt?: string;
  /** if true or false will show angle-down/up */
  isOpen?: boolean;
  /** Controls flex-grow: 1 */
  fullWidth?: boolean;
  /** reduces padding to xs */
  narrow?: boolean;
  /** variant */
  variant?: ToolbarButtonVariant;
  /** Hide any children and only show icon */
  iconOnly?: boolean;
  /** Show highlight dot */
  isHighlighted?: boolean;
  /** @internal first-party StyleX overrides, applied last */
  xstyle?: stylex.StyleXStyles;
  /** @internal first-party StyleX overrides for the `imgSrc` image */
  imgXstyle?: stylex.StyleXStyles;
}

interface BasePropsWithChildren extends BaseProps {
  children: ReactNode;
}

interface BasePropsWithTooltip extends BaseProps {
  tooltip: string;
}

interface BasePropsWithAriaLabel extends BaseProps {
  ['aria-label']: string;
}

export type ToolbarButtonProps = BasePropsWithChildren | BasePropsWithTooltip | BasePropsWithAriaLabel;

export type ToolbarButtonVariant = 'default' | 'primary' | 'destructive' | 'active' | 'canvas';

/**
 * Multiple buttons that form a toolbar. Each button can contain an icon, image and text. There are three variants of the ToolbarButton: default, primary and destructive.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/navigation-toolbarbutton--docs
 */
export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>((props, ref) => {
  const {
    tooltip,
    icon,
    iconSize,
    className,
    children,
    imgSrc,
    imgAlt,
    fullWidth,
    isOpen,
    narrow,
    variant = 'default',
    iconOnly,
    'aria-label': ariaLabel,
    isHighlighted,
    xstyle,
    imgXstyle,
    style,
    ...rest
  } = props;

  const buttonProps = mergeStylexProps(
    stylex.props(
      styles.button,
      fullWidth && styles.buttonFullWidth,
      narrow && styles.narrow,
      variantStyles[variant],
      variant === 'active' && styles.activeIndicator,
      xstyle
    ),
    { className: clsx('gf-toolbar-button', className), style }
  );

  const body = (
    <button
      ref={ref}
      {...buttonProps}
      aria-label={getButtonAriaLabel(ariaLabel, tooltip)}
      aria-expanded={isOpen}
      type="button"
      {...rest}
    >
      {renderIcon(icon, iconSize)}
      {imgSrc && <img {...stylex.props(styles.img, imgXstyle)} src={imgSrc} alt={imgAlt ?? ''} />}
      {children && !iconOnly && (
        <div
          {...stylex.props(
            styles.content,
            !!icon && styles.contentWithIcon,
            isOpen !== undefined && styles.contentWithRightIcon
          )}
        >
          {children}
        </div>
      )}
      {isOpen === false && <Icon name="angle-down" />}
      {isOpen === true && <Icon name="angle-up" />}
      {isHighlighted && <div {...stylex.props(styles.highlight)} />}
    </button>
  );

  return tooltip ? (
    <Tooltip ref={ref} content={tooltip} placement="bottom">
      {body}
    </Tooltip>
  ) : (
    body
  );
});

ToolbarButton.displayName = 'ToolbarButton';

function getButtonAriaLabel(ariaLabel: string | undefined, tooltip: string | undefined) {
  return ariaLabel ? ariaLabel : tooltip ? selectors.components.PageToolbar.item(tooltip) : undefined;
}

function renderIcon(icon: IconName | React.ReactNode, iconSize?: IconSize) {
  if (!icon) {
    return null;
  }

  if (isIconName(icon)) {
    return <Icon name={icon} size={`${iconSize ? iconSize : 'lg'}`} />;
  }

  return icon;
}

const grid = spacing['--gf-spacing-grid-size'];
const focusRing = `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`;

const styles = stylex.create({
  button: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: `calc(${grid} * ${components['--gf-components-height-md']})`,
    paddingTop: 0,
    paddingRight: grid,
    paddingBottom: 0,
    paddingLeft: grid,
    borderRadius: shape['--gf-shape-radius-default'],
    lineHeight: `calc(${components['--gf-components-height-md']} * ${grid} - 2px)`,
    fontWeight: typography['--gf-typography-font-weight-medium'],
    borderWidth: '1px',
    borderStyle: 'solid',
    whiteSpace: 'nowrap',
    // Any focus shows the ring above its siblings; a mouse focus (:focus:not(:focus-visible)) removes it again.
    zIndex: { default: null, ':focus': 1 },
    outlineStyle: { default: null, ':focus': { default: 'dotted', ':not(:focus-visible)': 'none' } },
    outlineWidth: { default: null, ':focus': '2px' },
    outlineColor: { default: null, ':focus': 'transparent' },
    outlineOffset: { default: null, ':focus': '2px' },
    transitionProperty: {
      default: null,
      [motion.noPreferenceOrReduce]: {
        default: 'background-color, border-color, color',
        ':focus': 'outline, outline-offset, box-shadow',
      },
    },
    transitionDuration: {
      default: null,
      [motion.noPreferenceOrReduce]: { default: durations.short, ':focus': '0.2s' },
    },
    transitionTimingFunction: {
      default: null,
      [motion.noPreferenceOrReduce]: { default: easings.easeInOut, ':focus': 'cubic-bezier(0.19, 1, 0.22, 1)' },
    },
    transitionDelay: { default: null, [motion.noPreferenceOrReduce]: '0ms' },
    cursor: { default: null, ':disabled': 'not-allowed' },
    opacity: { default: null, ':disabled': colors['--gf-colors-action-disabled-opacity'] },
  },
  activeIndicator: {
    '::before': {
      display: 'block',
      content: '" "',
      position: 'absolute',
      left: 0,
      right: 0,
      height: '2px',
      bottom: 0,
      borderRadius: shape['--gf-shape-radius-default'],
      backgroundImage: colors['--gf-colors-gradients-brand-horizontal'],
    },
  },
  narrow: {
    paddingRight: `calc(${grid} * 0.5)`,
    paddingLeft: `calc(${grid} * 0.5)`,
  },
  img: {
    width: '16px',
    height: '16px',
    marginRight: grid,
  },
  buttonFullWidth: {
    flexGrow: 1,
  },
  content: {
    display: 'flex',
    flexGrow: 1,
  },
  contentWithIcon: {
    display: { default: 'none', '@media only screen and (min-width: 769px)': 'block' },
    paddingLeft: grid,
  },
  contentWithRightIcon: {
    paddingRight: `calc(${grid} * 0.5)`,
  },
  highlight: {
    backgroundColor: colors['--gf-colors-success-main'],
    borderRadius: shape['--gf-shape-radius-circle'],
    width: '6px',
    height: '6px',
    position: 'absolute',
    top: '-3px',
    right: '-3px',
    zIndex: 1,
  },
});

// Each variant writes every state of the properties it shares with the others, so one namespace fully
// decides them. A disabled button keeps the variant's colour until hovered; its background and shadow always
// switch (the old `&[disabled]` rules). The primary and destructive hover shadow beats the keyboard focus
// ring, as the variant's `&:hover` rule came after the base `&:focus` rule.
const variantStyles = stylex.create({
  default: {
    color: {
      default: colors['--gf-colors-text-secondary'],
      ':hover': { default: colors['--gf-colors-text-primary'], ':disabled': colors['--gf-colors-text-disabled'] },
    },
    backgroundColor: {
      default: 'transparent',
      ':disabled': colors['--gf-colors-action-disabled-background'],
      ':hover': {
        default: colors['--gf-colors-action-hover'],
        ':disabled': colors['--gf-colors-action-disabled-background'],
      },
      ':active': colors['--gf-colors-secondary-main'],
    },
    borderColor: 'transparent',
    boxShadow: {
      default: null,
      ':disabled': 'none',
      ':focus': { default: focusRing, ':not(:focus-visible)': 'none' },
    },
  },
  canvas: {
    color: {
      default: colors['--gf-colors-text-primary'],
      ':hover': { default: colors['--gf-colors-text-primary'], ':disabled': colors['--gf-colors-text-disabled'] },
    },
    backgroundColor: {
      default: colors['--gf-colors-secondary-main'],
      ':disabled': colors['--gf-colors-action-disabled-background'],
      ':hover': {
        default: colors['--gf-colors-secondary-shade'],
        ':disabled': colors['--gf-colors-action-disabled-background'],
      },
      ':focus': colors['--gf-colors-secondary-shade'],
      ':active': colors['--gf-colors-secondary-main'],
    },
    borderColor: {
      default: colors['--gf-colors-secondary-border'],
      ':hover': colors['--gf-colors-border-medium'],
      ':focus': colors['--gf-colors-border-medium'],
    },
    boxShadow: {
      default: null,
      ':disabled': 'none',
      ':focus': { default: focusRing, ':not(:focus-visible)': 'none' },
    },
  },
  active: {
    color: {
      default: colors['--gf-colors-text-primary'],
      ':hover': { default: colors['--gf-colors-text-primary'], ':disabled': colors['--gf-colors-text-disabled'] },
    },
    backgroundColor: {
      default: colors['--gf-colors-secondary-main'],
      ':disabled': colors['--gf-colors-action-disabled-background'],
      ':hover': {
        default: colors['--gf-colors-secondary-shade'],
        ':disabled': colors['--gf-colors-action-disabled-background'],
      },
      ':focus': colors['--gf-colors-secondary-shade'],
      ':active': colors['--gf-colors-secondary-main'],
    },
    borderColor: {
      default: colors['--gf-colors-secondary-border'],
      ':hover': colors['--gf-colors-border-medium'],
      ':focus': colors['--gf-colors-border-medium'],
    },
    boxShadow: {
      default: null,
      ':disabled': 'none',
      ':focus': { default: focusRing, ':not(:focus-visible)': 'none' },
    },
  },
  primary: {
    color: {
      default: colors['--gf-colors-primary-contrast-text'],
      ':hover': {
        default: colors['--gf-colors-primary-contrast-text'],
        ':disabled': colors['--gf-colors-text-disabled'],
      },
    },
    backgroundColor: {
      default: colors['--gf-colors-primary-main'],
      ':disabled': colors['--gf-colors-action-disabled-background'],
      ':hover': {
        default: colors['--gf-colors-primary-shade'],
        ':disabled': colors['--gf-colors-action-disabled-background'],
      },
      ':focus': colors['--gf-colors-primary-shade'],
      ':active': colors['--gf-colors-primary-main'],
    },
    borderColor: 'transparent',
    boxShadow: {
      default: null,
      ':disabled': 'none',
      ':hover': { default: shadows['--gf-shadows-z1'], ':disabled': 'none' },
      ':focus': {
        default: focusRing,
        ':hover': { default: shadows['--gf-shadows-z1'], ':not(:focus-visible)': 'none' },
        ':not(:focus-visible)': 'none',
      },
    },
  },
  destructive: {
    color: {
      default: colors['--gf-colors-error-contrast-text'],
      ':hover': {
        default: colors['--gf-colors-error-contrast-text'],
        ':disabled': colors['--gf-colors-text-disabled'],
      },
    },
    backgroundColor: {
      default: colors['--gf-colors-error-main'],
      ':disabled': colors['--gf-colors-action-disabled-background'],
      ':hover': {
        default: colors['--gf-colors-error-shade'],
        ':disabled': colors['--gf-colors-action-disabled-background'],
      },
      ':focus': colors['--gf-colors-error-shade'],
      ':active': colors['--gf-colors-error-main'],
    },
    borderColor: 'transparent',
    boxShadow: {
      default: null,
      ':disabled': 'none',
      ':hover': { default: shadows['--gf-shadows-z1'], ':disabled': 'none' },
      ':focus': {
        default: focusRing,
        ':hover': { default: shadows['--gf-shadows-z1'], ':not(:focus-visible)': 'none' },
        ':not(:focus-visible)': 'none',
      },
    },
  },
});
