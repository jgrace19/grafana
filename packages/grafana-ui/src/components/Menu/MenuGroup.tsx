import * as stylex from '@stylexjs/stylex';
import { uniqueId } from 'lodash';
import * as React from 'react';

import { colors, spacing, typography } from '../../themes/stylex/tokens.stylex';

import { type MenuItemProps } from './MenuItem';

/** @internal */
export interface MenuItemsGroup<T = unknown> {
  /** Label for the menu items group */
  label?: string;
  /** Aria label for accessibility support */
  ariaLabel?: string;
  /** Items of the group */
  items: Array<MenuItemProps<T>>;
}

/** @internal */
export interface MenuGroupProps extends Partial<MenuItemsGroup> {
  /** special children prop to pass children elements */
  children: React.ReactNode;
}

/** @internal */
export const MenuGroup = ({ label, ariaLabel, children }: MenuGroupProps) => {
  const labelID = `group-label-${uniqueId()}`;

  return (
    <div role="group" aria-labelledby={!ariaLabel && label ? labelID : undefined} aria-label={ariaLabel}>
      {label && (
        <label id={labelID} {...stylex.props(styles.groupLabel)} aria-hidden>
          {label}
        </label>
      )}
      {children}
    </div>
  );
};
MenuGroup.displayName = 'MenuGroup';

const styles = stylex.create({
  groupLabel: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-size-sm'],
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1'],
  },
});
