import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { type FormEvent, memo } from 'react';
import * as React from 'react';

import { t } from '@grafana/i18n';
import { Checkbox, Portal } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

import './RoleMenuGroupOption.css';
import { optionStyles } from './styles';

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
            {...stylex.props(
              optionStyles.option,
              isFocused && optionStyles.optionFocused,
              disabled && optionStyles.menuOptionDisabled
            )}
            aria-label={t('role-picker.menu-group-option-aria-label', 'Role picker option')}
            onClick={onClickInternal}
          >
            <Checkbox
              value={isSelected}
              xstyle={optionStyles.menuOptionCheckbox}
              className={clsx(partiallySelected && 'gf-role-picker-checkbox-partial')}
              onChange={onChangeInternal}
              disabled={disabled}
            />
            <div {...stylex.props(optionStyles.optionBody, optionStyles.menuOptionBody)}>
              <span>{name}</span>
              <span {...stylex.props(styles.menuOptionExpand)} />
            </div>
            {root && children && (
              <Portal className="gf-role-picker-submenu-portal" root={root}>
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

const styles = stylex.create({
  menuOptionExpand: {
    position: 'absolute',
    right: `calc(${spacing['--gf-spacing-grid-size']} * 2.5)`,
    color: colors['--gf-colors-text-disabled'],
    '::after': {
      content: '">"',
    },
  },
});
