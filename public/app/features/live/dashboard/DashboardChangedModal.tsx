import { css } from '@emotion/css';
import * as stylex from '@stylexjs/stylex';

import { Trans, t } from '@grafana/i18n';
import { locationService } from '@grafana/runtime';
import { Button, Modal, useStyles2 } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { dashboardWatcher } from './dashboardWatcher';
import { type DashboardEvent, DashboardEventAction } from './types';

interface Props {
  event?: DashboardEvent;
  onDismiss: () => void;
}

export function DashboardChangedModal({ onDismiss, event }: Props) {
  const pendingStyles = useStyles2(getPendingStyles);

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
      className={pendingStyles.modal}
    >
      <div {...stylex.props(styles.description)}>
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

// stylex: pending Modal migration
const getPendingStyles = () => ({
  modal: css({ width: '600px' }),
});

const styles = stylex.create({
  description: {
    color: colors['--gf-colors-text-secondary'],
    paddingBottom: spacing['--gf-spacing-x1'],
  },
});
