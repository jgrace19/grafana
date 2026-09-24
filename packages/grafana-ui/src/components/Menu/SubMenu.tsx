import { autoUpdate, useFloating } from '@floating-ui/react';
import * as stylex from '@stylexjs/stylex';
import { memo, type CSSProperties, type ReactElement } from 'react';

import { selectors } from '@grafana/e2e-selectors';

import { zIndex } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, shadows, shape, spacing } from '../../themes/stylex/tokens.stylex';
import { getPositioningMiddleware } from '../../utils/floating';
import { Icon } from '../Icon/Icon';

import { type MenuItemProps } from './MenuItem';
import { useMenuFocus } from './hooks';

/** @internal */
export interface SubMenuProps {
  parentItemRef: React.RefObject<HTMLElement | null>;
  /** List of menu items of the subMenu */
  items?: Array<ReactElement<MenuItemProps>>;
  /** Open */
  isOpen: boolean;
  /** Closes the subMenu */
  close: () => void;
  /** Custom style */
  customStyle?: CSSProperties;
}

const SUBMENU_POSITION = 'right-start';

/** @internal */
export const SubMenu = memo(({ parentItemRef, items, isOpen, close, customStyle }: SubMenuProps) => {
  // the order of middleware is important!
  const middleware = [...getPositioningMiddleware(SUBMENU_POSITION)];

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    placement: SUBMENU_POSITION,
    middleware,
    whileElementsMounted: autoUpdate,
    elements: {
      reference: parentItemRef.current,
    },
  });

  const [handleKeys] = useMenuFocus({
    localRef: refs.floating,
    isMenuOpen: isOpen,
    close,
  });

  return (
    <>
      <div {...stylex.props(styles.iconWrapper)} aria-hidden data-testid={selectors.components.Menu.SubMenu.icon}>
        <Icon name="angle-right" xstyle={styles.icon} />
      </div>
      {isOpen && (
        <div
          ref={refs.setFloating}
          {...mergeStylexProps(stylex.props(styles.subMenu), { style: { ...floatingStyles, ...customStyle } })}
          data-testid={selectors.components.Menu.SubMenu.container}
        >
          <div tabIndex={-1} {...stylex.props(styles.itemsWrapper)} role="menu" onKeyDown={handleKeys}>
            {items}
          </div>
        </div>
      )}
    </>
  );
});

SubMenu.displayName = 'SubMenu';

const styles = stylex.create({
  iconWrapper: {
    display: 'flex',
    flex: '1',
    justifyContent: 'end',
  },
  icon: {
    opacity: 0.7,
    marginLeft: spacing['--gf-spacing-x1'],
    color: colors['--gf-colors-text-secondary'],
  },
  itemsWrapper: {
    backgroundColor: colors['--gf-colors-background-elevated'],
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x0-5'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x0-5'],
    boxShadow: shadows['--gf-shadows-z3'],
    display: 'inline-block',
    borderRadius: shape['--gf-shape-radius-default'],
  },
  subMenu: {
    zIndex: zIndex.dropdown,
  },
});
