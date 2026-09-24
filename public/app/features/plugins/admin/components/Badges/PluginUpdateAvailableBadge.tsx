import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Trans } from '@grafana/i18n';
import { colors, typography } from '@grafana/ui/stylex/tokens.stylex';

import { type CatalogPlugin } from '../../types';

type Props = {
  plugin: CatalogPlugin;
};

export function PluginUpdateAvailableBadge({ plugin }: Props): React.ReactElement | null {
  return (
    <p {...stylex.props(styles.hasUpdate)}>
      <Trans i18nKey="plugins.plugin-update-available-badge.update-available">Update available!</Trans>
    </p>
  );
}

const styles = stylex.create({
  hasUpdate: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    marginBottom: 0,
  },
});
