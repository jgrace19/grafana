import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { pluginUpdateAvailableBadgeStyles } from './PluginUpdateAvailableBadge.stylex';
import * as React from 'react';

import { Trans } from '@grafana/i18n';

import { type CatalogPlugin } from '../../types';

type Props = {
  plugin: CatalogPlugin;
};

export function PluginUpdateAvailableBadge({ plugin }: Props): React.ReactElement | null {
  return (
    <p {...stylex.props(pluginUpdateAvailableBadgeStyles.hasUpdate)}>
      <Trans i18nKey="plugins.plugin-update-available-badge.update-available">Update available!</Trans>
    </p>
  );
}

export ;
