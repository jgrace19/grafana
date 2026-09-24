import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';

import { Trans } from '@grafana/i18n';
import { type AlertmanagerAlert } from 'app/plugins/datasource/alertmanager/types';

import * as stylex from '@stylexjs/stylex';
import { tableStyles } from '../../styles/table.stylex';

import { SilencedAlertsTableRow } from './SilencedAlertsTableRow';

interface Props {
  silencedAlerts: AlertmanagerAlert[];
}

const SilencedAlertsTable = ({ silencedAlerts }: Props) => {

  if (!!silencedAlerts.length) {
    return (
      <table className={cx(tableStyles.table, stylex.props(formStyles.tableMargin))}>
        <colgroup>
          <col {...stylex.props(tableStyles.colExpand)} />
          <col {...stylex.props(silencedAlertsTableStyles.colState)} />
          <col />
          <col {...stylex.props(silencedAlertsTableStyles.colName)} />
        </colgroup>
        <thead>
          <tr>
            <th />
            <th>
              <Trans i18nKey="silences-table.header.state">State</Trans>
            </th>
            <th />
            <th>
              <Trans i18nKey="silences-table.header.alert-name">Alert name</Trans>
            </th>
          </tr>
        </thead>
        <tbody>
          {silencedAlerts.map((alert, index) => {
            return (
              <SilencedAlertsTableRow
                key={alert.fingerprint}
                alert={alert}
                className={index % 2 === 0 ? tableStyles.evenRow : ''}
              />
            );
          })}
        </tbody>
      </table>
    );
  } else {
    return null;
  }
};


export default SilencedAlertsTable;
