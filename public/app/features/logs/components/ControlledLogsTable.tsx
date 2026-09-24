import * as stylex from '@stylexjs/stylex';
import { useMemo, useRef } from 'react';

import { EventBusSrv } from '@grafana/data';

import { LogsTableWrap } from '../../explore/Logs/LogsTableWrap';

import { type LogRowsComponentProps } from './ControlledLogRows';
import { useLogListContext } from './panel/LogListContext';
import { CONTROLS_WIDTH_EXPANDED, LogListControls } from './panel/LogListControls';
import { LOG_LIST_CONTROLS_WIDTH } from './panel/virtualization';

export const ControlledLogsTable = ({
  loading,
  loadMoreLogs,
  deduplicatedRows = [],
  range,
  splitOpen,
  onClickFilterLabel,
  onClickFilterOutLabel,
  panelState,
  datasourceType,
  updatePanelState,
  width,
  logsTableFrames,
  visualisationType,
  displayedFields,
  exploreId,
  absoluteRange,
  logRows,
  ...rest
}: LogRowsComponentProps) => {
  const { sortOrder, controlsExpanded } = useLogListContext();
  const eventBus = useMemo(() => new EventBusSrv(), []);
  const ref = useRef(null);

  if (!splitOpen || !width || !updatePanelState) {
    console.error('<ControlledLogsTable>: Missing required props.');
    return;
  }

  const tableWidthExpandedControls = width - (CONTROLS_WIDTH_EXPANDED + 12);
  const tableWidth = width - (LOG_LIST_CONTROLS_WIDTH + 12);

  return (
    <div ref={ref} {...stylex.props(styles.logRowsContainer)}>
      <LogListControls eventBus={eventBus} visualisationType={visualisationType} />
      <div {...stylex.props(styles.logRows)} data-testid="logRowsTable">
        {/* Width should be full width minus logs navigation and padding */}
        <LogsTableWrap
          logsSortOrder={sortOrder}
          range={range}
          splitOpen={splitOpen}
          timeZone={rest.timeZone}
          width={controlsExpanded ? tableWidthExpandedControls : tableWidth}
          logsFrames={logsTableFrames ?? []}
          onClickFilterLabel={onClickFilterLabel}
          onClickFilterOutLabel={onClickFilterOutLabel}
          panelState={panelState}
          updatePanelState={updatePanelState}
          datasourceType={datasourceType}
          displayedFields={displayedFields}
          exploreId={exploreId}
          absoluteRange={absoluteRange}
          logRows={logRows}
        />
      </div>
    </div>
  );
};

const styles = stylex.create({
  logRows: {
    overflowY: 'visible',
    width: '100%',
  },
  logRowsContainer: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
});
