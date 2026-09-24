import * as stylex from '@stylexjs/stylex';
import { useMemo } from 'react';

import { AlertLabels } from '@grafana/alerting/unstable';
import { intervalToAbbreviatedDurationString } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
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
            <span {...stylex.props(styles.duration)}>
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
    []
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
    <div {...stylex.props(styles.tableWrapper)} data-testid="alert-group-table">
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

const styles = stylex.create({
  tableWrapper: {
    marginTop: spacing['--gf-spacing-x3'],
    marginLeft: { default: null, [bp.mdUp]: `calc(${spacing['--gf-spacing-grid-size']} * 4.5)` },
  },
  duration: {
    marginLeft: spacing['--gf-spacing-x1'],
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
});
