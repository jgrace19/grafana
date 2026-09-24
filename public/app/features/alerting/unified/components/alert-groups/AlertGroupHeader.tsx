import pluralize from 'pluralize';

import { type AlertState, type AlertmanagerGroup } from 'app/plugins/datasource/alertmanager/types';

import * as stylex from '@stylexjs/stylex';
import { notificationsStyles } from '../../styles/notifications.stylex';
import { AlertState } from 'app/plugins/datasource/alertmanager/types';

const notificationStateStyle = {
  [AlertState.Active]: notificationsStyles.AlertState_Active,
  [AlertState.Suppressed]: notificationsStyles.AlertState_Suppressed,
  [AlertState.Unprocessed]: notificationsStyles.AlertState_Unprocessed,
} as const;

interface Props {
  group: AlertmanagerGroup;
}

export const AlertGroupHeader = ({ group }: Props) => {
  const total = group.alerts.length;
  const countByStatus = group.alerts.reduce(
    (statusObj, alert) => {
      if (statusObj[alert.status.state]) {
        statusObj[alert.status.state] += 1;
      } else {
        statusObj[alert.status.state] = 1;
      }
      return statusObj;
    },
    {} as Record<AlertState, number>
  );

  return (
    <div>
      {`${total} ${pluralize('alert', total)}: `}
      {Object.entries(countByStatus).map(([state, count], index) => {
        return (
          <span
            key={`${JSON.stringify(group.labels)}-notifications-${index}`}
            {...stylex.props(notificationStateStyle[state as AlertState])}
          >
            {index > 0 && ', '}
            {`${count} ${state}`}
          </span>
        );
      })}
    </div>
  );
};
