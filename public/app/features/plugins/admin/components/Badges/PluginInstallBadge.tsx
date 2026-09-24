import * as React from 'react';

import { t } from '@grafana/i18n';
import { Badge } from '@grafana/ui';

import { badgeColorStyle } from './sharedStyles';

export function PluginInstalledBadge(): React.ReactElement {
  return (
    <Badge
      text={t('plugins.plugin-installed-badge.text-installed', 'Installed')}
      color="orange"
      style={badgeColorStyle}
    />
  );
}
