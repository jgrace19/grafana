import * as stylex from '@stylexjs/stylex';

import { Trans, t } from '@grafana/i18n';
import { Button, ModalsController, CollapsableSection, Stack, Icon, Box } from '@grafana/ui';
import { colors, typography } from '@grafana/ui/stylex/tokens.stylex';
import { type DecoratedRevisionModel } from 'app/features/dashboard/types/revisionModels';
import { DiffGroup } from 'app/features/dashboard-scene/settings/version-history/DiffGroup';
import { DiffViewer } from 'app/features/dashboard-scene/settings/version-history/DiffViewer';
import { jsonDiff } from 'app/features/dashboard-scene/settings/version-history/utils';

import { RevertDashboardModal } from './RevertDashboardModal';

type DiffViewProps = {
  isNewLatest: boolean;
  newInfo: DecoratedRevisionModel;
  baseInfo: DecoratedRevisionModel;
  diffData: { lhs: object; rhs: object };
};

export const VersionHistoryComparison = ({ baseInfo, newInfo, diffData, isNewLatest }: DiffViewProps) => {
  const diff = jsonDiff(diffData.lhs, diffData.rhs);

  return (
    <Stack direction="column" gap={1}>
      <Stack justifyContent="space-between" alignItems="center">
        <Stack alignItems="center">
          <span {...stylex.props(styles.versionInfo, styles.noMarginBottom)}>
            <Trans
              i18nKey="dashboard.version-history-comparison.old-updated-by"
              values={{ version: baseInfo.version, editor: baseInfo.createdBy, timeAgo: baseInfo.ageString }}
            >
              <strong>Version {'{{version}}'}</strong> updated by {'{{editor}}'} {'{{timeAgo}}'}
            </Trans>
            {baseInfo.message}
          </span>
          <Icon name="arrow-right" size="sm" />
          <span {...stylex.props(styles.versionInfo)}>
            <Trans
              i18nKey="dashboard.version-history-comparison.new-updated-by"
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
                    id: baseInfo.id,
                    version: baseInfo.version,
                    hideModal,
                  });
                }}
              >
                <Trans
                  i18nKey="dashboard.version-history-comparison.button-restore"
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
          label={t('dashboard.version-history-comparison.label-view-json-diff', 'View JSON diff')}
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

const styles = stylex.create({
  versionInfo: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
  noMarginBottom: {
    marginBottom: 0,
  },
});
