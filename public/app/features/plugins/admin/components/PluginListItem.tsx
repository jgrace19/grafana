import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { pluginListItemStyles } from './PluginListItem.stylex';
import Skeleton from 'react-loading-skeleton';

import { Trans, t } from '@grafana/i18n';
import { locationService, reportInteraction } from '@grafana/runtime';
import { Badge, Icon, Stack } from '@grafana/ui';
import { type SkeletonComponent, attachSkeleton } from '@grafana/ui/unstable';

import { type CatalogPlugin, PluginIconName } from '../types';

import { PluginListItemBadges } from './PluginListItemBadges';
import { PluginLogo } from './PluginLogo';

export const LOGO_SIZE = '48px';

type Props = {
  plugin: CatalogPlugin;
  pathName: string;
};

function PluginListItemComponent({ plugin, pathName }: Props) {

  const reportUserClickInteraction = () => {
    if (locationService.getSearchObject()?.q) {
      reportInteraction('plugins_search_user_click', {
        plugin_id: plugin.id,
        creator_team: 'grafana_plugins_catalog',
        schema_version: '1.0.0',
      });
    }
  };
  return (
    <a href={`${pathName}/${plugin.id}`} {...mergeStylexClassName(stylex.props(pluginListItemStyles.container, ), undefined)} onClick={reportUserClickInteraction}>
      <PluginLogo src={plugin.info.logos.small} {...stylex.props(pluginListItemStyles.pluginLogo)} height={LOGO_SIZE} alt="" />
      <h2 {...mergeStylexClassName(stylex.props(pluginListItemStyles.name, 'plugin-name'), undefined)}>{plugin.name}</h2>
      <div {...mergeStylexClassName(stylex.props(pluginListItemStyles.content, 'plugin-content'), undefined)}>
        <p>
          <Trans i18nKey="plugins.plugin-list-item.label-author" values={{ author: plugin.orgName }}>
            By {'{{author}}'}
          </Trans>
        </p>
        <PluginListItemBadges plugin={plugin} />
      </div>
      <div {...stylex.props(pluginListItemStyles.pluginType)}>
        {plugin.type && (
          <Icon
            name={PluginIconName[plugin.type]}
            title={t('plugins.plugin-list-item.title-icon-plugin-type', '{{pluginType}} plugin', {
              pluginType: plugin.type,
            })}
          />
        )}
      </div>
    </a>
  );
}

const PluginListItemSkeleton: SkeletonComponent = ({ rootProps }) => {

  return (
    <div {...mergeStylexClassName(stylex.props(pluginListItemStyles.container, ), undefined)} {...rootProps}>
      <Skeleton
        containerClassName={cx(
          pluginListItemStyles.pluginLogo,
          css({
            lineHeight: 1,
          })
        )}
        width={LOGO_SIZE}
        height={LOGO_SIZE}
      />
      <h2 {...stylex.props(pluginListItemStyles.name)}>
        <Skeleton width={100} />
      </h2>
      <div {...stylex.props(pluginListItemStyles.content)}>
        <p>
          <Skeleton width={120} />
        </p>
        <Stack direction="row">
          <Badge.Skeleton />
          <Badge.Skeleton />
        </Stack>
      </div>
      <div {...stylex.props(pluginListItemStyles.pluginType)}>
        <Skeleton width={16} height={16} />
      </div>
    </div>
  );
};

export const PluginListItem = attachSkeleton(PluginListItemComponent, PluginListItemSkeleton);

// Styles shared between the different type of list items
export ;
