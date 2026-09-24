import * as stylex from '@stylexjs/stylex';
import { type FC, useEffect, useMemo, useReducer } from 'react';

import { LoadingState } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { Button, Modal } from '@grafana/ui';

import { modalStyles as styles } from '../../modalStyles';
import { modalWidthClassName } from '../../styles';
import { type LibraryElementDTO } from '../../types';
import { asyncDispatcher } from '../LibraryPanelsView/actions';

import { getConnectedDashboards } from './actions';
import { deleteLibraryPanelModalReducer, initialDeleteLibraryPanelModalState } from './reducer';

interface Props {
  libraryPanel: LibraryElementDTO;
  onConfirm: () => void;
  onDismiss: () => void;
}

export const DeleteLibraryPanelModal: FC<Props> = ({ libraryPanel, onDismiss, onConfirm }) => {
  const [{ dashboardTitles, loadingState }, dispatch] = useReducer(
    deleteLibraryPanelModalReducer,
    initialDeleteLibraryPanelModalState
  );
  const asyncDispatch = useMemo(() => asyncDispatcher(dispatch), [dispatch]);
  useEffect(() => {
    asyncDispatch(getConnectedDashboards(libraryPanel));
  }, [asyncDispatch, libraryPanel]);

  const connected = Boolean(dashboardTitles.length);
  const done = loadingState === LoadingState.Done;

  return (
    <Modal
      className={modalWidthClassName}
      title={t('library-panels.delete-library-panel-modal.title-delete-library-panel', 'Delete library panel')}
      onDismiss={onDismiss}
      isOpen={true}
    >
      {!done ? <LoadingIndicator /> : null}
      {done ? (
        <div>
          {connected ? <HasConnectedDashboards dashboardTitles={dashboardTitles} /> : null}
          {!connected ? <Confirm /> : null}

          <Modal.ButtonRow>
            <Button variant="secondary" onClick={onDismiss} fill="outline">
              <Trans i18nKey="library-panels.delete-library-panel-modal.cancel">Cancel</Trans>
            </Button>
            <Button variant="destructive" onClick={onConfirm} disabled={connected}>
              <Trans i18nKey="library-panels.delete-library-panel-modal.delete">Delete</Trans>
            </Button>
          </Modal.ButtonRow>
        </div>
      ) : null}
    </Modal>
  );
};

const LoadingIndicator = () => (
  <span>
    <Trans i18nKey="library-panels.loading-indicator.loading-library-panel">Loading library panel...</Trans>
  </span>
);

const Confirm = () => {
  return (
    <div {...stylex.props(styles.modalText)}>
      <Trans i18nKey="library-panels.confirm.delete-panel">Do you want to delete this panel?</Trans>
    </div>
  );
};

const HasConnectedDashboards: FC<{ dashboardTitles: string[] }> = ({ dashboardTitles }) => {
  const suffix = dashboardTitles.length === 1 ? 'dashboard.' : 'dashboards.';
  const message = `${dashboardTitles.length} ${suffix}`;
  if (dashboardTitles.length === 0) {
    return null;
  }

  return (
    <div>
      <p {...stylex.props(styles.textInfo)}>
        {'This library panel can not be deleted because it is connected to '}
        <strong>{message}</strong>
        {' Remove the library panel from the dashboards listed below and retry.'}
      </p>
      <table {...stylex.props(styles.myTable)}>
        <thead {...stylex.props(styles.myTableHead)}>
          <tr>
            <th {...stylex.props(styles.myTableCell)}>
              <Trans i18nKey="library-panels.has-connected-dashboards.dashboard-name">Dashboard name</Trans>
            </th>
          </tr>
        </thead>
        <tbody>
          {dashboardTitles.map((title, i) => (
            <tr key={`dash-title-${i}`} {...stylex.props(styles.myTableBodyRow)}>
              <td {...stylex.props(styles.myTableCell)}>{title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
