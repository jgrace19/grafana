import * as stylex from '@stylexjs/stylex';
import { useCallback, useState } from 'react';
import { useAsync, useDebounce } from 'react-use';

import { Trans, t } from '@grafana/i18n';
import { Button, Icon, Input, Modal } from '@grafana/ui';

import { modalStyles as styles } from '../../modalStyles';
import { getConnectedDashboards } from '../../state/api';
import { type PanelModelWithLibraryPanel } from '../../types';
import { usePanelSave } from '../../utils/usePanelSave';

interface Props {
  panel: PanelModelWithLibraryPanel;
  folderUid: string;
  isUnsavedPrompt?: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
  onDiscard: () => void;
}

export const SaveLibraryPanelModal = ({
  panel,
  folderUid,
  isUnsavedPrompt,
  onDismiss,
  onConfirm,
  onDiscard,
}: Props) => {
  const [searchString, setSearchString] = useState('');
  const dashState = useAsync(async () => {
    const searchHits = await getConnectedDashboards(panel.libraryPanel.uid);
    if (searchHits && searchHits.length > 0) {
      return searchHits.map((dash) => dash.name);
    }

    return [];
  }, [panel.libraryPanel.uid]);

  const [filteredDashboards, setFilteredDashboards] = useState<string[]>([]);
  useDebounce(
    () => {
      if (!dashState.value) {
        return setFilteredDashboards([]);
      }

      return setFilteredDashboards(
        dashState.value.filter((dashName) => dashName.toLowerCase().includes(searchString.toLowerCase()))
      );
    },
    300,
    [dashState.value, searchString]
  );

  const { saveLibraryPanel } = usePanelSave();
  const discardAndClose = useCallback(() => {
    onDiscard();
  }, [onDiscard]);

  const title = isUnsavedPrompt ? 'Unsaved library panel changes' : 'Save library panel';

  return (
    <Modal title={title} onDismiss={onDismiss} isOpen={true}>
      <div>
        <p {...stylex.props(styles.textInfo)}>
          <Trans
            i18nKey="library-panels.save-library-panel-modal.num-affected"
            count={panel.libraryPanel.meta?.connectedDashboards}
          >
            This update will affect <strong>{'{{count}}'} dashboards.</strong>
          </Trans>
          <Trans i18nKey="library-panels.save-library-panel-modal.affected-dashboards">
            The following dashboards using the panel will be affected:
          </Trans>
        </p>
        <Input
          className={stylex.props(styles.dashboardSearch).className}
          prefix={<Icon name="search" />}
          placeholder={t(
            'library-panels.save-library-panel-modal.placeholder-search-affected-dashboards',
            'Search affected dashboards'
          )}
          value={searchString}
          onChange={(e) => setSearchString(e.currentTarget.value)}
        />
        {dashState.loading ? (
          <p>
            <Trans i18nKey="library-panels.save-library-panel-modal.loading-connected-dashboards">
              Loading connected dashboards...
            </Trans>
          </p>
        ) : (
          <table {...stylex.props(styles.myTable)}>
            <thead {...stylex.props(styles.myTableHead)}>
              <tr>
                <th {...stylex.props(styles.myTableCell)}>
                  <Trans i18nKey="library-panels.save-library-panel-modal.dashboard-name">Dashboard name</Trans>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDashboards.map((dashName, i) => (
                <tr key={`dashrow-${i}`} {...stylex.props(styles.myTableBodyRow)}>
                  <td {...stylex.props(styles.myTableCell)}>{dashName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Modal.ButtonRow>
          <Button variant="secondary" onClick={onDismiss} fill="outline">
            <Trans i18nKey="library-panels.save-library-panel-modal.cancel">Cancel</Trans>
          </Button>
          {isUnsavedPrompt && (
            <Button variant="destructive" onClick={discardAndClose}>
              <Trans i18nKey="library-panels.save-library-panel-modal.discard">Discard</Trans>
            </Button>
          )}
          <Button
            onClick={() => {
              saveLibraryPanel(panel, folderUid).then(() => {
                onConfirm();
              });
            }}
          >
            <Trans i18nKey="library-panels.save-library-panel-modal.update-all">Update all</Trans>
          </Button>
        </Modal.ButtonRow>
      </div>
    </Modal>
  );
};
