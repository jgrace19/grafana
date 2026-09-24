import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { emailListConfigurationStyles } from './EmailListConfiguration.stylex';

import { selectors as e2eSelectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import {Dropdown, Field, Icon, IconButton, Menu, Spinner, Stack, Text} from '@grafana/ui';
import {
  useReshareAccessToRecipientMutation,
  useDeleteRecipientMutation,
  publicDashboardApi,
} from 'app/features/dashboard/api/publicDashboardApi';
import { type PublicDashboard } from 'app/features/dashboard/components/ShareModal/SharePublicDashboard/SharePublicDashboardUtils';
import { type DashboardScene } from 'app/features/dashboard-scene/scene/DashboardScene';
import { DashboardInteractions } from 'app/features/dashboard-scene/utils/interactions';

const selectors = e2eSelectors.pages.ShareDashboardModal.PublicDashboard.EmailSharingConfiguration;

const RecipientMenu = ({ onDelete, onReshare }: { onDelete: () => void; onReshare: () => void }) => {
  return (
    <Menu>
      <Menu.Item label={t('public-dashboard.email-sharing.resend-invite-label', 'Resend invite')} onClick={onReshare} />
      <Menu.Item
        label={t('public-dashboard.email-sharing.revoke-access-label', 'Revoke access')}
        destructive
        onClick={onDelete}
      />
    </Menu>
  );
};

const EmailList = ({
  recipients,
  dashboardUid,
  publicDashboard,
}: {
  recipients: PublicDashboard['recipients'];
  dashboardUid: string;
  publicDashboard: PublicDashboard;
}) => {


  const [deleteEmail, { isLoading: isDeleteLoading }] = useDeleteRecipientMutation();
  const [reshareAccess, { isLoading: isReshareLoading }] = useReshareAccessToRecipientMutation();

  const isLoading = isDeleteLoading || isReshareLoading;

  const onDeleteEmail = (recipientUid: string, recipientEmail: string) => {
    DashboardInteractions.revokePublicDashboardEmailClicked();
    deleteEmail({ recipientUid, recipientEmail, dashboardUid: dashboardUid, uid: publicDashboard.uid });
  };

  const onReshare = (recipientUid: string) => {
    DashboardInteractions.resendPublicDashboardEmailClicked();
    reshareAccess({ recipientUid, uid: publicDashboard.uid });
  };

  return (
    <table data-testid={selectors.EmailSharingList} {...stylex.props(emailListConfigurationStyles.table)}>
      <tbody>
        {recipients!.map((recipient, idx) => (
          <tr key={recipient.uid} {...stylex.props(emailListConfigurationStyles.listItem)}>
            <td {...stylex.props(emailListConfigurationStyles.user)}>
              <Stack direction="row" gap={1} alignItems="center">
                <div {...stylex.props(emailListConfigurationStyles.icon)}>
                  <Icon name="user" />
                </div>
                <Text>{recipient.recipient}</Text>
              </Stack>
            </td>
            <td>{isLoading && <Spinner />}</td>
            <td>
              <Dropdown
                overlay={
                  <RecipientMenu
                    onDelete={() => onDeleteEmail(recipient.uid, recipient.recipient)}
                    onReshare={() => onReshare(recipient.uid)}
                  />
                }
              >
                <IconButton
                  name="ellipsis-v"
                  aria-label={t('dashboard-scene.email-list.aria-label-emailmenu', 'Toggle email menu')}
                  variant="secondary"
                  size="lg"
                />
              </Dropdown>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const EmailListConfiguration = ({ dashboard }: { dashboard: DashboardScene }) => {

  const { data: publicDashboard } = publicDashboardApi.endpoints?.getPublicDashboard.useQueryState(
    dashboard.state.uid!
  );

  return (
    <Field
      label={t('public-dashboard.email-sharing.recipient-list-title', 'People with access')}
      description={t(
        'public-dashboard.email-sharing.recipient-list-description',
        "Only people you've directly invited can access this dashboard"
      )}
      {...stylex.props(emailListConfigurationStyles.listField)}
    >
      {!!publicDashboard?.recipients?.length ? (
        <div {...stylex.props(emailListConfigurationStyles.listContainer)}>
          <EmailList
            recipients={publicDashboard.recipients}
            dashboardUid={dashboard.state.uid!}
            publicDashboard={publicDashboard}
          />
        </div>
      ) : (
        <></>
      )}
    </Field>
  );
};

