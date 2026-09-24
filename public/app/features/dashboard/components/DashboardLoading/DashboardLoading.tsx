
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { dashboardLoadingStyles } from './DashboardLoading.stylex';
import { Trans } from '@grafana/i18n';
import { locationService } from '@grafana/runtime';
import { Button, Spinner, Stack, useStyles2 } from '@grafana/ui';
import { type DashboardInitPhase } from 'app/types/dashboard';

export interface Props {
  initPhase: DashboardInitPhase;
}

export const DashboardLoading = ({ initPhase }: Props) => {
  const cancelVariables = () => {
    locationService.push('/');
  };

  return (
    <div {...stylex.props(dashboardLoadingStyles.dashboardLoading)}>
      <div {...stylex.props(dashboardLoadingStyles.dashboardLoadingText)}>
        <Stack direction="column" gap={2}>
          <Stack alignItems="center" justifyContent="center" gap={0.5}>
            <Spinner inline={true} /> {initPhase}
          </Stack>{' '}
          <Stack alignItems="center" justifyContent="center">
            <Button variant="secondary" size="md" icon="repeat" onClick={cancelVariables}>
              <Trans i18nKey="dashboard.dashboard-loading.cancel-loading-dashboard">Cancel loading dashboard</Trans>
            </Button>
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

export 