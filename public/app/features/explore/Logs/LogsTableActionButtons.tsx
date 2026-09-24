import * as stylex from '@stylexjs/stylex';
import { useCallback, useState, memo } from 'react';

import {
  type AbsoluteTimeRange,
  type ExploreLogsPanelState,
  type LogRowModel,
  serializeStateToUrlParam,
  urlUtil,
} from '@grafana/data';
import { t } from '@grafana/i18n';
import { ClipboardButton, type CustomCellRendererProps, IconButton, Modal } from '@grafana/ui';
import { colors, shadows, shape } from '@grafana/ui/stylex/tokens.stylex';
import { getLogsPermalinkRange } from 'app/core/utils/shortLinks';
import { getUrlStateFromPaneState } from 'app/features/explore/hooks/useStateSync/external.utils';
import { type LogsFrame, DATAPLANE_ID_NAME } from 'app/features/logs/logsFrame';
import { getState } from 'app/store/store';

import { getExploreBaseUrl } from './utils/url';

import './LogsTableActionButtons.css';
interface Props extends CustomCellRendererProps {
  logId?: string;
  logsFrame?: LogsFrame;
  exploreId?: string;
  panelState?: ExploreLogsPanelState;
  displayedFields?: string[];
  absoluteRange?: AbsoluteTimeRange;
  logRows?: LogRowModel[];
  index?: number;
}

export const LogsTableActionButtons = memo((props: Props) => {
  const { exploreId, absoluteRange, logRows, rowIndex, panelState, displayedFields, logsFrame, frame } = props;
  const [isInspecting, setIsInspecting] = useState(false);
  // Get logId from the table frame (frame), not the original logsFrame, because
  // the table frame is sorted/transformed and rowIndex refers to the table frame
  const idFieldName = logsFrame?.idField?.name ?? DATAPLANE_ID_NAME;
  const idField = frame.fields.find((field) => field.name === idFieldName || field.name === DATAPLANE_ID_NAME);
  const logId = idField?.values[rowIndex];

  const getLineValue = () => {
    const logRowById = logRows?.find((row) => row.rowId === logId);
    return logRowById?.raw ?? '';
  };

  // Generate link to the log line
  const getText = useCallback(() => {
    if (!logId || !exploreId || !absoluteRange || !logRows) {
      return '';
    }

    try {
      // Get the log row from the logRows array
      const logRow = logRows.find((row) => row.rowId === logId);

      if (!logRow) {
        return '';
      }

      // Get the current explore state
      const currentPaneState = getState().explore.panes[exploreId];
      if (!currentPaneState) {
        return '';
      }

      // Create URL state with log permalink information
      const urlState = getUrlStateFromPaneState(currentPaneState);

      // Preserve all panel state (columns, labelFieldName, etc.)
      urlState.panelsState = {
        ...currentPaneState.panelsState,
        logs: {
          ...panelState,
          displayedFields: displayedFields ?? [],
        },
      };

      // Calculate the time range for the permalink
      urlState.range = getLogsPermalinkRange(logRow, logRows, absoluteRange);

      // Create the full URL with selectedLine as a URL parameter (with id and row)
      const serializedState = serializeStateToUrlParam(urlState);
      const baseUrl = getExploreBaseUrl();
      const url = urlUtil.renderUrl(`${baseUrl}/explore`, {
        left: serializedState,
        selectedLine: JSON.stringify({ id: logId, row: rowIndex }),
      });
      return url;
    } catch (error) {
      return '';
    }
  }, [absoluteRange, displayedFields, exploreId, logId, logRows, rowIndex, panelState]);

  const handleViewClick = () => {
    setIsInspecting(true);
  };

  return (
    <>
      <div {...stylex.props(styles.iconWrapper)}>
        <IconButton
          className="gf-explore-logs-table-action"
          xstyle={[styles.action, styles.iconAction]}
          tooltip={t('explore.logs-table.action-buttons.view-log-line', 'View log line')}
          variant="secondary"
          aria-label={t('explore.logs-table.action-buttons.view-log-line', 'View log line')}
          tooltipPlacement="top"
          size="md"
          name="eye"
          onClick={handleViewClick}
          tabIndex={0}
        />
        <ClipboardButton
          className="gf-explore-logs-table-action"
          xstyle={[styles.action, styles.clipboardAction]}
          icon="share-alt"
          variant="secondary"
          fill="text"
          size="md"
          tooltip={t('explore.logs-table.action-buttons.copy-link', 'Copy link to log line')}
          tooltipPlacement="top"
          tabIndex={0}
          aria-label={t('explore.logs-table.action-buttons.copy-link', 'Copy link to log line')}
          getText={getText}
        />
      </div>
      {isInspecting && (
        <Modal
          onDismiss={() => setIsInspecting(false)}
          isOpen={true}
          title={t('explore.logs-table.action-buttons.inspect-value', 'Inspect value')}
        >
          <pre>{getLineValue()}</pre>
          <Modal.ButtonRow>
            <ClipboardButton icon="copy" getText={() => getLineValue()}>
              {t('explore.logs-table.action-buttons.copy-to-clipboard', 'Copy to Clipboard')}
            </ClipboardButton>
          </Modal.ButtonRow>
        </Modal>
      )}
    </>
  );
});

LogsTableActionButtons.displayName = 'LogsTableActionButtons';

const styles = stylex.create({
  action: {
    gap: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    borderRadius: shape['--gf-shape-radius-default'],
    width: '28px',
    height: '32px',
    display: 'inline-flex',
    justifyContent: 'center',
  },
  iconAction: {
    color: { default: colors['--gf-colors-secondary-text'], ':hover': colors['--gf-colors-text-link'] },
    cursor: { default: null, ':hover': 'pointer' },
  },
  // Over Button's secondary text look: the :hover background came after its focus and active rules.
  clipboardAction: {
    color: { default: colors['--gf-colors-secondary-text'], ':hover': colors['--gf-colors-text-link'] },
    backgroundColor: {
      default: 'transparent',
      ':hover': 'transparent',
      ':focus': { default: colors['--gf-colors-secondary-transparent'], ':hover': 'transparent' },
      ':active': 'transparent',
    },
  },
  iconWrapper: {
    backgroundColor: colors['--gf-colors-background-secondary'],
    boxShadow: shadows['--gf-shadows-z2'],
    display: 'flex',
    flexDirection: 'row',
    height: '35px',
    left: 0,
    top: 0,
    padding: 0,
    position: 'absolute',
    zIndex: 1,
    alignItems: 'center',
    // Fix switching icon direction when cell is numeric (rtl)
    direction: 'ltr',
  },
});
