import * as stylex from '@stylexjs/stylex';
import Skeleton from 'react-loading-skeleton';

import { Trans, t } from '@grafana/i18n';
import { locationService, reportInteraction } from '@grafana/runtime';
import { Badge, Icon, Stack, useTheme2 } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { easings, motion, durations } from '@grafana/ui/stylex/constants.stylex';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
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
  const theme = useTheme2();
  const hoverBackground = theme.colors.emphasize(theme.colors.background.secondary, 0.03);

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
    <a
      href={`${pathName}/${plugin.id}`}
      {...stylex.props(styles.container, styles.hoverBackground(hoverBackground))}
      onClick={reportUserClickInteraction}
    >
      <PluginLogo
        src={plugin.info.logos.small}
        className={stylex.props(styles.pluginLogo).className}
        height={LOGO_SIZE}
        alt=""
      />
      <h2 {...mergeStylexProps(stylex.props(styles.name), { className: 'plugin-name' })}>{plugin.name}</h2>
      <div {...mergeStylexProps(stylex.props(styles.content), { className: 'plugin-content' })}>
        <p>
          <Trans i18nKey="plugins.plugin-list-item.label-author" values={{ author: plugin.orgName }}>
            By {'{{author}}'}
          </Trans>
        </p>
        <PluginListItemBadges plugin={plugin} />
      </div>
      <div {...stylex.props(styles.pluginType)}>
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
    <div {...stylex.props(styles.container)} {...rootProps}>
      <Skeleton
        containerClassName={stylex.props(styles.pluginLogo, styles.skeletonLogo).className}
        width={LOGO_SIZE}
        height={LOGO_SIZE}
      />
      <h2 {...stylex.props(styles.name)}>
        <Skeleton width={100} />
      </h2>
      <div {...stylex.props(styles.content)}>
        <p>
          <Skeleton width={120} />
        </p>
        <Stack direction="row">
          <Badge.Skeleton />
          <Badge.Skeleton />
        </Stack>
      </div>
      <div {...stylex.props(styles.pluginType)}>
        <Skeleton width={16} height={16} />
      </div>
    </div>
  );
};

export const PluginListItem = attachSkeleton(PluginListItemComponent, PluginListItemSkeleton);

const styles = stylex.create({
  container: {
    display: 'grid',
    gridTemplateColumns: `${LOGO_SIZE} 1fr ${spacing['--gf-spacing-x3']}`,
    gridTemplateRows: 'auto',
    gap: spacing['--gf-spacing-x2'],
    gridAutoFlow: 'row',
    backgroundColor: colors['--gf-colors-background-secondary'],
    borderRadius: shape['--gf-shape-radius-default'],
    paddingTop: spacing['--gf-spacing-x3'],
    paddingRight: spacing['--gf-spacing-x3'],
    paddingBottom: spacing['--gf-spacing-x3'],
    paddingLeft: spacing['--gf-spacing-x3'],
    transitionProperty: {
      default: null,
      [motion.noPreferenceOrReduce]: 'background-color, box-shadow, border-color, color',
    },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: durations.short },
    transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: easings.easeInOut },
  },
  hoverBackground: (hover: string) => ({
    backgroundColor: { default: colors['--gf-colors-background-secondary'], ':hover': hover },
  }),
  pluginType: {
    gridColumnEnd: '4',
    gridColumnStart: '3',
    gridRowEnd: '2',
    gridRowStart: '1',
    color: colors['--gf-colors-text-secondary'],
  },
  pluginLogo: {
    gridColumnEnd: '2',
    gridColumnStart: '1',
    gridRowEnd: '3',
    gridRowStart: '1',
    maxWidth: '100%',
    alignSelf: 'center',
    objectFit: 'contain',
  },
  skeletonLogo: {
    lineHeight: 1,
  },
  content: {
    gridColumnEnd: '3',
    gridColumnStart: '1',
    gridRowEnd: '4',
    gridRowStart: '3',
    color: colors['--gf-colors-text-secondary'],
  },
  name: {
    gridColumnEnd: '3',
    gridColumnStart: '2',
    gridRowEnd: '3',
    gridRowStart: '1',
    alignSelf: 'center',
    fontSize: typography['--gf-typography-h4-font-size'],
    color: colors['--gf-colors-text-primary'],
    margin: 0,
    wordBreak: 'normal',
    overflowWrap: 'anywhere',
  },
});
