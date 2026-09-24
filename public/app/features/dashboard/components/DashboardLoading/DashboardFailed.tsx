import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { dashboardFailedStyles } from './DashboardFailed.stylex';

import { Alert } from '@grafana/ui';
import { getMessageFromError } from 'app/core/utils/errors';
import { AppNotificationSeverity } from 'app/types/appNotifications';
import { type DashboardInitError } from 'app/types/dashboard';

export interface Props {
  initError?: DashboardInitError;
}

export const DashboardFailed = ({ initError }: Props) => {
  if (!initError) {
    return null;
  }

  return (
    <div {...stylex.props(dashboardFailedStyles.dashboardLoading)}>
      <Alert severity={AppNotificationSeverity.Error} title={initError.message}>
        {getMessageFromError(initError.error)}
      </Alert>
    </div>
  );
};

