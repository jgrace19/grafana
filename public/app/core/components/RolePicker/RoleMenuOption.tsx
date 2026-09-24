import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { rolePickerStyles } from './stylesStyles.stylex';
import { forwardRef, type FormEvent } from 'react';

import { t } from '@grafana/i18n';
import { Checkbox, Icon, Tooltip, useTheme2 } from '@grafana/ui';
import { getSelectStyles } from '@grafana/ui/internal';
import { type Role } from 'app/types/accessControl';


interface RoleMenuOptionProps {
  data: Role;
  onChange: (value: Role) => void;
  useFilteredDisplayName?: boolean;
  isSelected?: boolean;
  isFocused?: boolean;
  disabled?: boolean;
  mapped?: boolean;
  hideDescription?: boolean;
}

export const RoleMenuOption = forwardRef<HTMLDivElement, React.PropsWithChildren<RoleMenuOptionProps>>(
  ({ data, isFocused, isSelected, useFilteredDisplayName, disabled, mapped, onChange, hideDescription }, ref) => {
    const theme = useTheme2();
    const styles = getSelectStyles(theme);

    disabled = disabled || mapped;
    let disabledMessage = '';
    if (disabled) {
      disabledMessage = 'You do not have permissions to assign this role.';
      if (mapped) {
        disabledMessage = 'Role assignment cannot be removed because the role is mapped through group sync.';
      }
    }

    const wrapperProps = mergeStylexClassName(
      stylex.props(disabled && rolePickerStyles.menuOptionDisabled),
      clsx(stylesStyles.option, isFocused && stylesStyles.optionFocused)
    );

    const onChangeInternal = (event: FormEvent<HTMLElement>) => {
      if (disabled) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      onChange(data);
    };

    return (
      // TODO: fix keyboard a11y
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div
        ref={ref}
        {...wrapperProps}
        aria-label={t('role-picker.menu-option-aria-label', 'Role picker option')}
        onClick={onChangeInternal}
      >
        <Checkbox
          value={isSelected}
          {...stylex.props(rolePickerStyles.menuOptionCheckbox)}
          onChange={onChangeInternal}
          disabled={disabled}
        />
        <div
          {...mergeStylexClassName(stylex.props(rolePickerStyles.menuOptionBody), stylesStyles.optionBody)}
        >
          <span>{(useFilteredDisplayName && data.filteredDisplayName) || data.displayName || data.name}</span>
          {!hideDescription && data.description && <div className={stylesStyles.optionDescription}>{data.description}</div>}
        </div>
        {disabledMessage && (
          <Tooltip content={disabledMessage}>
            <Icon name="lock" />
          </Tooltip>
        )}
        {data.description && (
          <Tooltip content={data.description}>
            <Icon name="info-circle" {...stylex.props(rolePickerStyles.menuOptionInfoSign)} />
          </Tooltip>
        )}
      </div>
    );
  }
);

RoleMenuOption.displayName = 'RoleMenuOption';
