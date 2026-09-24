import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import * as React from 'react';
import Skeleton from 'react-loading-skeleton';

import { Trans, t } from '@grafana/i18n';
import { Checkbox, Button, Tag, ModalsController } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import { type DecoratedRevisionModel } from 'app/features/dashboard/types/revisionModels';
import { DashboardInteractions } from 'app/features/dashboard-scene/utils/interactions';

import { RevertDashboardModal } from './RevertDashboardModal';

import './VersionHistoryTable.css';

type VersionsTableProps = {
  versions: DecoratedRevisionModel[];
  canCompare: boolean;
  onCheck: (ev: React.FormEvent<HTMLInputElement>, versionId: number) => void;
  onRestore: (version: DecoratedRevisionModel) => Promise<boolean>;
  isLoadingUserDisplayNames?: boolean;
};

export const VersionHistoryTable = ({
  versions,
  canCompare,
  onCheck,
  onRestore,
  isLoadingUserDisplayNames,
}: VersionsTableProps) => {
  return (
    <div {...stylex.props(styles.margin)}>
      <table className={clsx('filter-table', 'gf-version-history-table')}>
        <thead>
          <tr>
            <th className="width-4"></th>
            <th className="width-4">
              <Trans i18nKey="dashboard-scene.version-history-table.version">Version</Trans>
            </th>
            <th className="width-14">
              <Trans i18nKey="dashboard-scene.version-history-table.date">Date</Trans>
            </th>
            <th className="width-10">
              <Trans i18nKey="dashboard-scene.version-history-table.updated-by">Updated by</Trans>
            </th>
            <th>
              <Trans i18nKey="dashboard-scene.version-history-table.notes">Notes</Trans>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {versions.map((version, idx) => (
            <tr key={version.id}>
              <td>
                <Checkbox
                  aria-label={t(
                    'dashboard-scene.version-history-table.aria-label-toggle-selection',
                    'Toggle selection of version {{version}}',
                    { version: version.version }
                  )}
                  xstyle={styles.checkbox}
                  checked={version.checked}
                  onChange={(ev) => onCheck(ev, version.id)}
                  disabled={!version.checked && canCompare}
                />
              </td>
              <td>{version.version}</td>
              <td>{version.createdDateString}</td>
              <td>{isLoadingUserDisplayNames ? <Skeleton width={100} /> : version.createdBy}</td>
              <td>{version.message}</td>
              <td className="text-right">
                {idx === 0 ? (
                  <Tag name={t('dashboard-scene.version-history-table.name-latest', 'Latest')} colorIndex={17} />
                ) : (
                  <ModalsController>
                    {({ showModal, hideModal }) => (
                      <Button
                        variant="secondary"
                        size="sm"
                        icon="history"
                        onClick={() => {
                          showModal(RevertDashboardModal, {
                            version,
                            hideModal,
                            onRestore,
                          });
                          DashboardInteractions.versionRestoreClicked({
                            version: version.version,
                            index: idx,
                            confirm: false,
                            version_date: new Date(version.created),
                          });
                        }}
                      >
                        <Trans i18nKey="dashboard-scene.version-history-table.restore">Restore</Trans>
                      </Button>
                    )}
                  </ModalsController>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// The table cells are styled by VersionHistoryTable.css.
const styles = stylex.create({
  checkbox: {
    display: 'inline',
  },
  margin: {
    marginBottom: spacing['--gf-spacing-x4'],
  },
});
