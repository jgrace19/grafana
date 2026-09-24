
import { Trans, t } from '@grafana/i18n';
import { locationService } from '@grafana/runtime';
import { Button, Modal, } from '@grafana/ui';

import { dashboardWatcher } from './dashboardWatcher';
import { type DashboardEvent, DashboardEventAction } from './types';

interface Props {
  event?: DashboardEvent;
  onDismiss: () => void;
}

export function DashboardChangedModal({ onDismiss, event }: Props) {
  const styles = (getStyles);

  const onDiscardChanges = () => {
    if (event?.action === DashboardEventAction.Deleted) {
      locationService.push('/');
      return;
    }

    dashboardWatcher.reloadPage();
    onDismiss();
  };

  return (
    <Modal
      isOpen={true}
      title={t('live.dashboard-changed-modal.title-dashboard-changed', 'Dashboard changed')}
      onDismiss={onDismiss}
      onClickBackdrop={() => {}}
      {...stylex.props(dashboardChangedModalStyles.modal)}
    >
      <div {...stylex.props(dashboardChangedModalStyles.description)}>
        <Trans i18nKey="live.dashboard-changed-modal.description">
          The dashboard has been updated by another session. Do you want to continue editing or discard your local
          changes?
        </Trans>
      </div>
      <Modal.ButtonRow>
        <Button onClick={onDismiss} variant="secondary" fill="outline">
          <Trans i18nKey="live.dashboard-changed-modal.continue-editing">Continue editing</Trans>
        </Button>
        <Button onClick={onDiscardChanges} variant="destructive">
          <Trans i18nKey="live.dashboard-changed-modal.discard-local-changes">Discard local changes</Trans>
        </Button>
      </Modal.ButtonRow>
    </Modal>
  );
}

