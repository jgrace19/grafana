import * as stylex from '@stylexjs/stylex';

import { t, Trans } from '@grafana/i18n';
import { Badge, Card, Grid, Text, TextLink } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import { type Repository, type RepositorySpec } from 'app/api/clients/provisioning/v0alpha1';

import { MessageList } from '../Shared/MessageList';
import { formatRepoUrl, getRepoCommitUrl, getRepoHrefForProvider } from '../utils/git';
import { getStatusColor, getStatusIcon } from '../utils/repositoryStatus';
import { formatTimestamp } from '../utils/time';

import { SyncRepository } from './SyncRepository';

export function RepositoryPullStatusCard({ repo }: { repo: Repository }) {
  const status = repo.status;
  const statusColor = getStatusColor(status?.sync.state);
  const statusIcon = getStatusIcon(status?.sync.state);

  const isWorking = status?.sync.state === 'working' || status?.sync.state === 'pending';

  const spec = repo.spec;
  const remoteConfig = getRemoteConfig(spec);
  const repoUrl = remoteConfig?.url;
  const branch = remoteConfig?.branch;
  const path = remoteConfig?.path ?? spec?.local?.path;
  const repoHref = getRepoHrefForProvider(repo.spec);

  const { url: lastCommitUrl, hasUrl } = getRepoCommitUrl(repo.spec, status?.sync.lastRef);

  return (
    <Card noMargin xstyle={cardStyles.card}>
      <Card.Heading>
        <Trans i18nKey="provisioning.repository-overview.pull-status">Pull status</Trans>
      </Card.Heading>
      <Card.Description>
        <Grid columns={3} gap={1} alignItems="baseline">
          {/* Status */}
          <Text color="secondary">
            <Trans i18nKey="provisioning.repository-overview.status">Status:</Trans>
          </Text>
          <div {...stylex.props(styles.spanTwo)}>
            <Badge icon={statusIcon} color={statusColor} text={status?.sync.state ?? 'N/A'} />
          </div>

          {/* Job ID */}
          <Text color="secondary">
            <Trans i18nKey="provisioning.repository-overview.job-id">Job ID:</Trans>
          </Text>
          <div {...stylex.props(styles.spanTwo)}>
            <Text variant="body">{status?.sync.job ?? 'N/A'}</Text>
          </div>

          <div
            {...stylex.props(styles.historicalData, isWorking && styles.historicalDataOverlay)}
            aria-busy={isWorking}
          >
            {/* Last Ref */}
            <Text color="secondary">
              <Trans i18nKey="provisioning.repository-overview.last-ref">Last Ref:</Trans>
            </Text>
            <div {...stylex.props(styles.spanTwo)}>
              {hasUrl && lastCommitUrl ? (
                <TextLink href={lastCommitUrl} external>
                  {status?.sync.lastRef
                    ? status.sync.lastRef.substring(0, 7)
                    : t('provisioning.repository-overview.not-available', 'N/A')}
                </TextLink>
              ) : (
                <Text variant="body">
                  {status?.sync.lastRef
                    ? status.sync.lastRef.substring(0, 7)
                    : t('provisioning.repository-overview.not-available', 'N/A')}
                </Text>
              )}
            </div>

            <Text color="secondary">
              <Trans i18nKey="provisioning.repository-overview.finished">Last successful pull:</Trans>
            </Text>
            <div {...stylex.props(styles.spanTwo)}>
              <Text variant="body">{formatTimestamp(status?.sync.finished)}</Text>
            </div>

            {!!status?.sync?.message?.length && (
              <>
                <Text color="secondary">
                  <Trans i18nKey="provisioning.repository-overview.messages">Messages:</Trans>
                </Text>
                <div {...stylex.props(styles.spanTwo)}>
                  <MessageList messages={status.sync.message} variant="body" />
                </div>
              </>
            )}
          </div>

          {/* Repository URL */}
          {repoUrl && (
            <>
              <Text color="secondary">
                <Trans i18nKey="provisioning.repository-overview.repo-url">Repository URL:</Trans>
              </Text>
              <div {...stylex.props(styles.spanTwo)}>
                {repoHref ? (
                  <TextLink href={repoHref} external>
                    {formatRepoUrl(repoUrl)}
                  </TextLink>
                ) : (
                  <Text variant="body">{formatRepoUrl(repoUrl)}</Text>
                )}
              </div>
            </>
          )}

          {/* Branch */}
          {branch && (
            <>
              <Text color="secondary">
                <Trans i18nKey="provisioning.repository-overview.branch">Branch:</Trans>
              </Text>
              <div {...stylex.props(styles.spanTwo)}>
                <Text variant="body">{branch}</Text>
              </div>
            </>
          )}

          {/* Path */}
          {path && (
            <>
              <Text color="secondary">
                <Trans i18nKey="provisioning.repository-overview.path">Path:</Trans>
              </Text>
              <div {...stylex.props(styles.spanTwo)}>
                <Text variant="body">{path}</Text>
              </div>
            </>
          )}
        </Grid>
      </Card.Description>
      <Card.Actions xstyle={cardStyles.actions}>
        <SyncRepository repository={repo} />
      </Card.Actions>
    </Card>
  );
}

const styles = stylex.create({
  spanTwo: {
    gridColumn: 'span 2',
  },
  historicalData: {
    gridColumnEnd: '-1',
    gridColumnStart: '1',
    display: 'grid',
    gridTemplateColumns: 'subgrid',
    gap: spacing['--gf-spacing-x1'],
  },
  historicalDataOverlay: {
    opacity: 0.6,
  },
});

const cardStyles = stylex.create({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  actions: {
    marginTop: 'auto',
    paddingTop: spacing['--gf-spacing-x1'],
  },
});

function getRemoteConfig(spec?: RepositorySpec) {
  switch (spec?.type) {
    case 'github':
      return spec.github;
    case 'gitlab':
      return spec.gitlab;
    case 'bitbucket':
      return spec.bitbucket;
    case 'git':
      return spec.git;
    default:
      return undefined;
  }
}
