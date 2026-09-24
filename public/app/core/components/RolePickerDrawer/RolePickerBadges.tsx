import * as stylex from '@stylexjs/stylex';
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

  const badgeStyle = stylex.props(disabled ? styles.badgeDisabled : styles.badge).className;

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
        <Badge className={badgeStyle} color="blue" onClick={drawerControl} text={watch('role')} />
        {user.roles && user.roles.length > 0 && (
          <Badge
            className={badgeStyle}
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

const styles = stylex.create({
  badge: {
    cursor: 'pointer',
  },
  badgeDisabled: {
    cursor: 'not-allowed',
  },
});
