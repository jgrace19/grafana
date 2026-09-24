import * as stylex from '@stylexjs/stylex';
import Skeleton from 'react-loading-skeleton';

import { type DataSourceSettings } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { Card, LinkButton, Stack, Tag } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { ROUTES } from '../../connections/constants';
import { type DatasourceFailureDetails } from '../../connections/hooks/useDatasourceAdvisorChecks';
import { trackExploreClicked } from '../tracking';
import { constructDataSourceExploreUrl } from '../utils';

import { BuildDashboardButton } from './BuildDashboardButton';
import { DataSourceFailureBadge } from './DataSourceFailureBadge';

export interface Props {
  dataSource: DataSourceSettings;
  hasWriteRights: boolean;
  hasExploreRights: boolean;
  failure?: DatasourceFailureDetails;
}

export function DataSourcesListCard({ dataSource, hasWriteRights, hasExploreRights, failure }: Props) {
  const dsLink = config.appSubUrl + ROUTES.DataSourcesEdit.replace(/:uid/gi, dataSource.uid);

  return (
    <Card noMargin href={hasWriteRights ? dsLink : undefined}>
      <Card.Heading>{dataSource.name}</Card.Heading>
      <Card.Figure>
        <img src={dataSource.typeLogoUrl} alt="" height="40px" width="40px" {...stylex.props(styles.logo)} />
      </Card.Figure>
      <Card.Meta>
        {[
          dataSource.typeName,
          dataSource.url,
          dataSource.isDefault && <Tag key="default-tag" name={'default'} colorIndex={1} />,
          failure?.severity && (
            <DataSourceFailureBadge key="unhealthy-badge" severity={failure.severity} message={failure.message} />
          ),
        ]}
      </Card.Meta>
      <Card.Tags>
        {/* Build Dashboard */}
        <BuildDashboardButton dataSource={dataSource} size="md" fill="outline" context="datasource_list" />

        {/* Explore */}
        {hasExploreRights && (
          <LinkButton
            icon="compass"
            fill="outline"
            variant="secondary"
            className={stylex.props(styles.button).className}
            href={constructDataSourceExploreUrl(dataSource)}
            onClick={() => {
              trackExploreClicked({
                grafana_version: config.buildInfo.version,
                datasource_uid: dataSource.uid,
                plugin_name: dataSource.typeName,
                path: window.location.pathname,
              });
            }}
          >
            <Trans i18nKey="datasources.data-sources-list-card.explore">Explore</Trans>
          </LinkButton>
        )}
      </Card.Tags>
    </Card>
  );
}

function DataSourcesListCardSkeleton({ hasExploreRights }: Pick<Props, 'hasExploreRights'>) {
  return (
    <Card noMargin>
      <Card.Heading>
        <Skeleton width={140} />
      </Card.Heading>
      <Card.Figure>
        <Skeleton width={40} height={40} containerClassName={stylex.props(styles.skeleton).className} />
      </Card.Figure>
      <Card.Meta>
        <Skeleton width={120} />
      </Card.Meta>
      <Card.Tags>
        <Stack direction="row" gap={2}>
          <Skeleton height={32} width={179} containerClassName={stylex.props(styles.skeleton).className} />

          {/* Explore */}
          {hasExploreRights && (
            <Skeleton height={32} width={107} containerClassName={stylex.props(styles.skeleton).className} />
          )}
        </Stack>
      </Card.Tags>
    </Card>
  );
}

DataSourcesListCard.Skeleton = DataSourcesListCardSkeleton;

const styles = stylex.create({
  skeleton: {
    lineHeight: 1,
  },
  logo: {
    objectFit: 'contain',
  },
  button: {
    marginLeft: spacing['--gf-spacing-x2'],
  },
});
