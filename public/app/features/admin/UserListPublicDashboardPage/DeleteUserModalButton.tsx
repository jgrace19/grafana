import { css } from '@emotion/css';
import * as stylex from '@stylexjs/stylex';

import { Trans, t } from '@grafana/i18n';
import { Button, Modal, ModalsController, useStyles2 } from '@grafana/ui';
import { typography } from '@grafana/ui/stylex/tokens.stylex';
import { type SessionUser } from 'app/features/dashboard/components/ShareModal/SharePublicDashboard/SharePublicDashboardUtils';

import { useRevokeAllAccessMutation } from '../../dashboard/api/publicDashboardApi';

const DeleteUserModal = ({ user, hideModal }: { user: SessionUser; hideModal: () => void }) => {
  const [revokeAllAccess] = useRevokeAllAccessMutation();
  const pendingStyles = useStyles2(getPendingStyles);

  const onRevokeAccessClick = () => {
    revokeAllAccess({ email: user.email });
    hideModal();
  };

  return (
    <Modal
      className={pendingStyles.modal}
      isOpen
      title={t('public-dashboard-users-access-list.delete-user-modal.revoke-access-title', 'Revoke access')}
      onDismiss={hideModal}
    >
      <p {...stylex.props(styles.description)}>
        <Trans i18nKey="public-dashboard-users-access-list.delete-user-modal.revoke-user-access-modal-desc-line1">
          Are you sure you want to revoke access for {{ email: user.email }}?
        </Trans>
      </p>
      <p {...stylex.props(styles.description)}>
        <Trans
          i18nKey="public-dashboard-users-access-list.delete-user-shared-dashboards-modal.revoke-user-access-modal-desc-line2"
          shouldUnescape
        >
          This action will immediately revoke {{ email: user.email }}&apos;s access to all shared dashboards.
        </Trans>
      </p>
      <Modal.ButtonRow>
        <Button type="button" variant="secondary" onClick={hideModal} fill="outline">
          <Trans i18nKey="public-dashboard-users-access-list.delete-user-modal.delete-user-cancel-button">Cancel</Trans>
        </Button>
        <Button type="button" variant="destructive" onClick={onRevokeAccessClick}>
          <Trans i18nKey="public-dashboard-users-access-list.delete-user-modal.delete-user-revoke-access-button">
            Revoke access
          </Trans>
        </Button>
      </Modal.ButtonRow>
    </Modal>
  );
};

export const DeleteUserModalButton = ({ user }: { user: SessionUser }) => {
  const translatedDeleteUserText = t(
    'public-dashboard-users-access-list.delete-user-modal.delete-user-button-text',
    'Delete user'
  );
  return (
    <ModalsController>
      {({ showModal, hideModal }) => (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => showModal(DeleteUserModal, { user, hideModal })}
          icon="times"
          aria-label={translatedDeleteUserText}
          title={translatedDeleteUserText}
        />
      )}
    </ModalsController>
  );
};

// stylex: pending Modal migration
const getPendingStyles = () => ({
  modal: css({
    width: '500px',
  }),
});

const styles = stylex.create({
  description: {
    fontSize: typography['--gf-typography-body-font-size'],
    margin: 0,
  },
});
