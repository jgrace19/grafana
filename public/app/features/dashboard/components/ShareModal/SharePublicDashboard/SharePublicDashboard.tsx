import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';
import { Spinner } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
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
    <HorizontalGroup className={stylex.props(styles.loadingContainer).className}>
      <>
        <Trans i18nKey="dashboard.share-public-dashboard-loader.loading-configuration">Loading configuration</Trans>
        <Spinner size="lg" className={stylex.props(styles.spinner).className} />
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

const styles = stylex.create({
  // HorizontalGroup (plugins/admin, still Emotion) sets display/direction/wrap only, so these don't race it.
  loadingContainer: {
    height: '280px',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['--gf-spacing-x1'],
  },
  // HorizontalGroup's unlayered `> *` margin wins over this, as it did when its Emotion rule was inserted later.
  spinner: {
    marginBottom: spacing['--gf-spacing-x0'],
  },
});
