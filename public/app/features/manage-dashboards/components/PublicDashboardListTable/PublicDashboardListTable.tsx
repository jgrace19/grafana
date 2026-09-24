import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { publicDashboardListTableStyles } from './PublicDashboardListTable.stylex';
import { useMemo, useState } from 'react';
import { useMedia } from 'react-use';

import { selectors as e2eSelectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import {
  Card,
  EmptyState,
  LinkButton,
  Pagination,
  Spinner,
  Switch,
  TextLink,
  useTheme2,
} from '@grafana/ui';
import { Page } from 'app/core/components/Page/Page';
import { contextSrv } from 'app/core/services/context_srv';
import {
  useListPublicDashboardsQuery,
  useUpdatePublicDashboardMutation,
} from 'app/features/dashboard/api/publicDashboardApi';
import {
  generatePublicDashboardConfigUrl,
  generatePublicDashboardUrl,
} from 'app/features/dashboard/components/ShareModal/SharePublicDashboard/SharePublicDashboardUtils';
import { AccessControlAction } from 'app/types/accessControl';

import { type PublicDashboardListResponse } from '../../types';

import { DeletePublicDashboardButton } from './DeletePublicDashboardButton';

const PublicDashboardCard = ({ pd }: { pd: PublicDashboardListResponse }) => {
  const theme = useTheme2();
  const isMobile = useMedia(`(max-width: ${theme.breakpoints.values.sm}px)`);

  const [update, { isLoading: isUpdateLoading }] = useUpdatePublicDashboardMutation();

  const selectors = e2eSelectors.pages.PublicDashboards;
  const hasWritePermissions = contextSrv.hasPermission(AccessControlAction.DashboardsPublicWrite);

  const onTogglePause = (pd: PublicDashboardListResponse, isPaused: boolean) => {
    const req = {
      dashboard: { uid: pd.dashboardUid },
      payload: {
        uid: pd.uid,
        isEnabled: !isPaused,
      },
    };

    update(req);
  };

  const CardActions = useMemo(() => (isMobile ? Card.Actions : Card.SecondaryActions), [isMobile]);

  const translatedPauseSharingText = t('shared-dashboard-list.toggle.pause-sharing-toggle-text', 'Pause access');
  return (
    <Card noMargin {...stylex.props(publicDashboardListTableStyles.card)} href={`/d/${pd.dashboardUid}`}>
      <Card.Heading {...stylex.props(publicDashboardListTableStyles.heading)}>
        <span>{pd.title}</span>
      </Card.Heading>
      <CardActions {...stylex.props(publicDashboardListTableStyles.actions)}>
        <div {...stylex.props(publicDashboardListTableStyles.pauseSwitch)}>
          <Switch
            value={!pd.isEnabled}
            label={translatedPauseSharingText}
            disabled={isUpdateLoading}
            onChange={(e) => {
              reportInteraction('grafana_dashboards_public_enable_clicked', {
                action: e.currentTarget.checked ? 'disable' : 'enable',
              });
              onTogglePause(pd, e.currentTarget.checked);
            }}
            data-testid={selectors.ListItem.pauseSwitch}
          />
          <span>{translatedPauseSharingText}</span>
        </div>
        <LinkButton
          fill="text"
          icon="external-link-alt"
          variant="secondary"
          target="_blank"
          color={theme.colors.warning.text}
          href={generatePublicDashboardUrl(pd.accessToken)}
          key="public-dashboard-url"
          tooltip={t('shared-dashboard-list.button.view-button-tooltip', 'View shared dashboard')}
          data-testid={selectors.ListItem.linkButton}
        />
        <LinkButton
          fill="text"
          icon="cog"
          variant="secondary"
          color={theme.colors.warning.text}
          href={generatePublicDashboardConfigUrl(pd.dashboardUid, pd.slug)}
          key="public-dashboard-config-url"
          tooltip={t('shared-dashboard-list.button.config-button-tooltip', 'Configure shared dashboard')}
          data-testid={selectors.ListItem.configButton}
        />
        {hasWritePermissions && (
          <DeletePublicDashboardButton
            fill="text"
            icon="trash-alt"
            variant="secondary"
            publicDashboard={pd}
            tooltip={t('shared-dashboard-list.button.revoke-button-tooltip', 'Revoke access')}
            loader={<Spinner />}
            data-testid={selectors.ListItem.trashcanButton}
          />
        )}
      </CardActions>
    </Card>
  );
};

export const PublicDashboardListTable = () => {
  const [page, setPage] = useState(1);
  const { data: paginatedPublicDashboards, isLoading, isError } = useListPublicDashboardsQuery(page);

  return (
    <Page navId="dashboards/public">
      <Page.Contents isLoading={isLoading}>
        {!isLoading && !isError && !!paginatedPublicDashboards && (
          <div>
            {paginatedPublicDashboards.publicDashboards.length === 0 ? (
              <EmptyState
                variant="call-to-action"
                message={t(
                  'shared-dashboard-list.empty-state.message',
                  "You haven't created any shared dashboards yet"
                )}
              >
                <Trans i18nKey="shared-dashboard-list.empty-state.more-info">
                  Create a shared dashboard from any existing dashboard through the <b>Share</b> modal.{' '}
                  <TextLink
                    external
                    href="https://grafana.com/docs/grafana/latest/dashboards/share-dashboards-panels/shared-dashboards"
                  >
                    Learn more
                  </TextLink>
                </Trans>
              </EmptyState>
            ) : (
              <>
                <ul {...stylex.props(publicDashboardListTableStyles.list)}>
                  {paginatedPublicDashboards.publicDashboards.map((pd: PublicDashboardListResponse) => (
                    <li key={pd.uid}>
                      <PublicDashboardCard pd={pd} />
                    </li>
                  ))}
                </ul>
                <Pagination
                  onNavigate={setPage}
                  currentPage={paginatedPublicDashboards.page}
                  numberOfPages={paginatedPublicDashboards.totalPages}
                  hideWhenSinglePage
                />
              </>
            )}
          </div>
        )}
      </Page.Contents>
    </Page>
  );
};

