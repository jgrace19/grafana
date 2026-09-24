import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { ConfirmModal } from '@grafana/ui';
import { typography } from '@grafana/ui/stylex/tokens.stylex';

const Body = () => {
  return (
    <p {...stylex.props(styles.description)}>
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

const styles = stylex.create({
  description: {
    fontSize: typography['--gf-typography-body-font-size'],
  },
});
