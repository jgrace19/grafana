import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';
import { locationService } from '@grafana/runtime';
import { Button, Spinner, Stack } from '@grafana/ui';
import { motion } from '@grafana/ui/stylex/constants.stylex';
import { typography } from '@grafana/ui/stylex/tokens.stylex';
import { type DashboardInitPhase } from 'app/types/dashboard';

export interface Props {
  initPhase: DashboardInitPhase;
}

export const DashboardLoading = ({ initPhase }: Props) => {
  const cancelVariables = () => {
    locationService.push('/');
  };

  return (
    <div {...stylex.props(styles.dashboardLoading)}>
      <div {...stylex.props(styles.dashboardLoadingText)}>
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

const invisibleToVisible = stylex.keyframes({
  '0%': { opacity: '0%' },
  '100%': { opacity: '100%' },
});

const styles = stylex.create({
  dashboardLoading: {
    height: '60vh',
    display: 'flex',
    opacity: '0%',
    alignItems: 'center',
    justifyContent: 'center',
    // Amount of time we want to pass before we start showing loading spinner
    animationName: { default: null, [motion.noPreferenceOrReduce]: invisibleToVisible },
    animationDuration: { default: null, [motion.noPreferenceOrReduce]: '0s' },
    animationTimingFunction: { default: null, [motion.noPreferenceOrReduce]: 'step-end' },
    animationDelay: { default: null, [motion.noPreferenceOrReduce]: '0.5s' },
    animationIterationCount: { default: null, [motion.noPreferenceOrReduce]: 1 },
    animationDirection: { default: null, [motion.noPreferenceOrReduce]: 'normal' },
    animationFillMode: { default: null, [motion.noPreferenceOrReduce]: 'forwards' },
  },
  dashboardLoadingText: {
    fontSize: typography['--gf-typography-h4-font-size'],
  },
});
