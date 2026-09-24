import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { rolePickerStyles } from './stylesStyles.stylex';
import { type FormEvent, memo } from 'react';
import * as React from 'react';

import { t } from '@grafana/i18n';
import { Checkbox, Portal, useTheme2 } from '@grafana/ui';
import { getSelectStyles } from '@grafana/ui/internal';


interface RoleMenuGroupsOptionProps {
  // display name
  name: string;
  // group id
  value: string;
  onChange: (value: string) => void;
  onClick?: (value: string) => void;
  onOpenSubMenu?: (value: string) => void;
  onCloseSubMenu?: () => void;
  isSelected?: boolean;
  partiallySelected?: boolean;
  isFocused?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  root?: HTMLElement;
}

export const RoleMenuGroupOption = memo(
  React.forwardRef<HTMLDivElement, RoleMenuGroupsOptionProps>(
    (
      {
        name,
        value,
        isFocused,
        isSelected,
        partiallySelected,
        disabled,
        onChange,
        onClick,
        onOpenSubMenu,
        onCloseSubMenu,
        children,
        root,
      },
      ref
    ) => {
      const theme = useTheme2();
      const styles = getSelectStyles(theme);

      const wrapperProps = mergeStylexClassName(
        stylex.props(disabled && rolePickerStyles.menuOptionDisabled),
        clsx(stylesStyles.option, isFocused && stylesStyles.optionFocused)
      );

      const onChangeInternal = (event: FormEvent<HTMLElement>) => {
        if (disabled) {
          return;
        }
        if (value) {
          onChange(value);
        }
      };

      const onClickInternal = (event: FormEvent<HTMLElement>) => {
        if (onClick) {
          onClick(value!);
        }
      };

      const onMouseEnter = () => {
        if (onOpenSubMenu) {
          onOpenSubMenu(value!);
        }
      };

      const onMouseLeave = () => {
        if (onCloseSubMenu) {
          onCloseSubMenu();
        }
      };

      return (
        <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          {/* TODO: fix keyboard a11y */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            ref={ref}
            {...wrapperProps}
            aria-label={t('role-picker.menu-group-option-aria-label', 'Role picker option')}
            onClick={onClickInternal}
          >
            <Checkbox
              value={isSelected}
              {...mergeStylexClassName(
                stylex.props(
                  rolePickerStyles.menuOptionCheckbox,
                  partiallySelected && rolePickerStyles.checkboxPartiallyChecked
                ),
                undefined
              )}
              onChange={onChangeInternal}
              disabled={disabled}
            />
            <div {...mergeStylexClassName(stylex.props(rolePickerStyles.menuOptionBody), stylesStyles.optionBody)}>
              <span>{name}</span>
              <span {...stylex.props(rolePickerStyles.menuOptionExpand)} />
            </div>
            {root && children && (
              <Portal {...stylex.props(rolePickerStyles.subMenuPortal)} root={root}>
                {children}
              </Portal>
            )}
          </div>
        </div>
      );
    }
  )
);

RoleMenuGroupOption.displayName = 'RoleMenuGroupOption';
