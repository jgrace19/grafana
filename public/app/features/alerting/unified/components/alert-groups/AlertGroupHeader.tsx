import * as stylex from '@stylexjs/stylex';
import pluralize from 'pluralize';

import { colors } from '@grafana/ui/stylex/tokens.stylex';
import { type AlertState, type AlertmanagerGroup } from 'app/plugins/datasource/alertmanager/types';

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
            {...stylex.props(stateTextStyles[state as AlertState])}
          >
            {index > 0 && ', '}
            {`${count} ${state}`}
          </span>
        );
      })}
    </div>
  );
};

const stateTextStyles = stylex.create({
  active: {
    color: colors['--gf-colors-error-text'],
  },
  suppressed: {
    color: colors['--gf-colors-primary-text'],
  },
  unprocessed: {
    color: colors['--gf-colors-secondary-text'],
  },
});
