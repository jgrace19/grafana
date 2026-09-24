import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { serviceAccountsListItemStyles } from './ServiceAccountsListItem.stylex';
import { memo } from 'react';
import Skeleton from 'react-loading-skeleton';

import { Trans, t } from '@grafana/i18n';
import { Button, Icon, IconButton, Stack } from '@grafana/ui';
import { type SkeletonComponent, attachSkeleton } from '@grafana/ui/unstable';
import { UserRolePicker } from 'app/core/components/RolePicker/UserRolePicker';
import { contextSrv } from 'app/core/services/context_srv';
import { OrgRolePicker } from 'app/features/admin/OrgRolePicker';
import { type Role, AccessControlAction } from 'app/types/accessControl';
import { type ServiceAccountDTO } from 'app/types/serviceaccount';

type ServiceAccountListItemProps = {
  serviceAccount: ServiceAccountDTO;
  onRoleChange: (role: OrgRole, serviceAccount: ServiceAccountDTO) => void;
  roleOptions: Role[];
  onRemoveButtonClick: (serviceAccount: ServiceAccountDTO) => void;
  onDisable: (serviceAccount: ServiceAccountDTO) => void;
  onEnable: (serviceAccount: ServiceAccountDTO) => void;
  onAddTokenClick: (serviceAccount: ServiceAccountDTO) => void;
};

const getServiceAccountsAriaLabel = (name: string) => {
  return `Edit service account's ${name} details`;
};

const ServiceAccountListItemComponent = memo(
  ({
    serviceAccount,
    onRoleChange,
    roleOptions,
    onRemoveButtonClick,
    onDisable,
    onEnable,
    onAddTokenClick,
  }: ServiceAccountListItemProps) => {
    const editUrl = `org/serviceaccounts/${serviceAccount.id}`;

    const canUpdateRole = contextSrv.hasPermissionInMetadata(AccessControlAction.ServiceAccountsWrite, serviceAccount);
    const displayRolePicker =
      contextSrv.hasPermission(AccessControlAction.ActionRolesList) &&
      contextSrv.hasPermission(AccessControlAction.ActionUserRolesList);

    return (
      <tr key={serviceAccount.id} className={cx({ [serviceAccountsListItemStyles.disabled]: serviceAccount.isDisabled })}>
        <td className="width-4 text-center link-td">
          <a href={editUrl} aria-label={getServiceAccountsAriaLabel(serviceAccount.name)}>
            <img
              className="filter-table__avatar"
              src={serviceAccount.avatarUrl}
              alt={`Avatar for user ${serviceAccount.name}`}
            />
          </a>
        </td>
        <td className="link-td max-width-10">
          <a
            className="ellipsis"
            href={editUrl}
            title={serviceAccount.name}
            aria-label={getServiceAccountsAriaLabel(serviceAccount.name)}
          >
            {serviceAccount.name}
          </a>
        </td>
        <td className="link-td max-width-10">
          <a
            className={serviceAccountsListItemStyles.accountId}
            href={editUrl}
            title={serviceAccount.login}
            aria-label={getServiceAccountsAriaLabel(serviceAccount.name)}
          >
            {serviceAccount.login}
          </a>
        </td>
        {contextSrv.licensedAccessControlEnabled() ? (
          <td>
            {displayRolePicker && (
              <UserRolePicker
                userId={serviceAccount.id}
                orgId={serviceAccount.orgId}
                basicRole={serviceAccount.role}
                roles={serviceAccount.roles || []}
                onBasicRoleChange={(newRole) => onRoleChange(newRole, serviceAccount)}
                roleOptions={roleOptions}
                basicRoleDisabled={!canUpdateRole}
                disabled={serviceAccount.isExternal || serviceAccount.isDisabled}
                width={40}
              />
            )}
          </td>
        ) : (
          <td>
            <OrgRolePicker
              aria-label={t('serviceaccounts.service-account-list-item.aria-label-role', 'Role')}
              value={serviceAccount.role}
              disabled={serviceAccount.isExternal || !canUpdateRole || serviceAccount.isDisabled}
              onChange={(newRole) => onRoleChange(newRole, serviceAccount)}
            />
          </td>
        )}
        <td className="link-td max-width-10">
          <a
            className="ellipsis"
            href={editUrl}
            title={t('serviceaccounts.service-account-list-item.title-tokens', 'Tokens')}
            aria-label={getServiceAccountsAriaLabel(serviceAccount.name)}
          >
            <div className={cx(serviceAccountsListItemStyles.tokensInfo, { [serviceAccountsListItemStyles.tokensInfoSecondary]: !serviceAccount.tokens })}>
              <span>
                <Icon name="key-skeleton-alt"></Icon>
              </span>
              {serviceAccount.tokens || 'No tokens'}
            </div>
          </a>
        </td>
        <td>
          {!serviceAccount.isExternal && (
            <Stack alignItems="center" justifyContent="flex-end">
              {contextSrv.hasPermission(AccessControlAction.ServiceAccountsWrite) && !serviceAccount.tokens && (
                <Button
                  onClick={() => onAddTokenClick(serviceAccount)}
                  disabled={serviceAccount.isDisabled}
                  className={serviceAccountsListItemStyles.actionButton}
                >
                  <Trans i18nKey="serviceaccounts.service-account-list-item.add-token">Add token</Trans>
                </Button>
              )}
              {contextSrv.hasPermissionInMetadata(AccessControlAction.ServiceAccountsWrite, serviceAccount) &&
                (serviceAccount.isDisabled ? (
                  <Button variant="primary" onClick={() => onEnable(serviceAccount)} className={serviceAccountsListItemStyles.actionButton}>
                    <Trans i18nKey="serviceaccounts.service-account-list-item.enable">Enable</Trans>
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={() => onDisable(serviceAccount)} className={serviceAccountsListItemStyles.actionButton}>
                    <Trans i18nKey="serviceaccounts.service-account-list-item.disable">Disable</Trans>
                  </Button>
                ))}
              {contextSrv.hasPermissionInMetadata(AccessControlAction.ServiceAccountsDelete, serviceAccount) && (
                <IconButton
                  {...stylex.props(serviceAccountsListItemStyles.deleteButton)}
                  name="trash-alt"
                  size="md"
                  onClick={() => onRemoveButtonClick(serviceAccount)}
                  tooltip={t(
                    'serviceaccounts.service-account-list-item.tooltip-delete-button',
                    'Delete service account {{serviceAccountName}}',
                    { serviceAccountName: serviceAccount.name }
                  )}
                />
              )}
            </Stack>
          )}
          {serviceAccount.isExternal && (
            <Stack alignItems="center" justifyContent="flex-end">
              <IconButton
                disabled={true}
                name="lock"
                size="md"
                tooltip={t(
                  'serviceaccounts.service-account-list-item.tooltip-managed-service-account-cannot-modified',
                  'This is a managed service account and cannot be modified'
                )}
              />
            </Stack>
          )}
        </td>
      </tr>
    );
  }
);
ServiceAccountListItemComponent.displayName = 'ServiceAccountListItem';

const ServiceAccountsListItemSkeleton: SkeletonComponent = ({ rootProps }) => {
  const styles = (getSkeletonStyles);

  return (
    <tr {...rootProps}>
      <td className="width-4 text-center">
        <Skeleton containerClassName={mergeStylexClassName(stylex.props(serviceAccountsListItemStyles.blockSkeleton), undefined).className} circle width={25} height={25} />
      </td>
      <td className="max-width-10">
        <Skeleton width={100} />
      </td>
      <td className="max-width-10">
        <Skeleton width={100} />
      </td>
      <td>
        <Skeleton containerClassName={mergeStylexClassName(stylex.props(serviceAccountsListItemStyles.blockSkeleton), undefined).className} width="100%" height={32} />
      </td>
      <td className="max-width-10">
        <Skeleton width={40} />
      </td>
      <td>
        <Stack alignItems="center" justifyContent="flex-end">
          <Skeleton containerClassName={mergeStylexClassName(stylex.props(serviceAccountsListItemStyles.blockSkeleton), undefined).className} width={102} height={32} />
          <Skeleton containerClassName={mergeStylexClassName(stylex.props(serviceAccountsListItemStyles.blockSkeleton), undefined).className} width={85} height={32} />
          <Skeleton containerClassName={cx(serviceAccountsListItemStyles.blockSkeleton, serviceAccountsListItemStyles.deleteButton)} width={16} height={16} />
        </Stack>
      </td>
    </tr>
  );
};

const ServiceAccountListItem = attachSkeleton(ServiceAccountListItemComponent, ServiceAccountsListItemSkeleton);


const getStyles = (theme: GrafanaTheme2) => {
  return {
    iconRow: css({
      svg: {
        marginLeft: theme.spacing(0.5),
      },
    }),
    accountId: cx(
      'ellipsis',
      css({
        color: theme.colors.text.secondary,
      })
    ),
    deleteButton: css({
      color: theme.colors.text.secondary,
    }),
    tokensInfo: css({
      span: {
        marginRight: theme.spacing(1),
      },
    }),
    tokensInfoSecondary: css({
      color: theme.colors.text.secondary,
    }),
    disabled: css({
      'td a': {
        color: theme.colors.text.secondary,
      },
    }),
    actionButton: css({
      minWidth: 85,
    }),
  };
};

export default ServiceAccountListItem;
