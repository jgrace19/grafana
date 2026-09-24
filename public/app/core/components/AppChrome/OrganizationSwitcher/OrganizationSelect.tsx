import { useMemo, useState } from 'react';

import { type SelectableValue } from '@grafana/data';
import { t } from '@grafana/i18n';
import { Icon, Select } from '@grafana/ui';
import { contextSrv } from 'app/core/services/context_srv';
import { type UserOrg } from 'app/types/user';

import { type OrganizationBaseProps } from './types';

import './OrganizationSelect.css';

export function OrganizationSelect({ orgs, onSelectChange }: OrganizationBaseProps) {
  const { orgId } = contextSrv.user;

  const options = useMemo(
    () =>
      orgs.map((org) => ({
        label: org.name,
        description: org.role,
        value: org,
      })),
    [orgs]
  );

  const selectedValue = useMemo(() => options.find((option) => option.value.orgId === orgId), [options, orgId]);

  const [value, setValue] = useState<SelectableValue<UserOrg>>(() => selectedValue);
  const onChange = (option: SelectableValue<UserOrg>) => {
    setValue(option);
    onSelectChange(option);
  };

  return (
    <Select<UserOrg>
      aria-label={t('navigation.org-switcher.aria-label', 'Change organization')}
      width={'auto'}
      value={value}
      prefix={<Icon className="prefix-icon" name="building" />}
      className="gf-org-select"
      options={options}
      onChange={onChange}
    />
  );
}
