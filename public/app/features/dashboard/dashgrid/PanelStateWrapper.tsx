import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Subscription } from 'rxjs';

import {
  type AbsoluteTimeRange,
  AnnotationChangeEvent,
  type AnnotationEventUIModel,
  CoreApp,
  DashboardCursorSync,
  type DataFrame,
  type EventFilterOptions,
  type FieldConfigSource,
  getDataSourceRef,
  getDefaultTimeRange,
  LoadingState,
  type PanelData,
  type PanelPlugin,
  type PanelPluginMeta,
  PluginContextProvider,
  SetPanelAttentionEvent,
  type TimeRange,
  toDataFrameDTO,
  toUtc,
} from '@grafana/data';
import { RefreshEvent } from '@grafana/runtime';
import { type VizLegendOptions } from '@grafana/schema';
import {
  ErrorBoundary,
  PanelChrome,
  type PanelContext,
  PanelContextProvider,
  type SeriesVisibilityChangeMode,
  type AdHocFilterItem,
} from '@grafana/ui';
import { appEvents } from 'app/core/app_events';
import { profiler } from 'app/core/profiler';
import { annotationServer } from 'app/features/annotations/api';
import { applyPanelTimeOverrides } from 'app/features/dashboard/utils/panel';
import { getDatasourceSrv } from 'app/features/plugins/datasource_srv';
import { applyFilterFromTable } from 'app/features/variables/adhoc/actions';
import { onUpdatePanelSnapshotData } from 'app/plugins/datasource/grafana/utils';
import { changeSeriesColorConfigFactory } from 'app/plugins/panel/timeseries/overrides/colorSeriesConfigFactory';
import { dispatch } from 'app/store/store';
import { RenderEvent } from 'app/types/events';

import { getDashboardQueryRunner } from '../../query/state/DashboardQueryRunner/DashboardQueryRunner';
import { getTimeSrv } from '../services/TimeSrv';
import { type DashboardModel } from '../state/DashboardModel';
import { type PanelModel } from '../state/PanelModel';
import { getPanelChromeProps } from '../utils/getPanelChromeProps';
import { loadSnapshotData } from '../utils/loadSnapshotData';

import { PanelHeaderMenuWrapper } from './PanelHeader/PanelHeaderMenuWrapper';
import { PanelLoadTimeMonitor } from './PanelLoadTimeMonitor';
import { seriesVisibilityConfigFactory } from './SeriesVisibilityConfigFactory';
import { liveTimer } from './liveTimer';
import { PanelOptionsLogger } from './panelOptionsLogger';

const DEFAULT_PLUGIN_ERROR = 'Error in plugin';

export interface Props {
  panel: PanelModel;
  dashboard: DashboardModel;
  plugin: PanelPlugin;
  isViewing: boolean;
  isEditing: boolean;
  isInView: boolean;
  isDraggable?: boolean;
  width: number;
  height: number;
  onInstanceStateChange: (value: unknown) => void;
  timezone?: string;
  hideMenu?: boolean;
}

function getInitialPanelDataState(): PanelData {
  return {
    state: LoadingState.NotStarted,
    series: [],
    timeRange: getDefaultTimeRange(),
  };
}

export function PanelStateWrapper({
  panel,
  dashboard,
  plugin,
  isViewing,
  isEditing,
  isInView,
  isDraggable,
  width,
  height,
  onInstanceStateChange,
  timezone,
  hideMenu,
}: Props) {
  const timeSrv = getTimeSrv();
  const eventFilterRef = useRef<EventFilterOptions>({ onlyLocal: true });

  const getPanelContextApp = useCallback(() => {
    if (isEditing) {
      return CoreApp.PanelEditor;
    }
    if (isViewing) {
      return CoreApp.PanelViewer;
    }
    return CoreApp.Dashboard;
  }, [isEditing, isViewing]);

  const eventBus = useMemo(
    () => dashboard.events.newScopedBus(`panel:${panel.id}`, eventFilterRef.current),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [panel.id, dashboard]
  );

  const panelOptionsLoggerRef = useRef<PanelOptionsLogger | undefined>(undefined);
  if (!panelOptionsLoggerRef.current && getPanelContextApp() === CoreApp.PanelEditor) {
    const panelInfo = {
      panelId: String(panel.id),
      panelType: panel.type,
      panelTitle: panel.title,
    };
    panelOptionsLoggerRef.current = new PanelOptionsLogger(panel.getOptions(), panel.fieldConfig, panelInfo);
  }

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [renderCounter, setRenderCounter] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [data, setData] = useState<PanelData>(getInitialPanelDataState);
  const [liveTime, setLiveTime] = useState<TimeRange | undefined>(undefined);
  const [contextApp, setContextApp] = useState<CoreApp>(getPanelContextApp());
  const [instanceState, setInstanceState] = useState<unknown>(undefined);

  const getSync = useCallback(
    () => (isEditing ? DashboardCursorSync.Off : dashboard.graphTooltip),
    [isEditing, dashboard]
  );

  const onOptionsChange = useCallback(
    (options: object) => {
      panel.updateOptions(options);
    },
    [panel]
  );

  const onFieldConfigChange = useCallback(
    (config: FieldConfigSource) => {
      panel.updateFieldConfig(config);
    },
    [panel]
  );

  const onAnnotationCreate = useCallback(
    async (event: AnnotationEventUIModel) => {
      const isRegion = event.from !== event.to;
      const anno = {
        dashboardUID: dashboard.uid,
        panelId: panel.id,
        isRegion,
        time: event.from,
        timeEnd: isRegion ? event.to : 0,
        tags: event.tags,
        text: event.description,
      };
      await annotationServer().save(anno);
      getDashboardQueryRunner().run({ dashboard, range: timeSrv.timeRange() });
      eventBus.publish(new AnnotationChangeEvent(anno));
    },
    [dashboard, panel, timeSrv, eventBus]
  );

  const onAnnotationDelete = useCallback(
    async (id: string) => {
      await annotationServer().delete({ id });
      getDashboardQueryRunner().run({ dashboard, range: timeSrv.timeRange() });
      eventBus.publish(new AnnotationChangeEvent({ id }));
    },
    [dashboard, timeSrv, eventBus]
  );

  const onAnnotationUpdate = useCallback(
    async (event: AnnotationEventUIModel) => {
      const isRegion = event.from !== event.to;
      const anno = {
        id: event.id,
        dashboardUID: dashboard.uid,
        panelId: panel.id,
        isRegion,
        time: event.from,
        timeEnd: isRegion ? event.to : 0,
        tags: event.tags,
        text: event.description,
      };
      await annotationServer().update(anno);
      getDashboardQueryRunner().run({ dashboard, range: timeSrv.timeRange() });
      eventBus.publish(new AnnotationChangeEvent(anno));
    },
    [dashboard, panel, timeSrv, eventBus]
  );

  const onInstanceStateChangeCallback = useCallback(
    (value: unknown) => {
      onInstanceStateChange(value);
      setInstanceState(value);
    },
    [onInstanceStateChange]
  );

  const onToggleLegendSort = useCallback(
    (sortKey: string) => {
      const legendOptions: VizLegendOptions = panel.options.legend;
      if (!legendOptions) {
        return;
      }

      let sortDesc = legendOptions.sortDesc;
      let sortBy = legendOptions.sortBy;
      if (sortKey !== sortBy) {
        sortDesc = undefined;
      }

      if (sortDesc === false) {
        sortBy = undefined;
        sortDesc = undefined;
      } else {
        sortDesc = !sortDesc;
        sortBy = sortKey;
      }

      onOptionsChange({
        ...panel.options,
        legend: { ...legendOptions, sortBy, sortDesc },
      });
    },
    [panel, onOptionsChange]
  );

  const onSeriesColorChange = useCallback(
    (label: string, color: string) => {
      onFieldConfigChange(changeSeriesColorConfigFactory(label, color, panel.fieldConfig));
    },
    [panel, onFieldConfigChange]
  );

  const onSeriesVisibilityChange = useCallback(
    (label: string | string[] | null, mode: SeriesVisibilityChangeMode) => {
      if (typeof label !== 'string') {
        return;
      }
      onFieldConfigChange(seriesVisibilityConfigFactory(label, mode, panel.fieldConfig, data.series));
    },
    [panel, onFieldConfigChange, data.series]
  );

  const onUpdateData = useCallback(
    (frames: DataFrame[]): Promise<boolean> => {
      return onUpdatePanelSnapshotData(panel, frames);
    },
    [panel]
  );

  const onAddAdHocFilter = useCallback(
    (filterItem: AdHocFilterItem) => {
      const { key, value, operator } = filterItem;
      const datasourceInstance = getDatasourceSrv().getInstanceSettings(panel.datasource);
      const datasourceRef = datasourceInstance && getDataSourceRef(datasourceInstance);
      if (!datasourceRef) {
        return;
      }
      dispatch(applyFilterFromTable({ datasource: datasourceRef, key, operator, value }));
    },
    [panel]
  );

  const panelContextRef = useRef<PanelContext>({
    eventsScope: '__global_',
    eventBus,
    app: contextApp,
    sync: getSync,
    onSeriesColorChange,
    onToggleSeriesVisibility: onSeriesVisibilityChange,
    onAnnotationCreate,
    onAnnotationUpdate,
    onAnnotationDelete,
    onInstanceStateChange: onInstanceStateChangeCallback,
    onToggleLegendSort,
    canAddAnnotations: dashboard.canAddAnnotations.bind(dashboard),
    canEditAnnotations: dashboard.canEditAnnotations.bind(dashboard),
    canDeleteAnnotations: dashboard.canDeleteAnnotations.bind(dashboard),
    canExecuteActions: dashboard.canExecuteActions.bind(dashboard),
    onAddAdHocFilter,
    onUpdateData,
    instanceState,
  });

  // Update context when app changes - runs on every render to check if app changed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const app = getPanelContextApp();
    if (panelContextRef.current.app !== app) {
      setContextApp(app);
      panelContextRef.current = { ...panelContextRef.current, app };
    }
  });

  panelContextRef.current.instanceState = instanceState;

  const hasPanelSnapshot = panel.snapshotData && panel.snapshotData.length;
  const wantsQueryExecution = !(plugin.meta.skipDataQuery || hasPanelSnapshot);

  const onDataUpdate = useCallback(
    (newData: PanelData) => {
      if (plugin.meta.skipDataQuery) {
        setData(getInitialPanelDataState());
        return;
      }

      let newIsFirstLoad = isFirstLoad;
      let newErrorMessage: string | undefined;

      switch (newData.state) {
        case LoadingState.Loading:
          if (data.state === LoadingState.Loading) {
            return;
          }
          break;
        case LoadingState.Error: {
          const { error, errors } = newData;
          if (errors?.length) {
            if (errors.length === 1) {
              newErrorMessage = errors[0].message;
            } else {
              newErrorMessage = 'Multiple errors found. Click for more details';
            }
          } else if (error) {
            if (newErrorMessage !== error.message) {
              newErrorMessage = error.message;
            }
          }
          break;
        }
        case LoadingState.Done:
          if (dashboard.snapshot) {
            panel.snapshotData = newData.series.map((frame) => toDataFrameDTO(frame));
          }
          if (newIsFirstLoad) {
            newIsFirstLoad = false;
          }
          break;
      }

      setIsFirstLoad(newIsFirstLoad);
      setErrorMessage(newErrorMessage);
      setData(newData);
      setLiveTime(undefined);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [plugin.meta.skipDataQuery, dashboard.snapshot, panel, isFirstLoad, data.state]
  );

  const onRefresh = useCallback(() => {
    if (!dashboard.snapshot && !isInView) {
      panel.refreshWhenInView = true;
      return;
    }

    const timeData = applyPanelTimeOverrides(panel, timeSrv.timeRange());

    if (wantsQueryExecution) {
      if (width < 0) {
        return;
      }

      panel.refreshWhenInView = false;
      panel.runAllPanelQueries({
        dashboardUID: dashboard.uid,
        dashboardTimezone: dashboard.getTimezone(),
        dashboardTitle: dashboard.title,
        timeData,
        width,
      });
    } else {
      setData((prev) => ({ ...prev, timeRange: timeSrv.timeRange() }));
      setRenderCounter((c) => c + 1);
      setLiveTime(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboard, panel, isInView, wantsQueryExecution, width, timeSrv]);

  const onRender = useCallback(() => {
    setRenderCounter((c) => c + 1);
  }, []);

  // Mount: setup subscriptions
  useEffect(() => {
    const subs = new Subscription();

    subs.add(panel.events.subscribe(RefreshEvent, onRefresh));
    subs.add(panel.events.subscribe(RenderEvent, onRender));

    dashboard.panelInitialized(panel);

    if (hasPanelSnapshot) {
      setData(loadSnapshotData(panel, dashboard));
      setIsFirstLoad(false);
    } else {
      if (!wantsQueryExecution) {
        setIsFirstLoad(false);
      }

      subs.add(
        panel
          .getQueryRunner()
          .getData({ withTransforms: true, withFieldConfig: true })
          .subscribe({
            next: (newData) => onDataUpdate(newData),
          })
      );
    }

    const liveTimerListener = { liveTimeChanged: handleLiveTimeChanged, isInView, width };
    liveTimer.listen(liveTimerListener);

    return () => {
      subs.unsubscribe();
      liveTimer.remove(liveTimerListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLiveTimeChanged = (newLiveTime: TimeRange) => {
    if (data.timeRange) {
      const delta = newLiveTime.to.valueOf() - data.timeRange.to.valueOf();
      if (delta < 100) {
        return;
      }
    }
    setLiveTime(newLiveTime);
  };

  // Handle isInView change
  const prevIsInViewRef = useRef(isInView);
  useEffect(() => {
    if (isInView !== prevIsInViewRef.current) {
      prevIsInViewRef.current = isInView;
      if (isInView && panel.refreshWhenInView) {
        onRefresh();
      }
    }
  }, [isInView, panel, onRefresh]);

  // Handle width change for live timer - we need to recreate listener ref on width change
  const prevWidthRef = useRef(width);
  useEffect(() => {
    if (width !== prevWidthRef.current) {
      prevWidthRef.current = width;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  const setPanelAttention = useCallback(() => {
    appEvents.publish(new SetPanelAttentionEvent({ panelId: panel.id }));
  }, [panel.id]);

  const debouncedSetPanelAttention = useMemo(
    () => debounce(setPanelAttention, 100),
    [setPanelAttention]
  );

  const onPanelError = useCallback(
    (error: Error) => {
      if (getPanelContextApp() === CoreApp.PanelEditor && panelOptionsLoggerRef.current) {
        panelOptionsLoggerRef.current.logChanges(panel.getOptions(), panel.fieldConfig);
      }

      const msg = error.message || DEFAULT_PLUGIN_ERROR;
      if (errorMessage !== msg) {
        setErrorMessage(msg);
      }
    },
    [panel, errorMessage, getPanelContextApp]
  );

  const onPanelErrorRecover = useCallback(() => {
    setErrorMessage(undefined);
  }, []);

  const onChangeTimeRange = useCallback(
    (timeRange: AbsoluteTimeRange) => {
      timeSrv.setTime({
        from: toUtc(timeRange.from),
        to: toUtc(timeRange.to),
      });
    },
    [timeSrv]
  );

  const shouldSignalRenderingCompleted = (loadingState: LoadingState, pluginMeta: PanelPluginMeta) =>
    loadingState === LoadingState.Done ||
    loadingState === LoadingState.Streaming ||
    loadingState === LoadingState.Error ||
    pluginMeta.skipDataQuery;

  const skipFirstRender = (loadingState: LoadingState) =>
    wantsQueryExecution &&
    isFirstLoad &&
    (loadingState === LoadingState.Loading || loadingState === LoadingState.NotStarted);

  const renderPanelContent = (innerWidth: number, innerHeight: number) => {
    const { state: loadingState } = data;

    if (skipFirstRender(loadingState)) {
      return null;
    }

    if (shouldSignalRenderingCompleted(loadingState, plugin.meta)) {
      profiler.renderingCompleted();
    }

    const PanelComponent = plugin.panel!;
    const panelTimeRange = liveTime ?? data.timeRange ?? timeSrv.timeRange();
    const panelOptions = panel.getOptions();

    eventFilterRef.current.onlyLocal = dashboard.graphTooltip === 0;

    return (
      <>
        <PanelContextProvider value={panelContextRef.current}>
          <PluginContextProvider meta={plugin.meta}>
            <PanelComponent
              id={panel.id}
              data={data}
              title={panel.title}
              timeRange={panelTimeRange}
              timeZone={dashboard.getTimezone()}
              options={panelOptions}
              fieldConfig={panel.fieldConfig}
              transparent={panel.transparent}
              width={innerWidth}
              height={innerHeight}
              renderCounter={renderCounter}
              replaceVariables={panel.replaceVariables}
              onOptionsChange={onOptionsChange}
              onFieldConfigChange={onFieldConfigChange}
              onChangeTimeRange={onChangeTimeRange}
              eventBus={dashboard.events}
            />
            {errorMessage === undefined && (
              <PanelLoadTimeMonitor panelType={plugin.meta.id} panelId={panel.id} panelTitle={panel.title} />
            )}
          </PluginContextProvider>
        </PanelContextProvider>
      </>
    );
  };

  const panelChromeProps = getPanelChromeProps({ panel, dashboard, plugin, isViewing, isEditing, isInView, isDraggable, width, height, data });

  const hoverHeaderOffset = (panel.gridPos?.y ?? 0) === 0 ? -16 : undefined;

  const menu = (
    <div data-testid="panel-dropdown">
      <PanelHeaderMenuWrapper panel={panel} dashboard={dashboard} loadingState={data.state} />
    </div>
  );

  return (
    <PanelChrome
      width={width}
      height={height}
      title={panelChromeProps.title}
      loadingState={data.state}
      statusMessage={errorMessage}
      statusMessageOnClick={panelChromeProps.onOpenErrorInspect}
      description={panelChromeProps.description}
      titleItems={panelChromeProps.titleItems}
      menu={hideMenu ? undefined : menu}
      dragClass={panelChromeProps.dragClass}
      dragClassCancel="grid-drag-cancel"
      padding={panelChromeProps.padding}
      hoverHeaderOffset={hoverHeaderOffset}
      hoverHeader={panelChromeProps.hasOverlayHeader()}
      displayMode={panel.transparent ? 'transparent' : 'default'}
      onCancelQuery={panelChromeProps.onCancelQuery}
      onFocus={setPanelAttention}
      onMouseEnter={setPanelAttention}
      onMouseMove={debouncedSetPanelAttention}
    >
      {(innerWidth, innerHeight) => (
        <>
          <ErrorBoundary
            boundaryName="panel-state-wrapper"
            dependencies={[data, plugin, panel.getOptions()]}
            onError={onPanelError}
            onRecover={onPanelErrorRecover}
          >
            {({ error }) => {
              if (error) {
                return null;
              }
              return renderPanelContent(innerWidth, innerHeight);
            }}
          </ErrorBoundary>
        </>
      )}
    </PanelChrome>
  );
}
