import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { type FormEvent, type HTMLProps, useEffect, useRef, type JSX } from 'react';
import * as React from 'react';

import { type GrafanaTheme2 } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { getInputStyles, sharedInputStyle, Tooltip, Icon, Spinner, useTheme2 } from '@grafana/ui';
import { getFocusStyles } from '@grafana/ui/internal';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { rolePickerInputStyles } from './RolePickerInput.stylex';
import { type Role } from 'app/types/accessControl';

import { ValueContainer } from './ValueContainer';
import { ROLE_PICKER_WIDTH } from './constants';

const stopPropagation = (event: React.MouseEvent<HTMLDivElement>) => event.stopPropagation();

interface InputProps extends HTMLProps<HTMLInputElement> {
  appliedRoles: Role[];
  basicRole?: string;
  query: string;
  showBasicRole?: boolean;
  isFocused?: boolean;
  disabled?: boolean;
  width?: string;
  isLoading?: boolean;
  onQueryChange: (query?: string) => void;
  onOpen: (event: FormEvent<HTMLElement>) => void;
  onClose: () => void;
}

export const RolePickerInput = ({
  appliedRoles,
  basicRole,
  disabled,
  isFocused,
  query,
  showBasicRole,
  width,
  isLoading,
  onOpen,
  onClose,
  onQueryChange,
  ...rest
}: InputProps): JSX.Element => {
  const theme = useTheme2();
  const styles = getRolePickerInputClassNames(theme, !!isFocused, !!disabled, width);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isFocused) {
      inputRef.current?.focus();
    }
  });

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target?.value;
    onQueryChange(query);
  };

  const showBasicRoleOnLabel = showBasicRole && basicRole !== 'None';

  return !isFocused ? (
    // TODO: fix keyboard a11y
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className={clsx(styles.wrapper, styles.selectedRoles)} style={styles.wrapperStyle} onMouseDown={onOpen}>
      {showBasicRoleOnLabel && <ValueContainer>{basicRole}</ValueContainer>}
      <RolesLabel
        appliedRoles={appliedRoles}
        numberOfRoles={appliedRoles.length}
        showBuiltInRole={showBasicRoleOnLabel}
      />
      {isLoading && (
        <div className={styles.spinner}>
          <Spinner size={16} inline />
        </div>
      )}
    </div>
  ) : (
    <div className={styles.wrapper} style={styles.wrapperStyle}>
      {showBasicRoleOnLabel && <ValueContainer>{basicRole}</ValueContainer>}
      {appliedRoles.map((role) => (
        <ValueContainer key={role.uid}>{role.group + ':' + (role.displayName || role.name)}</ValueContainer>
      ))}

      {!disabled && (
        <input
          {...rest}
          className={styles.input}
          ref={inputRef}
          onMouseDown={stopPropagation}
          onChange={onInputChange}
          data-testid="role-picker-input"
          placeholder={isFocused ? t('role-picker.input.placeholder-select-role', 'Select role') : undefined}
          value={query}
        />
      )}
      <div className={styles.suffix}>
        <Icon name="angle-up" className={styles.dropdownIndicator} onMouseDown={onClose} />
      </div>
    </div>
  );
};

RolePickerInput.displayName = 'RolePickerInput';

interface RolesLabelProps {
  appliedRoles: Role[];
  showBuiltInRole?: boolean;
  numberOfRoles: number;
}

export const RolesLabel = ({ showBuiltInRole, numberOfRoles, appliedRoles }: RolesLabelProps): JSX.Element => {
  return (
    <>
      {!!numberOfRoles ? (
        <Tooltip
          content={
            <div {...stylex.props(rolePickerInputStyles.tooltip)}>
              {appliedRoles?.map((role) => (
                <p key={role.uid}>{role.group + ':' + (role.displayName || role.name)}</p>
              ))}
            </div>
          }
        >
          <ValueContainer>{`${showBuiltInRole ? '+' : ''}${numberOfRoles} role${
            numberOfRoles > 1 ? 's' : ''
          }`}</ValueContainer>
        </Tooltip>
      ) : (
        !showBuiltInRole && (
          <ValueContainer>
            <Trans i18nKey="role-picker.input.no-roles">No roles assigned</Trans>
          </ValueContainer>
        )
      )}
    </>
  );
};

function getRolePickerInputClassNames(
  theme: GrafanaTheme2,
  focused: boolean,
  disabled: boolean,
  width?: string
) {
  const inputStyles = getInputStyles({ theme, invalid: false });

  return {
    wrapper: clsx(
      inputStyles.wrapper,
      sharedInputStyle(theme, false),
      focused && getFocusStyles(theme),
      disabled && inputStyles.inputDisabled,
      stylex.props(rolePickerInputStyles.wrapperLayout).className
    ),
    wrapperStyle: {
      minWidth: width || `${ROLE_PICKER_WIDTH}px`,
      width: width,
    } as React.CSSProperties,
    input: clsx(
      sharedInputStyle(theme, false),
      stylex.props(
        rolePickerInputStyles.input,
        focused ? rolePickerInputStyles.inputFocused : rolePickerInputStyles.inputBlurred
      ).className
    ),
    suffix: inputStyles.suffix,
    dropdownIndicator: stylex.props(rolePickerInputStyles.dropdownIndicator).className,
    selectedRoles: stylex.props(
      rolePickerInputStyles.selectedRoles,
      disabled ? rolePickerInputStyles.selectedRolesDisabled : rolePickerInputStyles.selectedRolesEnabled
    ).className,
    spinner: stylex.props(rolePickerInputStyles.spinner).className,
  };
}
