import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';

import { Trans } from '@grafana/i18n';
import { config, type GrafanaBootConfig } from '@grafana/runtime';
import { LinkButton, Stack } from '@grafana/ui';
import { spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
import { AccessControlAction } from 'app/types/accessControl';

import { contextSrv } from '../../core/services/context_srv';

import { ServerStatsCard } from './ServerStatsCard';
import { getServerStats, type ServerStat } from './state/apis';

export const ServerStats = () => {
  const [stats, setStats] = useState<ServerStat | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hasAccessToDataSources = contextSrv.hasPermission(AccessControlAction.DataSourcesRead);
  const hasAccessToAdminUsers = contextSrv.hasPermission(AccessControlAction.UsersRead);

  useEffect(() => {
    if (contextSrv.hasPermission(AccessControlAction.ActionServerStatsRead)) {
      getServerStats().then((stats) => {
        setStats(stats);
        setIsLoading(false);
      });
    }
  }, []);

  if (!contextSrv.hasPermission(AccessControlAction.ActionServerStatsRead)) {
    return null;
  }

  return (
    <>
      <h2 {...stylex.props(styles.title)}>
        <Trans i18nKey="admin.server-settings.title">Instance statistics</Trans>
      </h2>
      {!isLoading && !stats ? (
        <p {...stylex.props(styles.notFound)}>
          <Trans i18nKey="admin.server-settings.not-found">No stats found.</Trans>
        </p>
      ) : (
        <Stack
          gap={2}
          direction={{
            xs: 'column',
            md: 'row',
          }}
        >
          <ServerStatsCard
            isLoading={isLoading}
            content={[
              { name: 'Dashboards (starred)', value: `${stats?.dashboards} (${stats?.stars})` },
              { name: 'Tags', value: stats?.tags },
              { name: 'Playlists', value: stats?.playlists },
              { name: 'Snapshots', value: stats?.snapshots },
            ]}
            footer={
              <LinkButton href={'/dashboards'} variant={'secondary'}>
                <Trans i18nKey="admin.server-settings.dashboards-button">Manage dashboards</Trans>
              </LinkButton>
            }
          />

          <Stack direction="column" gap={2}>
            <ServerStatsCard
              isLoading={isLoading}
              content={[{ name: 'Data sources', value: stats?.datasources }]}
              footer={
                hasAccessToDataSources && (
                  <LinkButton href={'/datasources'} variant={'secondary'}>
                    <Trans i18nKey="admin.server-settings.data-sources-button">Manage data sources</Trans>
                  </LinkButton>
                )
              }
            />
            <ServerStatsCard
              isLoading={isLoading}
              content={[{ name: 'Alerts', value: stats?.alerts }]}
              footer={
                <LinkButton href={'/alerting/list'} variant={'secondary'}>
                  <Trans i18nKey="admin.server-settings.alerts-button">Manage alerts</Trans>
                </LinkButton>
              }
            />
          </Stack>
          <ServerStatsCard
            isLoading={isLoading}
            content={[
              { name: 'Organisations', value: stats?.orgs },
              { name: 'Users total', value: stats?.users },
              { name: 'Active sessions', value: stats?.activeSessions },
              { name: 'Active users in last 30 days', value: stats?.activeUsers },
              ...getAnonymousStatsContent(stats, config),
            ]}
            footer={
              hasAccessToAdminUsers && (
                <LinkButton href={'/admin/users'} variant={'secondary'}>
                  <Trans i18nKey="admin.server-settings.users-button">Manage users</Trans>
                </LinkButton>
              )
            }
          />
        </Stack>
      )}
    </>
  );
};

const getAnonymousStatsContent = (stats: ServerStat | null, config: GrafanaBootConfig) => {
  if (!config.anonymousEnabled || !stats?.activeDevices) {
    return [];
  }
  if (!config.anonymousDeviceLimit) {
    return [
      {
        name: 'Active anonymous devices',
        value: `${stats.activeDevices}`,
        tooltip: 'Detected devices that are not logged in, in last 30 days.',
      },
    ];
  } else {
    return [
      {
        name: 'Active anonymous devices',
        value: `${stats.activeDevices} / ${config.anonymousDeviceLimit}`,
        tooltip: 'Detected devices that are not logged in, in last 30 days.',
        highlight: stats.activeDevices > config.anonymousDeviceLimit,
      },
    ];
  }
};

const styles = stylex.create({
  title: {
    marginBottom: spacing['--gf-spacing-x4'],
  },

  notFound: {
    fontSize: typography['--gf-typography-h6-font-size'],
    textAlign: 'center',
    height: '290px',
  },
});
