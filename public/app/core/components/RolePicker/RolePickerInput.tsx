import * as stylex from '@stylexjs/stylex';
import { type FormEvent, type HTMLProps, useEffect, useRef, type JSX } from 'react';
import * as React from 'react';

import { Trans, t } from '@grafana/i18n';
import { Tooltip, Icon, Spinner, useTheme2 } from '@grafana/ui';
import { inputBorderStyles, inputStyles } from '@grafana/ui/internal';
import { motion } from '@grafana/ui/stylex/constants.stylex';
import { colors, components, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapperStyles = [
    inputStyles.input,
    inputBorderStyles[theme.isDark ? 'dark' : 'light'],
    styles.wrapper,
    styles.width(width || `${ROLE_PICKER_WIDTH}px`, width || '100%'),
    isFocused && styles.focused,
    disabled && styles.inputDisabled,
  ];

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
    <div
      {...stylex.props(wrapperStyles, styles.selectedRoles, disabled && styles.selectedRolesDisabled)}
      onMouseDown={onOpen}
    >
      {showBasicRoleOnLabel && <ValueContainer>{basicRole}</ValueContainer>}
      <RolesLabel
        appliedRoles={appliedRoles}
        numberOfRoles={appliedRoles.length}
        showBuiltInRole={showBasicRoleOnLabel}
      />
      {isLoading && (
        <div {...stylex.props(styles.spinner)}>
          <Spinner size={16} inline />
        </div>
      )}
    </div>
  ) : (
    <div {...stylex.props(wrapperStyles)}>
      {showBasicRoleOnLabel && <ValueContainer>{basicRole}</ValueContainer>}
      {appliedRoles.map((role) => (
        <ValueContainer key={role.uid}>{role.group + ':' + (role.displayName || role.name)}</ValueContainer>
      ))}

      {!disabled && (
        <input
          {...rest}
          className={stylex.props(styles.input).className}
          ref={inputRef}
          onMouseDown={stopPropagation}
          onChange={onInputChange}
          data-testid="role-picker-input"
          placeholder={isFocused ? t('role-picker.input.placeholder-select-role', 'Select role') : undefined}
          value={query}
        />
      )}
      <div {...stylex.props(inputStyles.prefixSuffix, inputStyles.suffix)}>
        <Icon name="angle-up" xstyle={styles.dropdownIndicator} onMouseDown={onClose} />
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
            <div>
              {appliedRoles?.map((role) => (
                <p key={role.uid} {...stylex.props(styles.tooltipRole)}>
                  {role.group + ':' + (role.displayName || role.name)}
                </p>
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

const focusRing = `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`;

// The wrapper looks like an Input (Input's input styles on a <div>); these override it.
const styles = stylex.create({
  wrapper: {
    // inputStyles.input's z-index would make the wrapper a stacking context.
    zIndex: 'auto',
    minHeight: '32px',
    maxHeight: '200px',
    overflowX: 'hidden',
    overflowY: 'auto',
    height: 'auto',
    flexDirection: 'row',
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    maxWidth: '100%',
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    position: 'relative',
    boxSizing: 'border-box',
    cursor: 'default',
  },
  width: (minWidth: string, width: string) => ({ minWidth, width }),
  // getFocusStyles, applied while the menu is open.
  focused: {
    outlineStyle: 'dotted',
    outlineWidth: '2px',
    outlineColor: 'transparent',
    outlineOffset: '2px',
    boxShadow: focusRing,
    transitionProperty: 'outline, outline-offset, box-shadow',
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: '0.2s' },
    transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: 'cubic-bezier(0.19, 1, 0.22, 1)' },
  },
  // A toggled class on main, so the hover border still applies on top of it.
  inputDisabled: {
    backgroundColor: colors['--gf-colors-action-disabled-background'],
    color: colors['--gf-colors-action-disabled-text'],
    borderColor: {
      default: colors['--gf-colors-action-disabled-background'],
      ':hover': components['--gf-components-input-border-hover'],
    },
  },
  selectedRoles: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  selectedRolesDisabled: {
    cursor: 'not-allowed',
  },
  // sharedInputStyle without its border.
  input: {
    paddingTop: 0,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    paddingBottom: 0,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    backgroundColor: components['--gf-components-input-background'],
    lineHeight: typography['--gf-typography-body-line-height'],
    fontSize: typography['--gf-typography-size-md'],
    color: components['--gf-components-input-text'],
    borderStyle: 'none',
    outlineStyle: { default: null, ':focus': 'none' },
    maxWidth: '120px',
    cursor: 'default',
    '::placeholder': {
      color: colors['--gf-colors-text-disabled'],
      opacity: 1,
    },
  },
  dropdownIndicator: {
    cursor: 'pointer',
  },
  tooltipRole: {
    marginBottom: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
  },
  spinner: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});
