import * as stylex from '@stylexjs/stylex';

import { type CoreApp, type LogRowModel } from '@grafana/data';
import { t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { IconButton } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { LOG_LINE_BODY_FIELD_NAME } from './fieldSelector/logFields';
import { logRowStyles } from './getLogRowStyles';

export interface Props {
  app?: CoreApp;
  disableActions: boolean;
  displayedFields?: string[];
  onClickShowField?: (key: string) => void;
  onClickHideField?: (key: string) => void;
  row: LogRowModel;
}

export const LogDetailsBody = (props: Props) => {
  const showField = () => {
    const { onClickShowField, row } = props;
    if (onClickShowField) {
      onClickShowField(LOG_LINE_BODY_FIELD_NAME);
    }

    reportInteraction('grafana_explore_logs_log_details_show_body_clicked', {
      datasourceType: row.datasourceType,
      logRowUid: row.uid,
      type: 'enable',
      app: props.app,
    });
  };

  const hideField = () => {
    const { onClickHideField, row } = props;
    if (onClickHideField) {
      onClickHideField(LOG_LINE_BODY_FIELD_NAME);
    }

    reportInteraction('grafana_explore_logs_log_details_show_body_clicked', {
      datasourceType: row.datasourceType,
      logRowUid: row.uid,
      type: 'disable',
      app: props.app,
    });
  };

  const { displayedFields, disableActions, row } = props;

  const toggleFieldButton =
    displayedFields != null && displayedFields.includes(LOG_LINE_BODY_FIELD_NAME) ? (
      <IconButton
        variant="primary"
        tooltip={t('logs.log-details-body.toggle-field-button.tooltip-hide-log-line', 'Hide log line')}
        name="eye"
        onClick={hideField}
      />
    ) : (
      <IconButton
        tooltip={t('logs.log-details-body.toggle-field-button.tooltip-show-log-line', 'Show log line')}
        name="eye"
        onClick={showField}
      />
    );

  return (
    <tr {...stylex.props(logRowStyles.logDetailsValue)}>
      <td {...stylex.props(logRowStyles.logsDetailsIcon)}>
        <div {...stylex.props(styles.buttonRow)}>{!disableActions && displayedFields && toggleFieldButton}</div>
      </td>

      <td {...stylex.props(logRowStyles.logDetailsLabel)} colSpan={100}>
        {row.entry}
      </td>
    </tr>
  );
};

const styles = stylex.create({
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: spacing['--gf-spacing-x0-5'],
    marginLeft: spacing['--gf-spacing-x0-5'],
  },
});
