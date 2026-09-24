import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { type AlertmanagerAlert } from 'app/plugins/datasource/alertmanager/types';

import { SilencedAlertsTableRow } from './SilencedAlertsTableRow';
import '../alertTable.css';

interface Props {
  silencedAlerts: AlertmanagerAlert[];
}

const SilencedAlertsTable = ({ silencedAlerts }: Props) => {
  if (!!silencedAlerts.length) {
    return (
      <table
        {...mergeStylexProps(stylex.props(styles.table, styles.tableMargin), { className: 'gf-alerting-alert-table' })}
      >
        <colgroup>
          <col {...stylex.props(styles.colExpand)} />
          <col {...stylex.props(styles.colState)} />
          <col />
          <col {...stylex.props(styles.colName)} />
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
                className={index % 2 === 0 ? stylex.props(styles.evenRow).className : ''}
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

const styles = stylex.create({
  table: {
    width: '100%',
    borderRadius: shape['--gf-shape-radius-default'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    overflow: 'hidden',
  },
  evenRow: {
    backgroundColor: colors['--gf-colors-background-primary'],
  },
  colExpand: {
    width: '36px',
  },
  tableMargin: {
    marginBottom: spacing['--gf-spacing-x1'],
  },
  colState: {
    width: '110px',
  },
  colName: {
    width: '65%',
  },
});

export default SilencedAlertsTable;
