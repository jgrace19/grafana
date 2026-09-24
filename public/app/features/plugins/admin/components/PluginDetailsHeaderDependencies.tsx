import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { pluginDetailsHeaderDependenciesStyles } from './PluginDetailsHeaderDependencies.stylex';
import * as React from 'react';

import { Trans } from '@grafana/i18n';
import { Icon, Stack } from '@grafana/ui';

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
        <div {...stylex.props(pluginDetailsHeaderDependenciesStyles.depBadge)}>
          <Icon name="grafana" {...stylex.props(pluginDetailsHeaderDependenciesStyles.icon)} />
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
              <span {...stylex.props(pluginDetailsHeaderDependenciesStyles.depBadge)} key={p.name}>
                <Icon name={PluginIconName[p.type]} {...stylex.props(pluginDetailsHeaderDependenciesStyles.icon)} />
                {p.name} {p.version}
              </span>
            );
          })}
        </div>
      )}
    </Stack>
  );
}

export ;
