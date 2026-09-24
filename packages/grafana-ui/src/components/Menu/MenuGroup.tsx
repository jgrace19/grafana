
import { menuGroupStyleProps } from './MenuGroup.stylex'

import { uniqueId } from 'lodash';
import * as React from 'react';



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
        <label id={labelID} {...menuGroupStyleProps('groupLabel')} aria-hidden>
          {label}
        </label>
      )}
      {children}
    </div>
  );
};
MenuGroup.displayName = 'MenuGroup';

/** @internal */
;
