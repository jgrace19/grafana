import * as stylex from '@stylexjs/stylex';

import { OrgRole, type SelectableValue } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { Icon, RadioButtonList, Tooltip, type PopoverContent } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import { contextSrv } from 'app/core/services/context_srv';

import { sectionStyles } from './styles';

interface Props {
  value?: OrgRole;
  onChange: (value: OrgRole) => void;
  disabled?: boolean;
  disabledMesssage?: string;
  tooltipMessage?: PopoverContent;
}

export const BuiltinRoleSelector = ({ value, onChange, disabled, disabledMesssage, tooltipMessage }: Props) => {
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
      <div {...stylex.props(sectionStyles.groupHeader)}>
        <span {...stylex.props(styles.label)}>
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
        className={stylex.props(styles.basicRoleSelector).className}
        options={basicRoleOptions}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </>
  );
};

const styles = stylex.create({
  label: {
    marginRight: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
  },
  basicRoleSelector: {
    marginTop: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    marginRight: `calc(${spacing['--gf-spacing-grid-size']} * 1.25)`,
    marginBottom: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    marginLeft: `calc(${spacing['--gf-spacing-grid-size']} * 1.5)`,
  },
});
