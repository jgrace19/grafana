
import { t } from '@grafana/i18n';
import { ConfirmModal, } from '@grafana/ui';

const Body = () => {
  const styles = (getStyles);

  return (
    <p {...stylex.props(deletePublicDashboardModalStyles.description)}>
      {t(
        'shared-dashboard.delete-modal.revoke-body-text',
        'Are you sure you want to revoke this access? The dashboard can no longer be shared.'
      )}
    </p>
  );
};

export const DeletePublicDashboardModal = ({
  onConfirm,
  onDismiss,
}: {
  onConfirm: () => void;
  onDismiss: () => void;
}) => {
  const translatedRevocationModalText = t('shared-dashboard.delete-modal.revoke-title', 'Revoke access');
  return (
    <ConfirmModal
      isOpen
      body={<Body />}
      onConfirm={onConfirm}
      onDismiss={onDismiss}
      title={translatedRevocationModalText}
      confirmText={translatedRevocationModalText}
    />
  );
};

