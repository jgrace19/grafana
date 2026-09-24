
import { Trans, t } from '@grafana/i18n';
import { Modal, } from '@grafana/ui';

export interface Props {}

export const SelectedMixResourcesMsgModal = ({ onDismiss }: { onDismiss: () => void }) => {
  const styles = (getStyles);
  return (
    <Modal
      title={t('browse-dashboards.action.selected-mix-resources-modal-title', 'Mixed resource types selected')}
      isOpen={true}
      onDismiss={onDismiss}
      {...stylex.props(selectedMixResourcesMsgModalStyles.modal)}
    >
      <Trans i18nKey="browse-dashboards.action.selected-mix-resources-modal-text">
        You have selected both provisioned and non-provisioned resources. These cannot be processed together. Please
        select only provisioned resources or only non-provisioned resources and try again.
      </Trans>
    </Modal>
  );
};

