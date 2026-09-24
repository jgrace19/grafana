import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { alertGroupAlertsTableStyles } from './AlertGroupAlertsTable.stylex';
import { useMemo } from 'react';

import { AlertLabels } from '@grafana/alerting/unstable';
import { Trans, t } from '@grafana/i18n';
import { type AlertmanagerAlert } from 'app/plugins/datasource/alertmanager/types';

import { type DynamicTableColumnProps, type DynamicTableItemProps } from '../DynamicTable';
import { DynamicTableWithGuidelines } from '../DynamicTableWithGuidelines';
import { AmAlertStateTag } from '../silences/AmAlertStateTag';

import { AlertDetails } from './AlertDetails';

interface Props {
  alerts: AlertmanagerAlert[];
  alertManagerSourceName: string;
}

type AlertGroupAlertsTableColumnProps = DynamicTableColumnProps<AlertmanagerAlert>;
type AlertGroupAlertsTableItemProps = DynamicTableItemProps<AlertmanagerAlert>;

export const AlertGroupAlertsTable = ({ alerts, alertManagerSourceName }: Props) => {

  const columns = useMemo(
    (): AlertGroupAlertsTableColumnProps[] => [
      {
        id: 'state',
        label: t('alerting.alert-group-alerts-table.columns.label.notification-state', 'Notification state'),
        // eslint-disable-next-line react/display-name
        renderCell: ({ data: alert }) => (
          <>
            <AmAlertStateTag state={alert.status.state} />
            <span {...stylex.props(alertGroupAlertsTableStyles.duration)}>
              <Trans
                i18nKey="alerting.alert-group-alerts-table.duration"
                values={{
                  time: intervalToAbbreviatedDurationString({
                    start: new Date(alert.startsAt),
                    end: new Date(alert.endsAt),
                  }),
                }}
              >
                for {'{{time}}'}
              </Trans>
            </span>
          </>
        ),
        size: '220px',
      },
      {
        id: 'labels',
        label: t('alerting.alert-group-alerts-table.columns.label.instance-labels', 'Instance labels'),
        // eslint-disable-next-line react/display-name
        renderCell: ({ data: { labels } }) => <AlertLabels labels={labels} size="sm" />,
        size: 1,
      },
    ],
    [styles]
  );

  const items = useMemo(
    (): AlertGroupAlertsTableItemProps[] =>
      alerts.map((alert) => ({
        id: alert.fingerprint,
        data: alert,
      })),
    [alerts]
  );

  return (
    <div {...stylex.props(alertGroupAlertsTableStyles.tableWrapper)} data-testid="alert-group-table">
      <DynamicTableWithGuidelines
        cols={columns}
        items={items}
        isExpandable={true}
        renderExpandedContent={({ data: alert }) => (
          <AlertDetails alert={alert} alertManagerSourceName={alertManagerSourceName} />
        )}
      />
    </div>
  );
};

