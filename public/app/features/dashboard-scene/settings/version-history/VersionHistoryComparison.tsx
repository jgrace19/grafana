import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { versionHistoryComparisonStyles } from './VersionHistoryComparison.stylex';

import { Trans, t } from '@grafana/i18n';
import {Button, ModalsController, CollapsableSection, Stack, Icon, Box} from '@grafana/ui';
import { type DecoratedRevisionModel } from 'app/features/dashboard/types/revisionModels';

import { DiffGroup } from './DiffGroup';
import { DiffViewer } from './DiffViewer';
import { RevertDashboardModal } from './RevertDashboardModal';
import { jsonDiff } from './utils';

type DiffViewProps = {
  isNewLatest: boolean;
  newInfo: DecoratedRevisionModel;
  baseInfo: DecoratedRevisionModel;
  diffData: { lhs: object; rhs: object };
  onRestore: (version: DecoratedRevisionModel) => Promise<boolean>;
};

export const VersionHistoryComparison = ({ baseInfo, newInfo, diffData, isNewLatest, onRestore }: DiffViewProps) => {
  const diff = jsonDiff(diffData.lhs, diffData.rhs);


  return (
    <Stack direction="column" gap={1}>
      <Stack justifyContent="space-between" alignItems="center">
        <Stack alignItems="center">
          <span {...mergeStylexClassName(stylex.props(versionHistoryComparisonStyles.versionInfo), clsx(versionHistoryComparisonStyles.noMarginBottom))}>
            <Trans
              i18nKey="dashboard-scene.version-history-comparison.old-version-updated"
              values={{ version: baseInfo.version, editor: baseInfo.createdBy, timeAgo: baseInfo.ageString }}
            >
              <strong>Version {'{{version}}'}</strong> updated by {'{{editor}}'} {'{{timeAgo}}'}
            </Trans>
            {baseInfo.message}
          </span>
          <Icon name="arrow-right" size="sm" />
          <span {...stylex.props(versionHistoryComparisonStyles.versionInfo)}>
            <Trans
              i18nKey="dashboard-scene.version-history-comparison.new-version-updated"
              values={{ version: newInfo.version, editor: newInfo.createdBy, timeAgo: newInfo.ageString }}
            >
              <strong>Version {'{{version}}'}</strong> updated by {'{{editor}}'} {'{{timeAgo}}'}
            </Trans>
            {newInfo.message}
          </span>
        </Stack>
        {isNewLatest && (
          <ModalsController>
            {({ showModal, hideModal }) => (
              <Button
                variant="destructive"
                icon="history"
                onClick={() => {
                  showModal(RevertDashboardModal, {
                    version: baseInfo,
                    onRestore,
                    hideModal,
                  });
                }}
              >
                <Trans
                  i18nKey="dashboard-scene.version-history.comparison.button-restore"
                  values={{ version: baseInfo.version }}
                >
                  Restore to version {'{{version}}'}
                </Trans>
              </Button>
            )}
          </ModalsController>
        )}
      </Stack>

      {Object.entries(diff).map(([key, diffs]) => (
        <DiffGroup diffs={diffs} key={key} title={key} />
      ))}

      <Box paddingTop={2}>
        <CollapsableSection
          isOpen={false}
          label={t('dashboard-scene.version-history-comparison.label-view-json-diff', 'View JSON diff')}
        >
          <DiffViewer
            oldValue={JSON.stringify(diffData.lhs, null, 2)}
            newValue={JSON.stringify(diffData.rhs, null, 2)}
          />
        </CollapsableSection>
      </Box>
    </Stack>
  );
};

