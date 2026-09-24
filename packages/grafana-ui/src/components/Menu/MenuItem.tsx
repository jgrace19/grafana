import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import {
  type ReactElement,
  useCallback,
  useState,
  useRef,
  useImperativeHandle,
  type CSSProperties,
  type AriaRole,
} from 'react';
import * as React from 'react';

import { type LinkTarget } from '@grafana/data';
import { t } from '@grafana/i18n';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { mixins } from '../../themes/stylex/mixins';
import { colors, components, shape, spacing } from '../../themes/stylex/tokens.stylex';
import { type IconName } from '../../types/icon';
import { Icon } from '../Icon/Icon';
import { Stack } from '../Layout/Stack/Stack';
import { textVariantStyles } from '../Text/Text';

import './MenuItem.css';
import { SubMenu } from './SubMenu';

/** @internal */
export type MenuItemElement = HTMLAnchorElement & HTMLButtonElement & HTMLDivElement;

/** @internal */
export interface MenuItemProps<T = unknown> {
  /** Label of the menu item */
  label: string;
  /** Description of item */
  description?: string;
  /** Aria label for accessibility support */
  ariaLabel?: string;
  /** Aria checked for accessibility support */
  ariaChecked?: boolean;
  /** Target of the menu item (i.e. new window)  */
  target?: LinkTarget;
  /** Icon of the menu item */
  icon?: IconName;
  /** Role of the menu item */
  role?: AriaRole;
  /** Url of the menu item */
  url?: string;
  /** Handler for the click behaviour */
  onClick?: (event: React.MouseEvent<HTMLElement>, payload?: T) => void;
  /** Custom MenuItem styles*/
  className?: string;
  /** @internal first-party StyleX overrides, applied after the item's own styles */
  xstyle?: stylex.StyleXStyles;
  /** Active */
  active?: boolean;
  /** Disabled */
  disabled?: boolean;
  /** Show in destructive style (error color) */
  destructive?: boolean;
  tabIndex?: number;
  /** List of menu items for the subMenu */
  childItems?: Array<ReactElement<MenuItemProps>>;
  /** Custom style for SubMenu */
  customSubMenuContainerStyles?: CSSProperties;
  /** Shortcut key combination */
  shortcut?: string;
  /** Test id for e2e tests and fullstory*/
  testId?: string;
  /** CSS color for the icon. Ignored when `destructive` or `disabled` is true. */
  iconColor?: string;
  /* Optional component that will be shown together with other options. Does not get passed any props. */
  component?: React.ComponentType;
}

/** @internal */
export const MenuItem = React.memo(
  React.forwardRef<MenuItemElement, MenuItemProps>((props, ref) => {
    const {
      url,
      icon,
      label,
      description,
      ariaLabel,
      ariaChecked,
      target,
      onClick,
      className,
      xstyle,
      active,
      disabled,
      destructive,
      childItems,
      role,
      tabIndex = -1,
      customSubMenuContainerStyles,
      shortcut,
      testId,
      iconColor,
    } = props;
    // Ignore iconColor when destructive or disabled — those states own the colors.
    const resolvedIconColor = iconColor && !destructive && !disabled ? iconColor : undefined;
    const [isActive, setIsActive] = useState(active);
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const onMouseEnter = useCallback(() => {
      if (disabled) {
        return;
      }

      setIsSubMenuOpen(true);
      setIsActive(true);
    }, [disabled]);
    const onMouseLeave = useCallback(() => {
      if (disabled) {
        return;
      }

      setIsSubMenuOpen(false);
      setIsActive(false);
    }, [disabled]);

    const hasSubMenu = childItems && childItems.length > 0;
    const ItemElement = hasSubMenu ? 'div' : url === undefined ? 'button' : 'a';
    const tone = disabled ? 'disabled' : destructive ? 'destructive' : 'normal';
    const itemProps = mergeStylexProps(
      stylex.props(
        mixins.focusRing,
        styles.item,
        toneStyles[tone],
        isActive ? activeBackgroundStyles[tone] : backgroundStyles[tone],
        xstyle
      ),
      { className: clsx(tone === 'destructive' && 'gf-menu-item-destructive', className) }
    );

    const disabledProps = {
      [ItemElement === 'button' ? 'disabled' : 'aria-disabled']: disabled,
      ...(ItemElement === 'a' && disabled && { href: undefined, onClick: undefined }),
      ...(disabled && {
        tabIndex: -1,
        ['data-disabled']: disabled, // used to identify disabled items in Menu.tsx
      }),
    };

    const localRef = useRef<MenuItemElement>(null);
    useImperativeHandle(ref, () => localRef.current!);

    const handleKeys = (event: React.KeyboardEvent) => {
      switch (event.key) {
        case ' ':
          if (ItemElement === 'a' && url) {
            event.preventDefault();
            localRef.current?.click();
          }
          if (hasSubMenu && !isSubMenuOpen) {
            event.preventDefault();
            event.stopPropagation();
            setIsSubMenuOpen(true);
            setIsActive(true);
            return;
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          event.stopPropagation();
          if (hasSubMenu) {
            setIsSubMenuOpen(true);
            setIsActive(true);
          }
          break;
        case 'Enter':
          if (hasSubMenu && !isSubMenuOpen) {
            event.preventDefault();
            event.stopPropagation();
            setIsSubMenuOpen(true);
            setIsActive(true);
            return;
          }
          break;
        default:
          break;
      }
    };

    const closeSubMenu = () => {
      setIsSubMenuOpen(false);
      setIsActive(false);
      localRef?.current?.focus();
    };

    const hasShortcut = Boolean(shortcut && shortcut.length > 0);

    return (
      <ItemElement
        target={target}
        {...itemProps}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        href={url}
        onClick={(event) => {
          if (hasSubMenu && !isSubMenuOpen) {
            event.preventDefault();
            event.stopPropagation();
          }
          onClick?.(event);
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onKeyDown={handleKeys}
        // Default to menuitem for all items (links and buttons) so screen readers announce
        // position correctly (e.g. "X of Y") and the menu has proper ARIA semantics.
        // Callers can override via the role prop.
        role={role ?? 'menuitem'}
        data-role="menuitem" // used to identify menuitem in Menu.tsx
        ref={localRef}
        data-testid={testId}
        aria-label={ariaLabel}
        aria-checked={ariaChecked}
        tabIndex={tabIndex}
        {...disabledProps}
      >
        <Stack direction="row" justifyContent="flex-start" alignItems="center">
          {icon && (
            <Icon
              name={icon}
              xstyle={[styles.icon, resolvedIconColor !== undefined && styles.iconColor(resolvedIconColor)]}
              aria-hidden
            />
          )}
          <span {...stylex.props(styles.ellipsis, styles.label)}>{label}</span>
          <div {...stylex.props(styles.rightWrapper, hasShortcut && styles.withShortcut)}>
            {hasShortcut && (
              <div {...stylex.props(styles.shortcut)}>
                <Icon name="keyboard" title={t('grafana-ui.menu-item.keyboard-shortcut-label', 'Keyboard shortcut')} />
                {shortcut}
              </div>
            )}
            {hasSubMenu && (
              <SubMenu
                parentItemRef={localRef}
                items={childItems}
                isOpen={isSubMenuOpen}
                close={closeSubMenu}
                customStyle={customSubMenuContainerStyles}
              />
            )}
          </div>
        </Stack>
        {description && (
          <div
            {...stylex.props(
              textVariantStyles.bodySmall,
              styles.description,
              styles.ellipsis,
              icon !== undefined && styles.descriptionWithIcon
            )}
          >
            {description}
          </div>
        )}
        {props.component ? <props.component /> : null}
      </ItemElement>
    );
  })
);

MenuItem.displayName = 'MenuItem';

const styles = stylex.create({
  item: {
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x1-5'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1-5'],
    minHeight: spacing['--gf-spacing-x4'],
    // getInternalRadius(theme, menu padding, { parentBorderWidth: 0 })
    borderRadius: `calc(max(0px, ${shape['--gf-shape-radius-default']} - ${components['--gf-components-menu-padding']} * ${spacing['--gf-spacing-grid-size']}))`,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    borderStyle: 'none',
    width: '100%',
    position: 'relative',
    textDecoration: { default: null, ':hover': 'none', ':focus-visible': 'none' },
  },
  label: {
    color: colors['--gf-colors-text-primary'],
  },
  icon: {
    opacity: 0.7,
  },
  iconColor: (color: string) => ({ color }),
  rightWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  withShortcut: {
    minWidth: `calc(${spacing['--gf-spacing-grid-size']} * 10.5)`,
  },
  shortcut: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    marginLeft: spacing['--gf-spacing-x2'],
  },
  description: {
    textAlign: 'start',
  },
  descriptionWithIcon: {
    marginLeft: spacing['--gf-spacing-x3'],
  },
  ellipsis: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

// Disabled and destructive states win over hover/focus, and destructive also restyles on mouse focus.
const toneStyles = stylex.create({
  normal: {
    color: {
      default: colors['--gf-colors-text-secondary'],
      ':hover': colors['--gf-colors-text-primary'],
      ':focus-visible': colors['--gf-colors-text-primary'],
    },
  },
  disabled: {
    color: colors['--gf-colors-action-disabled-text'],
    cursor: { default: 'pointer', ':hover': 'not-allowed', ':focus': 'not-allowed', ':focus-visible': 'not-allowed' },
  },
  destructive: {
    color: {
      default: colors['--gf-colors-error-text'],
      ':hover': colors['--gf-colors-error-contrast-text'],
      ':focus': colors['--gf-colors-error-contrast-text'],
      ':focus-visible': colors['--gf-colors-error-contrast-text'],
    },
  },
});

const backgroundStyles = stylex.create({
  normal: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colors['--gf-colors-action-hover'],
      ':focus-visible': colors['--gf-colors-action-hover'],
    },
  },
  disabled: {
    backgroundColor: 'transparent',
  },
  destructive: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colors['--gf-colors-error-main'],
      ':focus': colors['--gf-colors-error-main'],
      ':focus-visible': colors['--gf-colors-error-main'],
    },
  },
});

const activeBackgroundStyles = stylex.create({
  normal: {
    backgroundColor: colors['--gf-colors-action-hover'],
  },
  disabled: {
    backgroundColor: {
      default: colors['--gf-colors-action-hover'],
      ':hover': 'transparent',
      ':focus': 'transparent',
      ':focus-visible': 'transparent',
    },
  },
  destructive: {
    backgroundColor: {
      default: colors['--gf-colors-action-hover'],
      ':hover': colors['--gf-colors-error-main'],
      ':focus': colors['--gf-colors-error-main'],
      ':focus-visible': colors['--gf-colors-error-main'],
    },
  },
});
