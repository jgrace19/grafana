
import { subMenuStyleProps } from './SubMenu.stylex'

import { autoUpdate, useFloating } from '@floating-ui/react';
import { memo, type CSSProperties, type ReactElement } from 'react';

import { selectors } from '@grafana/e2e-selectors';

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
      <div {...subMenuStyleProps('iconWrapper')} aria-hidden data-testid={selectors.components.Menu.SubMenu.icon}>
        <Icon name="angle-right" {...subMenuStyleProps('icon')} />
      </div>
      {isOpen && (
        <div
          ref={refs.setFloating}
          {...subMenuStyleProps('subMenu')}
          data-testid={selectors.components.Menu.SubMenu.container}
          style={{
            ...floatingStyles,
            ...customStyle,
          }}
        >
          <div tabIndex={-1} {...subMenuStyleProps('itemsWrapper')} role="menu" onKeyDown={handleKeys}>
            {items}
          </div>
        </div>
      )}
    </>
  );
});

SubMenu.displayName = 'SubMenu';

/** @internal */
;
