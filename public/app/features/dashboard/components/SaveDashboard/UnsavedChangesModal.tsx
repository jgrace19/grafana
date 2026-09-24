// eslint-disable-next-line no-restricted-imports -- stylex: pending Modal migration (see modalStyles)
import { css } from '@emotion/css';

import { Trans, t } from '@grafana/i18n';
import { Button, Modal } from '@grafana/ui';

import { type DashboardModel } from '../../state/DashboardModel';

import { SaveDashboardButton } from './SaveDashboardButton';

interface UnsavedChangesModalProps {
  dashboard: DashboardModel;
  onDiscard: () => void;
  onDismiss: () => void;
  onSaveSuccess?: () => void;
}

export const UnsavedChangesModal = ({ dashboard, onSaveSuccess, onDiscard, onDismiss }: UnsavedChangesModalProps) => {
  return (
    <Modal
      isOpen={true}
      title={t('dashboard.unsaved-changes-modal.title-unsaved-changes', 'Unsaved changes')}
      onDismiss={onDismiss}
      className={modalStyles}
    >
      <h5>
        <Trans i18nKey="dashboard.unsaved-changes-modal.changes">Do you want to save your changes?</Trans>
      </h5>
      <Modal.ButtonRow>
        <Button variant="secondary" onClick={onDismiss} fill="outline">
          <Trans i18nKey="dashboard.unsaved-changes-modal.cancel">Cancel</Trans>
        </Button>
        <Button variant="destructive" onClick={onDiscard}>
          <Trans i18nKey="dashboard.unsaved-changes-modal.discard">Discard</Trans>
        </Button>
        <SaveDashboardButton dashboard={dashboard} onSaveSuccess={onSaveSuccess} />
      </Modal.ButtonRow>
    </Modal>
  );
};

// stylex: pending Modal migration. Modal's own Emotion width would beat a StyleX override.
const modalStyles = css({
  width: '500px',
});
