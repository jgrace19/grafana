import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { repositoryOverviewStyles } from './RepositoryOverview.stylex';
import { useBooleanFlagValue } from '@openfeature/react-sdk';
import { useMemo } from 'react';

import { Trans } from '@grafana/i18n';
import { Box, Card, type CellProps, Grid, InteractiveTable, LinkButton, Stack, Text } from '@grafana/ui';
import { type Repository, type ResourceCount } from 'app/api/clients/provisioning/v0alpha1';

import { RecentJobs } from '../Job/RecentJobs';
import { QuotaLimitNote } from '../Shared/QuotaLimitNote';
import { MissingFolderMetadataBanner } from '../components/Folders/MissingFolderMetadataBanner';
import { hasMissingFolderMetadata } from '../utils/folderMetadata';
import { isQuotaReachedOrExceeded } from '../utils/quota';
import { formatTimestamp } from '../utils/time';

import { RepositoryHealthCard } from './RepositoryHealthCard';
import { RepositoryPullStatusCard } from './RepositoryPullStatusCard';

type StatCell<T extends keyof ResourceCount = keyof ResourceCount> = CellProps<ResourceCount, ResourceCount[T]>;

function getColumnCount(hasWebhook: boolean): { xxlColumn: 5 | 4; lgColumn: 3 | 2 } {
  return {
    xxlColumn: hasWebhook ? 5 : 4,
    lgColumn: hasWebhook ? 3 : 2,
  };
}

export function RepositoryOverview({ repo }: { repo: Repository }) {
  const repoName = repo.metadata?.name ?? '';
  const showFolderMetadataCheck = useBooleanFlagValue('provisioningFolderMetadata', false);

  const status = repo.status;
  const { conditions, quota } = status ?? {};
  const webhookURL = getWebhookURL(repo);
  const { lgColumn, xxlColumn } = getColumnCount(Boolean(status?.webhook));

  const resourceColumns = useMemo(
    () => [
      {
        id: 'Resource',
        header: 'Resource Type',
        cell: ({ row: { original } }: StatCell<'resource'>) => {
          return <span>{original.resource}</span>;
        },
        size: 'auto',
      },
      {
        id: 'count',
        header: 'Count',
        cell: ({ row: { original } }: StatCell<'count'>) => {
          return <span>{original.count}</span>;
        },
        size: 100,
      },
    ],
    []
  );
  return (
    <Box padding={2}>
      <Stack direction="column" gap={2}>
        {showFolderMetadataCheck && hasMissingFolderMetadata(conditions) && (
          <MissingFolderMetadataBanner repositoryName={repoName} variant="repo" />
        )}
        <Grid columns={{ xs: 1, sm: 2, lg: lgColumn, xxl: xxlColumn }} gap={2} alignItems={'flex-start'}>
          <div {...stylex.props(repositoryOverviewStyles.cardContainer)}>
            <Card noMargin {...stylex.props(repositoryOverviewStyles.card)}>
              <Card.Heading>
                <Trans i18nKey="provisioning.repository-overview.resources">Resources</Trans>
              </Card.Heading>
              <Card.Description>
                {status?.stats ? (
                  <InteractiveTable
                    columns={resourceColumns}
                    data={status.stats}
                    getRowId={(r: ResourceCount) => `${r.group}-${r.resource}`}
                  />
                ) : null}
                {isQuotaReachedOrExceeded(conditions, 'ResourceQuota') && (
                  <Box paddingTop={2}>
                    <QuotaLimitNote maxResourcesPerRepository={quota?.maxResourcesPerRepository} />
                  </Box>
                )}
              </Card.Description>
              <Card.Actions {...stylex.props(repositoryOverviewStyles.actions)}>
                <LinkButton size="md" href={getFolderURL(repo)} icon="folder-open" variant="secondary">
                  <Trans i18nKey="provisioning.repository-overview.view-folder">View Folder</Trans>
                </LinkButton>
              </Card.Actions>
            </Card>
          </div>

          {status?.health && (
            <div {...stylex.props(repositoryOverviewStyles.cardContainer)}>
              <RepositoryHealthCard repo={repo} />
            </div>
          )}

          {/* Webhook */}
          {status?.webhook && (
            <div {...stylex.props(repositoryOverviewStyles.cardContainer)}>
              <Card noMargin {...stylex.props(repositoryOverviewStyles.card)}>
                <Card.Heading>
                  <Trans i18nKey="provisioning.repository-overview.webhook">Webhook</Trans>
                </Card.Heading>
                <Card.Description>
                  <Grid columns={12} gap={1} alignItems="baseline">
                    <div {...stylex.props(repositoryOverviewStyles.labelColumn)}>
                      <Text color="secondary">
                        <Trans i18nKey="provisioning.repository-overview.webhook-id">ID:</Trans>
                      </Text>
                    </div>
                    <div {...stylex.props(repositoryOverviewStyles.valueColumn)}>
                      <Text variant="body">{status?.webhook?.id ?? 'N/A'}</Text>
                    </div>
                    <div {...stylex.props(repositoryOverviewStyles.labelColumn)}>
                      <Text color="secondary">
                        <Trans i18nKey="provisioning.repository-overview.webhook-events">Events:</Trans>
                      </Text>
                    </div>
                    <div {...stylex.props(repositoryOverviewStyles.valueColumn)}>
                      <Text variant="body">{status?.webhook?.subscribedEvents?.join(', ') ?? 'N/A'}</Text>
                    </div>
                    <div {...stylex.props(repositoryOverviewStyles.labelColumn)}>
                      <Text color="secondary">
                        <Trans i18nKey="provisioning.repository-overview.webhook-last-event">Last Event:</Trans>
                      </Text>
                    </div>
                    <div {...stylex.props(repositoryOverviewStyles.valueColumn)}>
                      <Text variant="body">{formatTimestamp(status?.webhook?.lastEvent)}</Text>
                    </div>
                  </Grid>
                </Card.Description>
                {webhookURL && (
                  <Card.Actions {...stylex.props(repositoryOverviewStyles.actions)}>
                    <LinkButton fill="outline" href={webhookURL} icon="external-link-alt">
                      <Trans i18nKey="provisioning.repository-overview.webhook-url">View Webhook</Trans>
                    </LinkButton>
                  </Card.Actions>
                )}
              </Card>
            </div>
          )}

          {/* Pull status */}
          <div
            {...mergeStylexClassName(stylex.props(repositoryOverviewStyles.pullStatusCard, 
              ,
              status?.webhook ? repositoryOverviewStyles.pullStatusCardLgSpan3 : repositoryOverviewStyles.pullStatusCardLgSpan2
            ), undefined)}
          >
            <RepositoryPullStatusCard repo={repo} />
          </div>
        </Grid>

        <div {...stylex.props(repositoryOverviewStyles.cardContainer)}>
          <RecentJobs repo={repo} />
        </div>
      </Stack>
    </Box>
  );
}

function getFolderURL(repo: Repository) {
  if (repo.spec?.sync.target === 'folder') {
    return `/dashboards/f/${repo.metadata?.name}`;
  }
  return '/dashboards';
}

;

function getWebhookURL(repo: Repository) {
  const { status, spec } = repo;
  if (spec?.type === 'github' && status?.webhook?.url && spec.github?.url) {
    return `${spec.github.url}/settings/hooks/${status.webhook?.id}`;
  }
  return undefined;
}
