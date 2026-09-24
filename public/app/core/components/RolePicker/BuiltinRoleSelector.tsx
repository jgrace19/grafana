import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { rolePickerStyles } from './stylesStyles.stylex';
import { OrgRole, type SelectableValue } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { Icon, RadioButtonList, Tooltip, useTheme2, type PopoverContent } from '@grafana/ui';
import { contextSrv } from 'app/core/services/context_srv';


interface Props {
  value?: OrgRole;
  onChange: (value: OrgRole) => void;
  disabled?: boolean;
  disabledMesssage?: string;
  tooltipMessage?: PopoverContent;
}

export const BuiltinRoleSelector = ({ value, onChange, disabled, disabledMesssage, tooltipMessage }: Props) => {
  const theme = useTheme2();

  // Create options dynamically to filter out OrgRole.None when access control is not licensed
  const basicRoleOptions: Array<SelectableValue<OrgRole>> = Object.values(OrgRole)
    .filter((r) => {
      // Filter out OrgRole.None if access control is not licensed
      if (r === OrgRole.None && !contextSrv.licensedAccessControlEnabled()) {
        return false;
      }
      return true;
    })
    .map((r) => ({
      label: r === OrgRole.None ? 'No basic role' : r,
      value: r,
    }));

  return (
    <>
      <div className={stylesStyles.groupHeader}>
        <span style={{ marginRight: theme.spacing(1) }}>
          <Trans i18nKey="role-picker.built-in.basic-roles">Basic roles</Trans>
        </span>
        {disabled && disabledMesssage && (
          <Tooltip placement="right-end" interactive={true} content={<div>{disabledMesssage}</div>}>
            <Icon name="question-circle" />
          </Tooltip>
        )}
        {!disabled && tooltipMessage && (
          <Tooltip placement="right-end" interactive={true} content={tooltipMessage}>
            <Icon name="info-circle" size="xs" />
          </Tooltip>
        )}
      </div>
      <RadioButtonList
        name="Basic Role Selector"
        className={stylesStyles.basicRoleSelector}
        options={basicRoleOptions}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </>
  );
};
