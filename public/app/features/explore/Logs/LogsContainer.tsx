import { useEffect, useState } from 'react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  type AbsoluteTimeRange,
  hasLogsContextSupport,
  hasLogsContextUiSupport,
  type LoadingState,
  type LogRowModel,
  type RawTimeRange,
  type EventBus,
  type SplitOpen,
  type DataFrame,
  SupplementaryQueryType,
  type DataQueryResponse,
  type LogRowContextOptions,
  type DataSourceWithLogsContextSupport,
  type DataSourceApi,
  hasToggleableQueryFiltersSupport,
  type DataSourceWithQueryModificationSupport,
  hasQueryModificationSupport,
} from '@grafana/data';
import { t } from '@grafana/i18n';
import { getDataSourceSrv } from '@grafana/runtime';
import { type DataQuery } from '@grafana/schema';
import { PanelChrome } from '@grafana/ui';
import { MIXED_DATASOURCE_NAME } from 'app/plugins/datasource/mixed/MixedDataSource';
import { type GetFieldLinksFn } from 'app/plugins/panel/logs/types';
import { type StoreState } from 'app/types/store';

import { getTimeZone } from '../../profile/state/selectors';
import { loadSupplementaryQueryData, selectIsWaitingForData, setSupplementaryQueryEnabled } from '../state/query';
import { updateTimeRange, loadMoreLogs } from '../state/time';
import { LiveTailControls } from '../useLiveTailControls';
import { getFieldLinksForExplore } from '../utils/links';

import { LiveLogsWithTheme } from './LiveLogs';
import { Logs } from './Logs';
import { LogsCrossFadeTransition } from './utils/LogsCrossFadeTransition';

interface LogsContainerProps {
  width: number;
  exploreId: string;
  scanRange?: RawTimeRange;
  syncedTimes: boolean;
  loadingState: LoadingState;
  onClickFilterLabel: (key: string, value: string, frame?: DataFrame) => void;
  onClickFilterOutLabel: (key: string, value: string, frame?: DataFrame) => void;
  onStartScanning: () => void;
  onStopScanning: () => void;
  eventBus: EventBus;
  splitOpenFn: SplitOpen;
  isFilterLabelActive: (key: string, value: string, refId?: string) => Promise<boolean>;
  onClickFilterString: (value: string, refId?: string) => void;
  onClickFilterOutString: (value: string, refId?: string) => void;
  onPinLineCallback?: () => void;
}

type DataSourceInstance =
  | DataSourceApi<DataQuery>
  | (DataSourceApi<DataQuery> & DataSourceWithLogsContextSupport<DataQuery>)
  | (DataSourceApi<DataQuery> & DataSourceWithQueryModificationSupport<DataQuery>);

function getQuery(
  logsQueries: DataQuery[] | undefined,
  row: LogRowModel,
  datasourceInstance: DataSourceApi<DataQuery> & DataSourceWithLogsContextSupport<DataQuery>
) {
  return (logsQueries ?? []).find(
    (q) => q.refId === row.dataFrame.refId && q.datasource != null && q.datasource.type === datasourceInstance.type
  );
}

export default function LogsContainer({
  width,
  exploreId,
  syncedTimes,
  loadingState,
  onClickFilterLabel,
  onClickFilterOutLabel,
  onStartScanning,
  onStopScanning,
  eventBus,
  splitOpenFn,
  isFilterLabelActive,
  onClickFilterString,
  onClickFilterOutString,
  onPinLineCallback,
}: LogsContainerProps) {
  const dispatch = useDispatch();

  const explore = useSelector((state: StoreState) => state.explore);
  const item = explore.panes[exploreId]!;
  const {
    logsResult,
    scanning,
    datasourceInstance,
    isLive,
    isPaused,
    clearedAtIndex,
    range,
    absoluteRange,
    supplementaryQueries,
  } = item;
  const loading = useSelector(selectIsWaitingForData(exploreId));
  const panelState = item.panelsState;
  const timeZone = useSelector((state: StoreState) => getTimeZone(state.user));
  const logsVolume = supplementaryQueries[SupplementaryQueryType.LogsVolume];

  const logRows = logsResult?.rows;
  const logsMeta = logsResult?.meta;
  const logsSeries = logsResult?.series;
  const logsQueries = logsResult?.queries;
  const visibleRange = logsResult?.visibleRange;
  const logsFrames = item.queryResponse.logsFrames;

  const [dsInstances, setDsInstances] = useState<Record<string, DataSourceInstance>>({});

  useEffect(() => {
    updateDataSourceInstances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logsQueries]);

  function updateDataSourceInstances() {
    if (!logsQueries || !datasourceInstance) {
      return;
    }

    const instances: Record<string, DataSourceInstance> = {};

    if (datasourceInstance.uid !== MIXED_DATASOURCE_NAME) {
      logsQueries.forEach(({ refId }) => {
        instances[refId] = datasourceInstance;
      });
      setDsInstances(instances);
      return;
    }

    const dsPromises: Array<Promise<{ ds: DataSourceApi; refId: string }>> = [];
    for (const query of logsQueries) {
      if (!query.datasource) {
        continue;
      }
      const mustCheck = !instances[query.refId] || instances[query.refId].uid !== query.datasource.uid;
      if (mustCheck) {
        dsPromises.push(
          new Promise((resolve) => {
            getDataSourceSrv()
              .get(query.datasource)
              .then((ds) => {
                resolve({ ds, refId: query.refId });
              });
          })
        );
      }
    }

    if (!dsPromises.length) {
      return;
    }

    Promise.all(dsPromises).then((resolved) => {
      resolved.forEach(({ ds, refId }) => {
        instances[refId] = ds;
      });
      setDsInstances(instances);
    });
  }

  const onChangeTime = (absoluteRange: AbsoluteTimeRange) => {
    dispatch(updateTimeRange({ exploreId, absoluteRange }));
  };

  const onLoadMoreLogs = (absoluteRange: AbsoluteTimeRange) => {
    dispatch(loadMoreLogs({ exploreId, absoluteRange }));
  };

  const getLogRowContext = async (
    row: LogRowModel,
    origRow: LogRowModel,
    options: LogRowContextOptions
  ): Promise<DataQueryResponse> => {
    if (!origRow.dataFrame.refId || !dsInstances[origRow.dataFrame.refId]) {
      return Promise.resolve({ data: [] });
    }

    const ds = dsInstances[origRow.dataFrame.refId];
    if (!hasLogsContextSupport(ds)) {
      return Promise.resolve({ data: [] });
    }

    const query = getQuery(logsQueries, origRow, ds);
    return query
      ? ds.getLogRowContext(row, options, query)
      : Promise.resolve({ data: [] });
  };

  const getLogRowContextQuery = async (
    row: LogRowModel,
    options?: LogRowContextOptions,
    cacheFilters = true
  ): Promise<DataQuery | null> => {
    if (!row.dataFrame.refId || !dsInstances[row.dataFrame.refId]) {
      return Promise.resolve(null);
    }

    const ds = dsInstances[row.dataFrame.refId];
    if (!hasLogsContextSupport(ds)) {
      return Promise.resolve(null);
    }

    const query = getQuery(logsQueries, row, ds);
    return query && ds.getLogRowContextQuery
      ? ds.getLogRowContextQuery(row, options, query, cacheFilters)
      : Promise.resolve(null);
  };

  const getLogRowContextUi = (row: LogRowModel, runContextQuery?: () => void): React.ReactNode => {
    if (!row.dataFrame.refId || !dsInstances[row.dataFrame.refId]) {
      return <></>;
    }

    const ds = dsInstances[row.dataFrame.refId];
    if (!hasLogsContextSupport(ds)) {
      return <></>;
    }

    const query = getQuery(logsQueries, row, ds);
    return query && hasLogsContextUiSupport(ds) && ds.getLogRowContextUi ? (
      ds.getLogRowContextUi(row, runContextQuery, query)
    ) : (
      <></>
    );
  };

  const showContextToggle = (row?: LogRowModel): boolean => {
    if (!row?.dataFrame.refId || !dsInstances[row.dataFrame.refId]) {
      return false;
    }
    return hasLogsContextSupport(dsInstances[row.dataFrame.refId]);
  };

  const getFieldLinks: GetFieldLinksFn = (field, rowIndex, dataFrame, vars) => {
    return getFieldLinksForExplore({ field, rowIndex, splitOpenFn, range, dataFrame, vars });
  };

  const logDetailsFilterAvailable = () => {
    return Object.values(dsInstances).some(
      (ds) => ds?.modifyQuery || hasQueryModificationSupport(ds) || hasToggleableQueryFiltersSupport(ds)
    );
  };

  const filterValueAvailable = () => {
    return Object.values(dsInstances).some(
      (ds) => hasQueryModificationSupport(ds) && ds?.getSupportedQueryModifications().includes('ADD_STRING_FILTER')
    );
  };

  const filterOutValueAvailable = () => {
    return Object.values(dsInstances).some(
      (ds) => hasQueryModificationSupport(ds) && ds?.getSupportedQueryModifications().includes('ADD_STRING_FILTER_OUT')
    );
  };

  const loadLogsVolumeData = () => {
    dispatch(loadSupplementaryQueryData(exploreId, SupplementaryQueryType.LogsVolume));
  };

  const onSetLogsVolumeEnabled = (enabled: boolean) => {
    dispatch(setSupplementaryQueryEnabled(exploreId, enabled, SupplementaryQueryType.LogsVolume));
  };

  if (!logRows) {
    return null;
  }

  return (
    <>
      <LogsCrossFadeTransition visible={isLive}>
        <PanelChrome title={t('explore.logs-container.label-logs', 'Logs')}>
          <LiveTailControls exploreId={exploreId}>
            {(controls) => (
              <LiveLogsWithTheme
                logRows={logRows}
                timeZone={timeZone}
                stopLive={controls.stop}
                isPaused={isPaused}
                onPause={controls.pause}
                onResume={controls.resume}
                onClear={controls.clear}
                clearedAtIndex={clearedAtIndex}
              />
            )}
          </LiveTailControls>
        </PanelChrome>
      </LogsCrossFadeTransition>
      <LogsCrossFadeTransition visible={!isLive}>
        <Logs
          exploreId={exploreId}
          datasourceType={datasourceInstance?.type}
          logRows={logRows}
          logsMeta={logsMeta}
          logsSeries={logsSeries}
          logsVolumeEnabled={logsVolume.enabled}
          onSetLogsVolumeEnabled={onSetLogsVolumeEnabled}
          logsVolumeData={logsVolume.data}
          logsQueries={logsQueries}
          width={width}
          splitOpen={splitOpenFn}
          loading={loading}
          loadingState={loadingState}
          loadLogsVolumeData={loadLogsVolumeData}
          onChangeTime={onChangeTime}
          loadMoreLogs={onLoadMoreLogs}
          onClickFilterLabel={logDetailsFilterAvailable() ? onClickFilterLabel : undefined}
          onClickFilterOutLabel={logDetailsFilterAvailable() ? onClickFilterOutLabel : undefined}
          onStartScanning={onStartScanning}
          onStopScanning={onStopScanning}
          absoluteRange={absoluteRange}
          visibleRange={visibleRange}
          timeZone={timeZone}
          scanning={scanning}
          scanRange={range.raw}
          showContextToggle={showContextToggle}
          getRowContext={getLogRowContext}
          getRowContextQuery={getLogRowContextQuery}
          getLogRowContextUi={getLogRowContextUi}
          getFieldLinks={getFieldLinks}
          eventBus={eventBus}
          panelState={panelState}
          logsFrames={logsFrames}
          isFilterLabelActive={logDetailsFilterAvailable() ? isFilterLabelActive : undefined}
          range={range}
          onPinLineCallback={onPinLineCallback}
          onClickFilterString={filterValueAvailable() ? onClickFilterString : undefined}
          onClickFilterOutString={filterOutValueAvailable() ? onClickFilterOutString : undefined}
        />
      </LogsCrossFadeTransition>
    </>
  );
}
