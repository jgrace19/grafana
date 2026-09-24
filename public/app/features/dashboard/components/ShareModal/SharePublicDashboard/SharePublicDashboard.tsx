
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { sharePublicDashboardStyles } from './SharePublicDashboard.stylex';
import { Trans } from '@grafana/i18n';
import { Spinner, useStyles2 } from '@grafana/ui';
import { useGetPublicDashboardQuery } from 'app/features/dashboard/api/publicDashboardApi';
import { publicDashboardPersisted } from 'app/features/dashboard/components/ShareModal/SharePublicDashboard/SharePublicDashboardUtils';
import { type ShareModalTabProps } from 'app/features/dashboard/components/ShareModal/types';
import { useSelector } from 'app/types/store';

import { HorizontalGroup } from '../../../../plugins/admin/components/HorizontalGroup';

import { ConfigPublicDashboard } from './ConfigPublicDashboard/ConfigPublicDashboard';
import { CreatePublicDashboard } from './CreatePublicDashboard/CreatePublicDashboard';
import { useGetUnsupportedDataSources } from './useGetUnsupportedDataSources';

interface Props extends ShareModalTabProps {}

export const Loader = () => {

  return (
    <HorizontalGroup {...stylex.props(sharePublicDashboardStyles.loadingContainer)}>
      <>
        <Trans i18nKey="dashboard.share-public-dashboard-loader.loading-configuration">Loading configuration</Trans>
        <Spinner size="lg" {...stylex.props(sharePublicDashboardStyles.spinner)} />
      </>
    </HorizontalGroup>
  );
};

export const SharePublicDashboard = (props: Props) => {
  const { data: publicDashboard, isLoading, isError } = useGetPublicDashboardQuery(props.dashboard.uid);
  const dashboardState = useSelector((store) => store.dashboard);
  const dashboard = dashboardState.getModel()!;
  const { unsupportedDataSources } = useGetUnsupportedDataSources(dashboard);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : !publicDashboardPersisted(publicDashboard) ? (
        <CreatePublicDashboard hasError={isError} />
      ) : (
        <ConfigPublicDashboard publicDashboard={publicDashboard!} unsupportedDatasources={unsupportedDataSources} />
      )}
    </>
  );
};

