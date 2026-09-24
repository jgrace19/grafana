import * as stylex from '@stylexjs/stylex';
import { useCallback, useState } from 'react';
import { useAsync, useDebounce } from 'react-use';

import { Trans, t } from '@grafana/i18n';
import { Button, Icon, Input, Modal } from '@grafana/ui';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
import { getConnectedDashboards } from 'app/features/library-panels/state/api';

import { type LibraryPanelBehavior } from '../scene/LibraryPanelBehavior';

interface Props {
  libraryPanel: LibraryPanelBehavior;
  isUnsavedPrompt?: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
  onDiscard: () => void;
}

export const SaveLibraryVizPanelModal = ({ libraryPanel, isUnsavedPrompt, onDismiss, onConfirm, onDiscard }: Props) => {
  const [searchString, setSearchString] = useState('');
  const dashState = useAsync(async () => {
    const searchHits = await getConnectedDashboards(libraryPanel.state.uid);
    if (searchHits && searchHits.length > 0) {
      return searchHits.map((dash) => dash.name);
    }

    return [];
  }, [libraryPanel.state.uid]);

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

  const discardAndClose = useCallback(() => {
    onDiscard();
  }, [onDiscard]);

  const title = isUnsavedPrompt ? 'Unsaved library panel changes' : 'Save library panel';

  return (
    <Modal title={title} onDismiss={onDismiss} isOpen={true}>
      <div>
        <p {...stylex.props(styles.textInfo)}>
          <Trans
            i18nKey="dashboard-scene.save-library-viz-panel-modal.affected-dashboards"
            count={libraryPanel.state._loadedPanel?.meta?.connectedDashboards}
          >
            This update will affect <strong>{'{{count}}'} dashboards.</strong> The following dashboards using the panel
            will be affected:
          </Trans>
        </p>
        <Input
          className={stylex.props(styles.dashboardSearch).className}
          prefix={<Icon name="search" />}
          placeholder={t(
            'dashboard-scene.save-library-viz-panel-modal.placeholder-search-affected-dashboards',
            'Search affected dashboards'
          )}
          value={searchString}
          onChange={(e) => setSearchString(e.currentTarget.value)}
        />
        {dashState.loading ? (
          <p>
            <Trans i18nKey="dashboard-scene.save-library-viz-panel-modal.loading-connected-dashboards">
              Loading connected dashboards...
            </Trans>
          </p>
        ) : (
          <table {...stylex.props(styles.myTable)}>
            <thead {...stylex.props(styles.tableHead)}>
              <tr>
                <th {...stylex.props(styles.tableCell)}>
                  <Trans i18nKey="dashboard-scene.save-library-viz-panel-modal.dashboard-name">Dashboard name</Trans>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDashboards.map((dashName, i) => (
                <tr key={`dashrow-${i}`} {...stylex.props(styles.tableRow)}>
                  <td {...stylex.props(styles.tableCell)}>{dashName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Modal.ButtonRow>
          <Button variant="secondary" onClick={onDismiss} fill="outline">
            <Trans i18nKey="dashboard-scene.save-library-viz-panel-modal.cancel">Cancel</Trans>
          </Button>
          {isUnsavedPrompt && (
            <Button variant="destructive" onClick={discardAndClose}>
              <Trans i18nKey="dashboard-scene.save-library-viz-panel-modal.discard">Discard</Trans>
            </Button>
          )}
          <Button
            onClick={() => {
              onConfirm();
            }}
          >
            <Trans i18nKey="dashboard-scene.save-library-viz-panel-modal.update-all">Update all</Trans>
          </Button>
        </Modal.ButtonRow>
      </div>
    </Modal>
  );
};

// Keep in sync with getModalStyles in app/features/library-panels/styles.ts, used by the other library panel modals.
const styles = stylex.create({
  myTable: {
    maxHeight: '204px',
    overflowY: 'auto',
    marginTop: '11px',
    marginBottom: '28px',
    borderRadius: shape['--gf-shape-radius-default'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-action-hover'],
    backgroundColor: colors['--gf-colors-background-primary'],
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-h6-font-size'],
    width: '100%',
  },
  tableHead: {
    color: '#538ade',
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
  tableCell: {
    paddingTop: '6px',
    paddingRight: '13px',
    paddingBottom: '6px',
    paddingLeft: '13px',
    height: spacing['--gf-spacing-x4'],
  },
  tableRow: {
    backgroundColor: { default: null, ':nth-child(odd)': colors['--gf-colors-background-secondary'] },
  },
  textInfo: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-size-sm'],
  },
  dashboardSearch: {
    marginTop: spacing['--gf-spacing-x2'],
  },
});
