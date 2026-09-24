import * as stylex from '@stylexjs/stylex';
import { useCallback } from 'react';

import { type DataSourcePluginMeta } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { LinkButton } from '@grafana/ui';
import { spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
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
        <div {...stylex.props(styles.category)} key={id}>
          <div {...stylex.props(styles.header)} id={id}>
            {title}
          </div>
          <DataSourceTypeCardList dataSourcePlugins={plugins} onClickDataSourceType={onClickDataSourceType} />
        </div>
      ))}

      {/* Find more */}
      <div {...stylex.props(styles.more)}>
        <LinkButton variant="secondary" href={moreDataSourcesLink} onClick={handleClick} target="_self" rel="noopener">
          <Trans i18nKey="datasources.data-source-categories.find-more-data-source-plugins">
            Find more data source plugins
          </Trans>
        </LinkButton>
      </div>
    </>
  );
}

const styles = stylex.create({
  category: {
    marginBottom: spacing['--gf-spacing-x2'],
  },
  header: {
    fontSize: typography['--gf-typography-h5-font-size'],
    marginBottom: spacing['--gf-spacing-x1'],
  },
  more: {
    marginTop: spacing['--gf-spacing-x4'],
    marginRight: spacing['--gf-spacing-x4'],
    marginBottom: spacing['--gf-spacing-x4'],
    marginLeft: spacing['--gf-spacing-x4'],
    textAlign: 'center',
  },
});
