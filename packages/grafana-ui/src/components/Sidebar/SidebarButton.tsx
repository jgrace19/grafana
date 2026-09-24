import * as stylex from '@stylexjs/stylex';
import React, { type ButtonHTMLAttributes } from 'react';

import { type IconName, isIconName } from '@grafana/data';

import { useTheme2 } from '../../themes/ThemeContext';
import { durations, easings, motion } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, components, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { type ButtonVariant } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Tooltip } from '../Tooltip/Tooltip';

import { useSidebarContext } from './useSidebar';

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  active?: boolean;
  tooltip?: string;
  title: string;
  variant?: ButtonVariant;
}

export const SidebarButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ icon, active, onClick, title, tooltip, variant, ...restProps }, ref) => {
    const theme = useTheme2();
    const sidebarContext = useSidebarContext();

    if (!sidebarContext) {
      throw new Error('Sidebar.Button must be used within a Sidebar component');
    }

    const isPrimary = variant === 'primary';

    return (
      <Tooltip ref={ref} content={tooltip ?? title} placement={sidebarContext.position === 'left' ? 'right' : 'left'}>
        <button
          {...stylex.props(styles.button, sidebarContext.compact && styles.compact)}
          aria-label={title}
          aria-expanded={active}
          type="button"
          onClick={onClick}
          {...restProps}
        >
          <div
            {...mergeStylexProps(
              stylex.props(
                styles.iconWrapper,
                active && styles.iconActive,
                isPrimary && styles.primary,
                isPrimary && styles.primaryColor(theme.colors.getContrastText(theme.colors.primary.main))
              ),
              { className: variant }
            )}
          >
            {renderIcon(icon, active)}
          </div>
          {!sidebarContext.compact && <div {...stylex.props(styles.title, active && styles.titleActive)}>{title}</div>}
        </button>
      </Tooltip>
    );
  }
);

SidebarButton.displayName = 'SidebarButton';

function renderIcon(icon: IconName | React.ReactNode, active?: boolean) {
  if (!icon) {
    return null;
  }

  if (isIconName(icon)) {
    return <Icon name={icon} size="lg" xstyle={active && styles.iconTransition} />;
  }

  return icon;
}

const grid = spacing['--gf-spacing-grid-size'];
const focusRing = `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`;

// Any focus shows the ring above its siblings; a mouse focus (:focus:not(:focus-visible)) removes the ring again.
const styles = stylex.create({
  button: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: `calc(${grid} * ${components['--gf-components-height-sm']})`,
    paddingTop: 0,
    paddingRight: grid,
    paddingBottom: 0,
    paddingLeft: grid,
    width: '100%',
    overflow: 'hidden',
    lineHeight: `calc(${components['--gf-components-height-sm']} * ${grid} - 2px)`,
    fontWeight: typography['--gf-typography-font-weight-medium'],
    color: colors['--gf-colors-text-secondary'],
    backgroundColor: 'transparent',
    borderStyle: 'none',
    zIndex: { default: null, ':focus': 1 },
    outlineStyle: { default: null, ':focus': { default: 'dotted', ':not(:focus-visible)': 'none' } },
    outlineWidth: { default: null, ':focus': '2px' },
    outlineColor: { default: null, ':focus': 'transparent' },
    outlineOffset: { default: null, ':focus': '2px' },
    boxShadow: { default: null, ':focus': { default: focusRing, ':not(:focus-visible)': 'none' } },
    transitionProperty: { default: null, ':focus': 'outline, outline-offset, box-shadow' },
    transitionDuration: { default: null, ':focus': { default: null, [motion.noPreferenceOrReduce]: '0.2s' } },
    transitionTimingFunction: {
      default: null,
      ':focus': { default: null, [motion.noPreferenceOrReduce]: 'cubic-bezier(0.19, 1, 0.22, 1)' },
    },
    cursor: { default: null, ':disabled': 'not-allowed' },
    opacity: { default: null, ':disabled': colors['--gf-colors-action-disabled-opacity'] },
  },
  compact: {
    width: `calc(${grid} * 5)`,
  },
  iconWrapper: {
    paddingTop: '3px',
    paddingRight: '3px',
    paddingBottom: '3px',
    paddingLeft: '3px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'relative',
    borderRadius: shape['--gf-shape-radius-sm'],
    backgroundColor: {
      default: null,
      ':hover': colors['--gf-colors-action-hover'],
      ':focus-visible': colors['--gf-colors-action-hover'],
    },
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'background-color, color' },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: durations.short },
    transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: easings.easeInOut },
    transitionDelay: { default: null, [motion.noPreferenceOrReduce]: '0ms' },
  },
  iconActive: {
    color: colors['--gf-colors-text-primary'],
    backgroundColor: {
      default: colors['--gf-colors-secondary-main'],
      ':hover': colors['--gf-colors-action-hover'],
      ':focus-visible': colors['--gf-colors-action-hover'],
    },
    '::before': {
      display: 'block',
      content: '" "',
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: '100%',
      height: '2px',
      borderBottomLeftRadius: shape['--gf-shape-radius-sm'],
      borderBottomRightRadius: shape['--gf-shape-radius-sm'],
      backgroundImage: colors['--gf-colors-gradients-brand-horizontal'],
      transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'background-color, color' },
      transitionDuration: { default: null, [motion.noPreferenceOrReduce]: durations.short },
      transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: easings.easeInOut },
      transitionDelay: { default: null, [motion.noPreferenceOrReduce]: '0ms' },
    },
  },
  // The Emotion `&.primary` rule outranked the active background, but not its own hover.
  primary: {
    backgroundColor: { default: colors['--gf-colors-primary-main'], ':hover': colors['--gf-colors-primary-shade'] },
  },
  primaryColor: (color: string) => ({ color }),
  iconTransition: {
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'background-color, color' },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: durations.short },
    transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: easings.easeInOut },
    transitionDelay: { default: null, [motion.noPreferenceOrReduce]: '0ms' },
  },
  title: {
    fontSize: typography['--gf-typography-body-small-font-size'],
    color: colors['--gf-colors-text-secondary'],
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  titleActive: {
    color: colors['--gf-colors-text-primary'],
  },
});
