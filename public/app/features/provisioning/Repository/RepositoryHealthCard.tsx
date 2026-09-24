import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { repositoryHealthCardStyles } from './RepositoryHealthCard.stylex';
import { Link } from 'react-router-dom-v5-compat';

import { t, Trans } from '@grafana/i18n';
import { Badge, Card, Grid, Stack, Text } from '@grafana/ui';
import { type Repository } from 'app/api/clients/provisioning/v0alpha1';

import { ConnectionStatusBadge } from '../Connection/ConnectionStatusBadge';
import { CONNECTIONS_URL } from '../constants';
import { useConnectionStatus } from '../hooks/useConnectionStatus';
import { formatTimestamp } from '../utils/time';

export function RepositoryHealthCard({ repo }: { repo: Repository }) {
  const status = repo.status;
  const connectionName = repo.spec?.connection?.name;
  const { connection } = useConnectionStatus(connectionName);

  return (
    <Card noMargin {...stylex.props(repositoryHealthCardStyles.card)}>
      <Card.Heading>
        <Trans i18nKey="provisioning.repository-overview.health">Health</Trans>
      </Card.Heading>
      <Card.Description>
        <Grid columns={3} gap={1} alignItems="baseline">
          {/* Status */}
          <Text color="secondary">
            <Trans i18nKey="provisioning.repository-overview.status">Status:</Trans>
          </Text>

          <div {...stylex.props(repositoryHealthCardStyles.spanTwo)}>
            <Badge
              color={status?.health?.healthy ? 'green' : 'red'}
              text={
                status?.health?.healthy
                  ? t('provisioning.repository-overview.healthy', 'Healthy')
                  : t('provisioning.repository-overview.unhealthy', 'Unhealthy')
              }
              icon={status?.health?.healthy ? 'check-circle' : 'exclamation-triangle'}
            />
          </div>

          {/* Checked */}
          <Text color="secondary">
            <Trans i18nKey="provisioning.repository-overview.checked">Checked:</Trans>
          </Text>
          <div {...stylex.props(repositoryHealthCardStyles.spanTwo)}>
            <Text variant="body">{formatTimestamp(status?.health?.checked)}</Text>
          </div>

          {!!status?.health?.message?.length && (
            <>
              <Text color="secondary">
                <Trans i18nKey="provisioning.repository-overview.messages">Messages:</Trans>
              </Text>
              <div {...stylex.props(repositoryHealthCardStyles.spanTwo)}>
                <Stack gap={1}>
                  {status.health.message.map((msg, idx) => (
                    <Text key={idx} variant="body">
                      {msg}
                    </Text>
                  ))}
                </Stack>
              </div>
            </>
          )}

          {/* Connection status */}
          {connectionName && (
            <>
              <Text color="secondary">
                <Trans i18nKey="provisioning.repository-overview.connection-status">Connection status:</Trans>
              </Text>
              <div {...stylex.props(repositoryHealthCardStyles.spanTwo)}>
                <Link to={`${CONNECTIONS_URL}/${connectionName}/edit`}>
                  <ConnectionStatusBadge
                    key={connection?.status?.conditions?.find((c) => c.type === 'Ready')?.status || 'pending'}
                    status={connection?.status}
                  />
                </Link>
              </div>
            </>
          )}
        </Grid>
      </Card.Description>
    </Card>
  );
}

;
