import * as stylex from '@stylexjs/stylex';
import { useCallback, useState } from 'react';

import { type FieldConfigSource, LogSortOrderChangeEvent, LogsSortOrder, type PanelProps, store } from '@grafana/data';
import { getAppEvents } from '@grafana/runtime';
import { type TableOptions } from '@grafana/schema';
import { components, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { getDefaultFieldSelectorWidth } from 'app/features/logs/components/fieldSelector/FieldSelector';
import { getDefaultControlsExpandedMode } from 'app/features/logs/components/panel/LogListContext';
import { CONTROLS_WIDTH_EXPANDED } from 'app/features/logs/components/panel/LogListControls';
import { LogTableControls } from 'app/features/logs/components/panel/LogTableControls';
import { LOG_LIST_CONTROLS_WIDTH } from 'app/features/logs/components/panel/virtualization';
import { dataFrameToLogsModel } from 'app/features/logs/logsModel';
import { type DownloadFormat, downloadLogs as download } from 'app/features/logs/utils';

import { TablePanel } from '../table/TablePanel';

import { type Options } from './options/types';
import { defaultOptions } from './panelcfg.gen';

interface Props extends Omit<PanelProps<Options>, 'timeRange'> {
  initialRowIndex?: number;
  logOptionsStorageKey: string;
  containerElement: HTMLDivElement;
  onWrapTextClick: () => void;
}

export function TableNGWrap({
  timeZone,
  id,
  data,
  options,
  onOptionsChange,
  height,
  width: tableWidth,
  transparent,
  fieldConfig,
  renderCounter,
  title,
  eventBus,
  onFieldConfigChange,
  replaceVariables,
  onChangeTimeRange,
  initialRowIndex,
  logOptionsStorageKey,
  containerElement,
  onWrapTextClick,
}: Props) {
  const fieldSelectorWidth = options.fieldSelectorWidth ?? getDefaultFieldSelectorWidth();
  const showControls = options.showControls ?? defaultOptions.showControls ?? true;
  const controlsExpandedFromStore = store.getBool(
    `${logOptionsStorageKey}.controlsExpanded`,
    getDefaultControlsExpandedMode(containerElement ?? null)
  );

  const [controlsExpanded, setControlsExpanded] = useState(controlsExpandedFromStore);
  const controlsWidth = !showControls ? 0 : controlsExpanded ? CONTROLS_WIDTH_EXPANDED : LOG_LIST_CONTROLS_WIDTH;

  // Callbacks
  const onTableOptionsChange = useCallback(
    (options: TableOptions) => {
      onOptionsChange(options);
    },
    [onOptionsChange]
  );

  const handleSortOrderChange = useCallback(
    (sortOrder: LogsSortOrder) => {
      getAppEvents().publish(
        new LogSortOrderChangeEvent({
          order: sortOrder,
        })
      );
      onOptionsChange({ ...options, sortOrder });
    },
    [onOptionsChange, options]
  );

  const handleTableOnFieldConfigChange = useCallback(
    (fieldConfig: FieldConfigSource) => {
      onFieldConfigChange(fieldConfig);
    },
    [onFieldConfigChange]
  );

  const downloadLogs = useCallback(
    (format: DownloadFormat) => {
      // converting to logsModel is a lot of unnecessary compute, but since this is only called on user action it should work as a short-term solution
      const { meta, rows } = dataFrameToLogsModel(data.series);
      download(format, rows, meta, options.displayedFields);
    },
    [data.series, options.displayedFields]
  );

  return (
    <div {...stylex.props(styles.tableWrapper(fieldSelectorWidth, controlsWidth, height, tableWidth))}>
      {showControls && (
        <div
          {...stylex.props(
            styles.listControlsWrapper,
            styles.listControlsWidth(controlsWidth),
            !title && styles.listControlsWrapperNoTitle
          )}
        >
          <LogTableControls
            logOptionsStorageKey={logOptionsStorageKey}
            controlsExpanded={controlsExpanded}
            setControlsExpanded={setControlsExpanded}
            sortOrder={options.sortOrder ?? LogsSortOrder.Descending}
            setSortOrder={handleSortOrderChange}
            downloadLogs={downloadLogs}
            onWrapTextClick={onWrapTextClick}
            wrapText={Boolean(options.wrapText)}
          />
        </div>
      )}

      <TablePanel
        sortByBehavior={'managed'}
        initialRowIndex={initialRowIndex}
        data={data}
        timeRange={data.timeRange}
        width={Math.max(tableWidth - fieldSelectorWidth - controlsWidth, 0)}
        height={height}
        id={id}
        timeZone={timeZone}
        options={options}
        transparent={transparent}
        fieldConfig={fieldConfig}
        renderCounter={renderCounter}
        title={title}
        eventBus={eventBus}
        onOptionsChange={onTableOptionsChange}
        onFieldConfigChange={handleTableOnFieldConfigChange}
        replaceVariables={replaceVariables}
        onChangeTimeRange={onChangeTimeRange}
      />
    </div>
  );
}

const styles = stylex.create({
  listControlsWrapper: {
    height: '100%',
    marginTop: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  listControlsWidth: (width: number) => ({
    width,
  }),
  // Needed to keep the panel menu from overlapping the logs options when there's no title; -5px is the table
  // header offset.
  listControlsWrapperNoTitle: {
    marginTop: `calc(${spacing['--gf-spacing-grid-size']} * ${components['--gf-components-panel-header-height']} + -5px)`,
  },
  tableWrapper: (paddingLeft: number, paddingRight: number, height: number, width: number) => ({
    position: 'relative',
    paddingLeft,
    paddingRight,
    height,
    width,
  }),
});
