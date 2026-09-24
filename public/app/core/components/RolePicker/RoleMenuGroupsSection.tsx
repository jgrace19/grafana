import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { rolePickerStyles } from './stylesStyles.stylex';
import { forwardRef, useCallback, useState } from 'react';

import { getSelectStyles, useTheme2 } from '@grafana/ui';
import { isNotDelegatable } from 'app/core/utils/roles';
import { type Role } from 'app/types/accessControl';

import { RoleMenuGroupOption } from './RoleMenuGroupOption';
import { RoleMenuOption } from './RoleMenuOption';
import { RolePickerSubMenu } from './RolePickerSubMenu';

interface RoleMenuGroupsSectionProps {
  roles: Role[];
  isFiltered?: boolean;
  renderedName: string;
  showGroups?: boolean;
  optionGroups: Array<{
    name: string;
    options: Role[];
    value: string;
  }>;
  onGroupChange: (value: string) => void;
  groupSelected: (group: string) => boolean;
  groupPartiallySelected: (group: string) => boolean;
  disabled?: boolean;
  subMenuNode?: HTMLDivElement;
  selectedOptions: Role[];
  onRoleChange: (option: Role) => void;
  onClearSubMenu: (group: string) => void;
  showOnLeftSubMenu?: boolean;
}

export const RoleMenuGroupsSection = forwardRef<HTMLDivElement, RoleMenuGroupsSectionProps>(
  (
    {
      roles,
      isFiltered,
      renderedName,
      showGroups,
      optionGroups,
      onGroupChange,
      groupSelected,
      groupPartiallySelected,
      subMenuNode,
      selectedOptions,
      onRoleChange,
      onClearSubMenu,
      showOnLeftSubMenu,
    },
    _ref
  ) => {
    const [showSubMenu, setShowSubMenu] = useState(false);
    const [openedMenuGroup, setOpenedMenuGroup] = useState('');

    const theme = useTheme2();
    const selectStyles = getSelectStyles(theme);

    const onOpenSubMenu = useCallback((value: string) => {
      setOpenedMenuGroup(value);
      setShowSubMenu(true);
    }, []);

    const onCloseSubMenu = useCallback(() => {
      setShowSubMenu(false);
      setOpenedMenuGroup('');
    }, []);

    return (
      <div>
        {roles.length > 0 && (
          <div className={stylesStyles.menuSection}>
            <div className={stylesStyles.groupHeader}>{renderedName}</div>
            <div className={selectStyles.optionBody}></div>
            {showGroups && !!optionGroups?.length
              ? optionGroups.map((groupOption) => (
                  <RoleMenuGroupOption
                    key={groupOption.value}
                    name={groupOption.name}
                    value={groupOption.value}
                    isSelected={groupSelected(groupOption.value) || groupPartiallySelected(groupOption.value)}
                    partiallySelected={groupPartiallySelected(groupOption.value)}
                    disabled={groupOption.options?.every(
                      (option) =>
                        isNotDelegatable(option) || selectedOptions.find((opt) => opt.uid === option.uid && opt.mapped)
                    )}
                    onChange={onGroupChange}
                    onOpenSubMenu={onOpenSubMenu}
                    onCloseSubMenu={onCloseSubMenu}
                    root={subMenuNode}
                    isFocused={showSubMenu && openedMenuGroup === groupOption.value}
                  >
                    {showSubMenu && openedMenuGroup === groupOption.value && (
                      <RolePickerSubMenu
                        options={groupOption.options}
                        selectedOptions={selectedOptions}
                        onSelect={onRoleChange}
                        onClear={() => onClearSubMenu(openedMenuGroup)}
                        showOnLeft={showOnLeftSubMenu}
                      />
                    )}
                  </RoleMenuGroupOption>
                ))
              : roles.map((option) => (
                  <RoleMenuOption
                    useFilteredDisplayName={isFiltered}
                    data={option}
                    key={option.uid}
                    isSelected={!!(option.uid && !!selectedOptions.find((opt) => opt.uid === option.uid))}
                    disabled={isNotDelegatable(option)}
                    mapped={!!(option.uid && selectedOptions.find((opt) => opt.uid === option.uid && opt.mapped))}
                    onChange={onRoleChange}
                    hideDescription
                  />
                ))}
          </div>
        )}
      </div>
    );
  }
);

RoleMenuGroupsSection.displayName = 'RoleMenuGroupsSection';
