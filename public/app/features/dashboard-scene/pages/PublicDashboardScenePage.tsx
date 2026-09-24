import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { publicDashboardScenePageStyles } from './PublicDashboardScenePage.stylex';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom-v5-compat';

import { selectors as e2eSelectors } from '@grafana/e2e-selectors';
import { type SceneComponentProps, UrlSyncContextProvider } from '@grafana/scenes';
import {Alert, Box, Icon, Stack} from '@grafana/ui';
import { Page } from 'app/core/components/Page/Page';
import PageLoader from 'app/core/components/PageLoader/PageLoader';
import { type GrafanaRouteComponentProps } from 'app/core/navigation/types';
import { DashboardBrandingFooter } from 'app/features/dashboard/components/PublicDashboard/DashboardBrandingFooter';
import { useGetPublicDashboardConfig } from 'app/features/dashboard/components/PublicDashboard/usePublicDashboardConfig';
import { PublicDashboardNotAvailable } from 'app/features/dashboard/components/PublicDashboardNotAvailable/PublicDashboardNotAvailable';
import {
  type PublicDashboardPageRouteParams,
  type PublicDashboardPageRouteSearchParams,
} from 'app/features/dashboard/containers/types';
import { AppNotificationSeverity } from 'app/types/appNotifications';
import { DashboardRoutes } from 'app/types/dashboard';

import { type DashboardScene } from '../scene/DashboardScene';

import { getDashboardScenePageStateManager, type LoadError } from './DashboardScenePageStateManager';

const selectors = e2eSelectors.pages.PublicDashboardScene;

export type Props = Omit<
  GrafanaRouteComponentProps<PublicDashboardPageRouteParams, PublicDashboardPageRouteSearchParams>,
  'match' | 'history'
>;

export function PublicDashboardScenePage({ route }: Props) {
  const { accessToken = '' } = useParams();
  const stateManager = getDashboardScenePageStateManager();

  const { dashboard, isLoading, loadError } = stateManager.useState();

  useEffect(() => {
    stateManager.loadDashboard({ uid: accessToken, route: DashboardRoutes.Public });

    return () => {
      stateManager.clearState();
    };
  }, [stateManager, accessToken, route.routeName]);

  if (loadError) {
    return <PublicDashboardScenePageError error={loadError} />;
  }

  if (!dashboard) {
    return (
      <Page layout={PageLayoutType.Custom} {...stylex.props(publicDashboardScenePageStyles.loadingPage)} data-testid={selectors.loadingPage}>
        {isLoading && <PageLoader />}
      </Page>
    );
  }

  // if no time picker render without url sync
  if (dashboard.state.controls?.state.hideTimeControls) {
    return <PublicDashboardSceneRenderer model={dashboard} />;
  }

  return (
    <UrlSyncContextProvider scene={dashboard}>
      <PublicDashboardSceneRenderer model={dashboard} />
    </UrlSyncContextProvider>
  );
}

function PublicDashboardSceneRenderer({ model }: SceneComponentProps<DashboardScene>) {
  const [isActive, setIsActive] = useState(false);
  const { controls, title, body } = model.useState();
  const { timePicker, refreshPicker, hideTimeControls } = controls!.useState();

  const conf = useGetPublicDashboardConfig();

  useEffect(() => {
    return refreshPicker.activate();
  }, [refreshPicker]);

  useEffect(() => {
    setIsActive(true);
    return model.activate();
  }, [model]);

  if (!isActive) {
    return null;
  }

  return (
    <Page layout={PageLayoutType.Custom} {...stylex.props(publicDashboardScenePageStyles.page)} data-testid={selectors.page}>
      <div {...stylex.props(publicDashboardScenePageStyles.controls)}>
        <Stack alignItems="center">
          {!conf.headerLogoHide && (
            <div {...stylex.props(publicDashboardScenePageStyles.iconTitle)}>
              <Icon name="grafana" size="lg" aria-hidden />
            </div>
          )}
          <span {...stylex.props(publicDashboardScenePageStyles.title)}>{title}</span>
        </Stack>
        {!hideTimeControls && (
          <Stack>
            <timePicker.Component model={timePicker} />
            <refreshPicker.Component model={refreshPicker} />
          </Stack>
        )}
      </div>
      <div {...stylex.props(publicDashboardScenePageStyles.body)}>
        <body.Component model={body} />
      </div>
      <DashboardBrandingFooter />
    </Page>
  );
}

function PublicDashboardScenePageError({ error }: { error: LoadError }) {

  const statusCode = error.status;
  const messageId = error.messageId;
  const message = error.message;

  const isPublicDashboardPaused = statusCode === 403 && messageId === 'publicdashboards.notEnabled';
  const isPublicDashboardNotFound = statusCode === 404 && messageId === 'publicdashboards.notFound';
  const isDashboardNotFound = statusCode === 404 && messageId === 'publicdashboards.dashboardNotFound';

  const publicDashboardEnabled = isPublicDashboardNotFound ? undefined : !isPublicDashboardPaused;
  const dashboardNotFound = isPublicDashboardNotFound || isDashboardNotFound;

  if (publicDashboardEnabled === false) {
    return <PublicDashboardNotAvailable paused />;
  }

  if (dashboardNotFound) {
    return <PublicDashboardNotAvailable />;
  }

  return (
    <Page layout={PageLayoutType.Custom} {...stylex.props(publicDashboardScenePageStyles.loadingPage)} data-testid={selectors.loadingPage}>
      <Box paddingY={4} display="flex" direction="column" alignItems="center">
        <Alert severity={AppNotificationSeverity.Error} title={message}>
          {message}
        </Alert>
      </Box>
    </Page>
  );
}

