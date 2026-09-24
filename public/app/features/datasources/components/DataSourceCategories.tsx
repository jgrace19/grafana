import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { dataSourceCategoriesStyles } from './DataSourceCategories.stylex';
import { useCallback } from 'react';

import { type DataSourcePluginMeta, type GrafanaTheme2 } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { LinkButton } from '@grafana/ui';
import { type DataSourcePluginCategory } from 'app/types/datasources';

import { ROUTES } from '../../connections/constants';

import { DataSourceTypeCardList } from './DataSourceTypeCardList';

export type Props = {
  // The list of data-source plugin categories to display
  categories: DataSourcePluginCategory[];

  // Called when a data-source plugin is clicked on in the list
  onClickDataSourceType: (dataSource: DataSourcePluginMeta) => void;
};

export function DataSourceCategories({ categories, onClickDataSourceType }: Props) {
  const moreDataSourcesLink = `${ROUTES.AddNewConnection}?cat=data-source`;

  const handleClick = useCallback(() => {
    reportInteraction('connections_add_datasource_find_more_ds_plugins_clicked', {
      targetPath: moreDataSourcesLink,
      path: window.location.pathname,
      creator_team: 'grafana_plugins_catalog',
      schema_version: '1.0.0',
    });
  }, [moreDataSourcesLink]);

  return (
    <>
      {/* Categories */}
      {categories.map(({ id, title, plugins }) => (
        <div {...stylex.props(dataSourceCategoriesStyles.category)} key={id}>
          <div {...stylex.props(dataSourceCategoriesStyles.header)} id={id}>
            {title}
          </div>
          <DataSourceTypeCardList dataSourcePlugins={plugins} onClickDataSourceType={onClickDataSourceType} />
        </div>
      ))}

      {/* Find more */}
      <div {...stylex.props(dataSourceCategoriesStyles.more)}>
        <LinkButton variant="secondary" href={moreDataSourcesLink} onClick={handleClick} target="_self" rel="noopener">
          <Trans i18nKey="datasources.data-source-categories.find-more-data-source-plugins">
            Find more data source plugins
          </Trans>
        </LinkButton>
      </div>
    </>
  );
}

