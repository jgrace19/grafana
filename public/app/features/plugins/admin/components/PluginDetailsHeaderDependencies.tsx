import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Trans } from '@grafana/i18n';
import { Icon, Stack } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { type CatalogPlugin, PluginIconName } from '../types';

type Props = {
  plugin: CatalogPlugin;
  grafanaDependency?: string;
  className?: string;
};

export function PluginDetailsHeaderDependencies({ plugin, grafanaDependency }: Props): React.ReactElement | null {
  const pluginDependencies = plugin.details?.pluginDependencies;
  const hasNoDependencyInfo = !grafanaDependency && (!pluginDependencies || !pluginDependencies.length);

  if (hasNoDependencyInfo) {
    return null;
  }

  return (
    <Stack gap={1}>
      {/* Grafana dependency */}
      {Boolean(grafanaDependency) && (
        <div {...stylex.props(styles.depBadge)}>
          <Icon name="grafana" xstyle={styles.icon} />
          <Trans i18nKey="plugins.plugin-details-header-dependencies.grafana-dependency">
            Grafana {{ grafanaDependency }}
          </Trans>
        </div>
      )}

      {/* Plugin dependencies */}
      {pluginDependencies && pluginDependencies.length > 0 && (
        <div>
          {pluginDependencies.map((p) => {
            return (
              <span {...stylex.props(styles.depBadge)} key={p.name}>
                <Icon name={PluginIconName[p.type]} xstyle={styles.icon} />
                {p.name} {p.version}
              </span>
            );
          })}
        </div>
      )}
    </Stack>
  );
}

const styles = stylex.create({
  depBadge: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  icon: {
    color: colors['--gf-colors-text-secondary'],
    marginRight: spacing['--gf-spacing-x0-5'],
  },
});
