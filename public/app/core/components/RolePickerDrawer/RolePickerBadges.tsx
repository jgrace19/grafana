import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { rolePickerBadgesStyles } from './RolePickerBadges.stylex';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { t } from '@grafana/i18n';
import { Badge, Stack } from '@grafana/ui';
import { type OrgUser } from 'app/types/user';

import { RolePickerDrawer } from './RolePickerDrawer';

export interface Props {
  disabled?: boolean;
  user: OrgUser;
}

export const RolePickerBadges = ({ disabled, user }: Props) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const badgeProps = stylex.props(disabled ? rolePickerBadgesStyles.badgeDisabled : rolePickerBadgesStyles.badge);

  const methods = useForm({
    defaultValues: {
      name: user.name,
      role: user.role,
      roles: user.roles,
    },
  });

  const { watch } = methods;

  const drawerControl = () => {
    if (!disabled) {
      setIsDrawerOpen(true);
    }
  };

  return (
    <>
      <Stack gap={1}>
        <Badge {...badgeProps} color="blue" onClick={drawerControl} text={watch('role')} />
        {user.roles && user.roles.length > 0 && (
          <Badge
            {...badgeProps}
            color="blue"
            onClick={drawerControl}
            text={t('role-picker-drawer.user-count', '+{{numUsers}}', { numUsers: user.roles.length })}
          />
        )}
      </Stack>
      {isDrawerOpen && (
        <FormProvider {...methods}>
          <RolePickerDrawer onClose={() => setIsDrawerOpen(false)} />
        </FormProvider>
      )}
    </>
  );
};

