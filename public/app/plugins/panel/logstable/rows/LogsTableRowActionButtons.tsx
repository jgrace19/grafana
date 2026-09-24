import * as stylex from '@stylexjs/stylex';
import { logsTableRowActionButtonsStyles } from './LogsTableRowActionButtons.stylex';

import { useState } from 'react';

import { t } from '@grafana/i18n';
import {
  ClipboardButton,
  type CustomCellRendererProps,
  IconButton,
  TableCellInspector,
  TableCellInspectorMode,
  useTheme2,
} from '@grafana/ui';
import { type LogsFrame } from 'app/features/logs/logsFrame';

import { type BuildLinkToLogLine } from '../types';

interface Props extends CustomCellRendererProps {
  buildLinkToLog?: BuildLinkToLogLine;
  showInspectLogLine: boolean;
  logsFrame: LogsFrame;
}

/**
 * Logs row actions buttons
 * @param props
 * @constructor
 */
export function LogsTableRowActionButtons(props: Props) {
  const { rowIndex, buildLinkToLog, showInspectLogLine, logsFrame } = props;
  const theme = useTheme2();
  const [isInspecting, setIsInspecting] = useState(false);
  const styles = getStyles(theme);

  const handleViewClick = () => {
    setIsInspecting(true);
  };

  return (
    <>
      <div {...stylex.props(logsTableRowActionButtonsStyles.container)}>
        {showInspectLogLine && (
          <div {...stylex.props(logsTableRowActionButtonsStyles.buttonWrapper)}>
            <IconButton
              {...stylex.props(logsTableRowActionButtonsStyles.inspectButton)}
              tooltip={t('explore.logs-table.action-buttons.view-log-line', 'View log line')}
              variant="secondary"
              aria-label={t('explore.logs-table.action-buttons.view-log-line', 'View log line')}
              tooltipPlacement="top"
              size="md"
              name="eye"
              onClick={handleViewClick}
              tabIndex={0}
            />
          </div>
        )}
        {buildLinkToLog && (
          <div {...stylex.props(logsTableRowActionButtonsStyles.buttonWrapper)}>
            <ClipboardButton
              {...stylex.props(logsTableRowActionButtonsStyles.clipboardButton)}
              icon="share-alt"
              variant="secondary"
              fill="text"
              size="md"
              tooltip={t('explore.logs-table.action-buttons.copy-link', 'Copy link to log line')}
              tooltipPlacement="top"
              tabIndex={0}
              aria-label={t('explore.logs-table.action-buttons.copy-link', 'Copy link to log line')}
              getText={() => {
                const logId = logsFrame?.idField?.values?.[rowIndex];
                if (logId) {
                  return buildLinkToLog(logId) ?? '';
                } else {
                  console.error('failed to copy log line link!');
                }
                return '';
              }}
            />
          </div>
        )}
      </div>
      {isInspecting && (
        <TableCellInspector
          value={getLineValue(logsFrame, rowIndex)}
          mode={TableCellInspectorMode.code}
          onDismiss={function (): void {
            setIsInspecting(false);
          }}
        />
      )}
    </>
  );
}

const getLineValue = (logsFrame: LogsFrame, rowIndex: number) => {
  const bodyField = logsFrame.bodyField;
  return bodyField?.values[rowIndex];
};

export 