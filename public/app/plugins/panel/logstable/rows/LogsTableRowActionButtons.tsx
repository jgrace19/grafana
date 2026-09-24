import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

import { t } from '@grafana/i18n';
import {
  ClipboardButton,
  type CustomCellRendererProps,
  IconButton,
  TableCellInspector,
  TableCellInspectorMode,
} from '@grafana/ui';
import { colors, shadows, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';
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
  const [isInspecting, setIsInspecting] = useState(false);

  const handleViewClick = () => {
    setIsInspecting(true);
  };

  return (
    <>
      <div {...stylex.props(styles.container)}>
        {showInspectLogLine && (
          <div {...stylex.props(styles.buttonWrapper)}>
            <IconButton
              xstyle={styles.inspectButton}
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
          <div {...stylex.props(styles.buttonWrapper)}>
            <ClipboardButton
              xstyle={styles.clipboardButton}
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

const styles = stylex.create({
  inspectButton: {
    borderRadius: shape['--gf-shape-radius-default'],
    display: 'inline-flex',
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    overflow: 'hidden',
    verticalAlign: 'middle',
    cursor: 'pointer',
    height: '24px',
    width: '20px',
  },
  clipboardButton: {
    lineHeight: 1,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    width: '20px',
    cursor: 'pointer',
    height: '24px',
  },
  container: {
    backgroundColor: colors['--gf-colors-background-secondary'],
    boxShadow: shadows['--gf-shadows-z2'],
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    left: 0,
    top: 0,
    position: 'absolute',
    zIndex: 1,
  },
  buttonWrapper: {
    height: '100%',
    color: { default: null, ':hover': colors['--gf-colors-text-link'] },
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x0-5'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x0-5'],
    display: 'flex',
    alignItems: 'center',
  },
});
