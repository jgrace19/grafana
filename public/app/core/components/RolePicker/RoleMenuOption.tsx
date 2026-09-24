import * as stylex from '@stylexjs/stylex';
import { forwardRef, type FormEvent } from 'react';

import { t } from '@grafana/i18n';
import { Checkbox, Icon, Tooltip } from '@grafana/ui';
import { colors } from '@grafana/ui/stylex/tokens.stylex';
import { type Role } from 'app/types/accessControl';

import { optionStyles } from './styles';

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
    disabled = disabled || mapped;
    let disabledMessage = '';
    if (disabled) {
      disabledMessage = 'You do not have permissions to assign this role.';
      if (mapped) {
        disabledMessage = 'Role assignment cannot be removed because the role is mapped through group sync.';
      }
    }

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
        {...stylex.props(
          optionStyles.option,
          isFocused && optionStyles.optionFocused,
          disabled && optionStyles.menuOptionDisabled
        )}
        aria-label={t('role-picker.menu-option-aria-label', 'Role picker option')}
        onClick={onChangeInternal}
      >
        <Checkbox
          value={isSelected}
          xstyle={optionStyles.menuOptionCheckbox}
          onChange={onChangeInternal}
          disabled={disabled}
        />
        <div {...stylex.props(optionStyles.optionBody, optionStyles.menuOptionBody)}>
          <span>{(useFilteredDisplayName && data.filteredDisplayName) || data.displayName || data.name}</span>
          {!hideDescription && data.description && (
            <div {...stylex.props(optionStyles.optionDescription)}>{data.description}</div>
          )}
        </div>
        {disabledMessage && (
          <Tooltip content={disabledMessage}>
            <Icon name="lock" />
          </Tooltip>
        )}
        {data.description && (
          <Tooltip content={data.description}>
            <Icon name="info-circle" xstyle={styles.menuOptionInfoSign} />
          </Tooltip>
        )}
      </div>
    );
  }
);

RoleMenuOption.displayName = 'RoleMenuOption';

const styles = stylex.create({
  menuOptionInfoSign: {
    color: colors['--gf-colors-text-disabled'],
  },
});
