import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { versionHistoryHeaderStyles } from './VersionHistoryHeader.stylex';
import { noop } from 'lodash';

import { Trans, t } from '@grafana/i18n';
import {Icon, IconButton} from '@grafana/ui';

type VersionHistoryHeaderProps = {
  onClick?: () => void;
  baseVersion?: number;
  newVersion?: number;
  isNewLatest?: boolean;
};

export const VersionHistoryHeader = ({
  onClick = noop,
  baseVersion = 0,
  newVersion = 0,
  isNewLatest = false,
}: VersionHistoryHeaderProps) => {


  return (
    <h3 {...stylex.props(versionHistoryHeaderStyles.header)}>
      <IconButton
        name="arrow-left"
        size="xl"
        onClick={onClick}
        tooltip={t('dashboard-scene.version-history-header.tooltip-reset-version', 'Reset version')}
      />
      <span>
        <Trans i18nKey="dashboard-scene.version-history-header.compare-versions">
          Comparing {{ baseVersion }} <Icon name="arrows-h" /> {{ newVersion }}
        </Trans>{' '}
        {isNewLatest && (
          <cite className="muted">
            <Trans i18nKey="dashboard-scene.version-history-header.latest">(Latest)</Trans>
          </cite>
        )}
      </span>
    </h3>
  );
};

