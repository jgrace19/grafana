import * as stylex from '@stylexjs/stylex';
import { useImperativeHandle, useRef } from 'react';
import * as React from 'react';

import { useTheme2 } from '../../themes/ThemeContext';
import { colors, spacing } from '../../themes/stylex/tokens.stylex';
import { Box } from '../Layout/Box/Box';

import { MenuDivider } from './MenuDivider';
import { MenuGroup } from './MenuGroup';
import { MenuItem } from './MenuItem';
import { useMenuFocus } from './hooks';

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  /** React element rendered at the top of the menu */
  header?: React.ReactNode;
  children: React.ReactNode;
  ariaLabel?: string;
  onOpen?: (focusOnItem: (itemId: number) => void) => void;
  onClose?: () => void;
  onKeyDown?: React.KeyboardEventHandler;
}

/**
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/overlays-menu--docs
 */
const MenuComp = React.forwardRef<HTMLDivElement, MenuProps>(
  ({ header, children, ariaLabel, onOpen, onClose, onKeyDown, ...otherProps }, forwardedRef) => {
    const componentTokens = useTheme2().components.menu;

    const localRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardedRef, () => localRef.current!);

    const [handleKeys] = useMenuFocus({ isMenuOpen: true, localRef, onOpen, onClose, onKeyDown });

    return (
      <Box
        {...otherProps}
        aria-label={ariaLabel}
        backgroundColor="elevated"
        borderRadius={componentTokens.borderRadius}
        boxShadow="z3"
        display="inline-block"
        onKeyDown={handleKeys}
        padding={componentTokens.padding}
        ref={localRef}
        role="menu"
        tabIndex={-1}
      >
        {header && (
          <div
            {...stylex.props(
              styles.header,
              Boolean(children) && React.Children.toArray(children).length > 0 && styles.headerBorder
            )}
          >
            {header}
          </div>
        )}
        {children}
      </Box>
    );
  }
);

MenuComp.displayName = 'Menu';

export const Menu = Object.assign(MenuComp, {
  Item: MenuItem,
  Divider: MenuDivider,
  Group: MenuGroup,
});

const styles = stylex.create({
  header: {
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x0-5'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x0-5'],
  },
  headerBorder: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
    marginBottom: spacing['--gf-spacing-x0-5'],
  },
});
