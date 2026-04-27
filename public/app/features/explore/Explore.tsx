import { css, cx } from '@emotion/css';
import { get, groupBy } from 'lodash';
import { useRef, useState } from 'react';
import AutoSizer, { type HorizontalSize } from 'react-virtualized-auto-sizer';

import {
  type AbsoluteTimeRange,
  type DataFrame,
  type EventBus,
  getNextRefId,
  type GrafanaTheme2,
  hasToggleableQueryFiltersSupport,
  LoadingState,
  type QueryFixAction,
  type RawTimeRange,
  type SplitOpenOptions,
  store,
  SupplementaryQueryType,
} from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { getDataSourceSrv, reportInteraction } from '@grafana/runtime';
import { type DataQuery } from '@grafana/schema';
import {
  type AdHocFilterItem,
  ErrorBoundaryAlert,
  PanelContainer,
  ScrollContainer,
  useStyles2,
} from '@grafana/ui';
import { FILTER_FOR_OPERATOR, FILTER_OUT_OPERATOR } from '@grafana/ui/internal';
import { supportedFeatures } from 'app/core/history/richHistoryStorageProvider';
import { MIXED_DATASOURCE_NAME } from 'app/plugins/datasource/mixed/MixedDataSource';
import { type StoreState, useDispatch, useSelector } from 'app/types/store';

import { getTimeZone } from '../profile/state/selectors';

import { CONTENT_OUTLINE_LOCAL_STORAGE_KEYS, ContentOutline } from './ContentOutline/ContentOutline';
import { ContentOutlineContextProvider } from './ContentOutline/ContentOutlineContext';
import { ContentOutlineItem } from './ContentOutline/ContentOutlineItem';
import { CorrelationHelper } from './CorrelationHelper';
import { CustomContainer } from './CustomContainer';
import { ExploreToolbar } from './ExploreToolbar';
import { FlameGraphExploreContainer } from './FlameGraph/FlameGraphExploreContainer';
import { GraphContainer } from './Graph/GraphContainer';
import LogsContainer from './Logs/LogsContainer';
import { LogsSamplePanel } from './Logs/LogsSamplePanel';
import { NoData } from './NoData';
import { NoDataSourceCallToAction } from './NoDataSourceCallToAction';
import { NodeGraphContainer } from './NodeGraph/NodeGraphContainer';
import { QueryRows } from './QueryRows';
import RawPrometheusContainer from './RawPrometheus/RawPrometheusContainer';
import { ResponseErrorContainer } from './ResponseErrorContainer';
import { SecondaryActions } from './SecondaryActions';
import TableContainer from './Table/TableContainer';
import { TraceViewContainer } from './TraceView/TraceViewContainer';
import { changeDatasource } from './state/datasource';
import { changeSize, changeCompactMode } from './state/explorePane';
import { splitOpen } from './state/main';
import {
  addQueryRow,
  modifyQueries,
  scanStart,
  scanStopAction,
  setQueries,
  setSupplementaryQueryEnabled,
} from './state/query';
import { updateTimeRange } from './state/time';

const getStyles = (theme: GrafanaTheme2) => {
  return {
    exploreMain: css({
      label: 'exploreMain',
      position: 'relative',
      marginTop: theme.spacing(3),
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1),
    }),
    queryContainer: css({
      label: 'queryContainer',
      padding: theme.spacing(1),
    }),
    exploreContainer: css({
      label: 'exploreContainer',
      display: 'flex',
      flexDirection: 'column',
      paddingRight: theme.spacing(2),
      marginBottom: theme.spacing(2),
    }),
    wrapper: css({
      position: 'absolute',
      top: 0,
      left: theme.spacing(2),
      right: 0,
      bottom: 0,
      display: 'flex',
    }),
  };
};

export interface ExploreProps {
  exploreId: string;
  eventBus: EventBus;
  setShowQueryInspector: (value: boolean) => void;
  showQueryInspector: boolean;
}

/**
 * Explore provides an area for quick query iteration for a given datasource.
 * Once a datasource is selected it populates the query section at the top.
 * When queries are run, their results are being displayed in the main section.
 * The datasource determines what kind of query editor it brings, and what kind
 * of results viewers it supports. The state is managed entirely in Redux.
 *
 * SPLIT VIEW
 *
 * Explore can have two Explore areas side-by-side. This is handled in `Wrapper.tsx`.
 * Since there can be multiple Explores (e.g., left and right) each action needs
 * the `exploreId` as first parameter so that the reducer knows which Explore state
 * is affected.
 *
 * DATASOURCE REQUESTS
 *
 * A click on Run Query creates transactions for all DataQueries for all expanded
 * result viewers. New runs are discarding previous runs. Upon completion a transaction
 * saves the result. The result viewers construct their data from the currently existing
 * transactions.
 *
 * The result viewers determine some of the query options sent to the datasource, e.g.,
 * `format`, to indicate eventual transformations by the datasources' result transformers.
 */
export function Explore({
  exploreId,
  eventBus,
  setShowQueryInspector,
  showQueryInspector,
}: ExploreProps) {
  const dispatch = useDispatch();
  const styles = useStyles2(getStyles);

  const [contentOutlineVisible, setContentOutlineVisible] = useState(
    store.getBool(CONTENT_OUTLINE_LOCAL_STORAGE_KEYS.visible, true)
  );

  const scrollElementRef = useRef<HTMLDivElement | undefined>(undefined);

  const graphEventBus = useRef(eventBus.newScopedBus('graph', { onlyLocal: false }));
  const logsEventBus = useRef(eventBus.newScopedBus('logs', { onlyLocal: false }));

  const exploreState = useSelector((state: StoreState) => state.explore);
  const { syncedTimes, correlationEditorDetails } = exploreState;
  const item = exploreState.panes[exploreId]!;

  const timeZone = useSelector((state: StoreState) => getTimeZone(state.user));

  const {
    datasourceInstance,
    queryKeys,
    queries,
    isLive,
    graphResult,
    tableResult,
    logsResult,
    showLogs,
    showMetrics,
    showTable,
    showTrace,
    showCustom,
    queryResponse,
    showNodeGraph,
    showFlameGraph,
    showRawPrometheus,
    supplementaryQueries,
    correlationEditorHelperData,
    compact,
    queryLibraryRef,
    queriesChangedIndexAtRun,
  } = item;

  const logsSample = supplementaryQueries[SupplementaryQueryType.LogsSample];
  const showLogsSample = !!(logsSample.dataProvider !== undefined && !logsResult && (graphResult || tableResult));

  const onChangeTime = (rawRange: RawTimeRange) => {
    dispatch(updateTimeRange({ exploreId, rawRange }));
  };

  const onCellFilterAdded = (filter: AdHocFilterItem) => {
    const { value, key, operator } = filter;
    if (operator === FILTER_FOR_OPERATOR) {
      onClickFilterLabel(key, value);
    }
    if (operator === FILTER_OUT_OPERATOR) {
      onClickFilterOutLabel(key, value);
    }
  };

  const onContentOutlineToogle = () => {
    store.set(CONTENT_OUTLINE_LOCAL_STORAGE_KEYS.visible, !contentOutlineVisible);
    const newContentOutlineVisible = compact ? true : !contentOutlineVisible;
    reportInteraction('explore_toolbar_contentoutline_clicked', {
      item: 'outline',
      type: newContentOutlineVisible ? 'open' : 'close',
    });
    setContentOutlineVisible(newContentOutlineVisible);
    dispatch(changeCompactMode(exploreId, false));
  };

  const isFilterLabelActive = async (key: string, value: string | number, refId?: string) => {
    const query = queries.find((q) => q.refId === refId);
    if (!query) {
      return false;
    }
    const ds = await getDataSourceSrv().get(query.datasource);
    if (hasToggleableQueryFiltersSupport(ds) && ds.queryHasFilter(query, { key, value: value.toString() })) {
      return true;
    }
    return false;
  };

  const onModifyQueries = (action: QueryFixAction, refId?: string) => {
    const modifier = async (query: DataQuery, modification: QueryFixAction) => {
      if (refId && refId !== query.refId) {
        return query;
      }
      const { datasource } = query;
      if (datasource == null) {
        return query;
      }
      const ds = await getDataSourceSrv().get(datasource);
      const toggleableFilters = ['ADD_FILTER', 'ADD_FILTER_OUT'];
      if (hasToggleableQueryFiltersSupport(ds) && toggleableFilters.includes(modification.type)) {
        return ds.toggleQueryFilter(query, {
          type: modification.type === 'ADD_FILTER' ? 'FILTER_FOR' : 'FILTER_OUT',
          options: modification.options ?? {},
          frame: modification.frame,
        });
      }
      if (ds.modifyQuery) {
        return ds.modifyQuery(query, modification);
      } else {
        return query;
      }
    };
    dispatch(modifyQueries(exploreId, action, modifier));
  };

  const onClickFilterLabel = (key: string, value: string | number, frame?: DataFrame) => {
    onModifyQueries({ type: 'ADD_FILTER', options: { key, value: value.toString() }, frame }, frame?.refId);
  };

  const onClickFilterOutLabel = (key: string, value: string | number, frame?: DataFrame) => {
    onModifyQueries({ type: 'ADD_FILTER_OUT', options: { key, value: value.toString() }, frame }, frame?.refId);
  };

  const onClickFilterString = (value: string | number, refId?: string) => {
    onModifyQueries({ type: 'ADD_STRING_FILTER', options: { value: value.toString() } }, refId);
  };

  const onClickFilterOutString = (value: string | number, refId?: string) => {
    onModifyQueries({ type: 'ADD_STRING_FILTER_OUT', options: { value: value.toString() } }, refId);
  };

  const onClickAddQueryRowButton = () => {
    dispatch(addQueryRow(exploreId, queryKeys.length));
  };

  const onResize = (size: HorizontalSize) => {
    dispatch(changeSize(exploreId, size));
  };

  const onStartScanning = () => {
    dispatch(scanStart(exploreId));
  };

  const onStopScanning = () => {
    dispatch(scanStopAction({ exploreId }));
  };

  const onUpdateTimeRange = (absoluteRange: AbsoluteTimeRange) => {
    dispatch(updateTimeRange({ exploreId, absoluteRange }));
  };

  const onSplitOpen = (panelType: string) => {
    return async (options?: SplitOpenOptions) => {
      let compact = false;

      /**
       * Temporary fix grafana-clickhouse-datasource as it requires the query editor to be fully rendered to update the query
       * Proposed fixes:
       * - https://github.com/grafana/clickhouse-datasource/issues/1363 - handle query update in data source
       * - https://github.com/grafana/grafana/issues/110868 - allow data links to provide meta info if the link can be handled in compact mode (default to false)
       * Update:
       * More data source may struggle with this setting: https://github.com/grafana/grafana/issues/112075
       * We're making it enabled for tempo only and will try to make it optional for other data sources in the future.
       */
      const dsType = getDataSourceSrv().getInstanceSettings({ uid: options?.datasourceUid })?.type;
      if (dsType === 'tempo' || options?.queries?.every((q) => q.datasource?.type === 'tempo')) {
        compact = true;
      }

      dispatch(splitOpen(options ? { ...options, compact } : options));
      if (options && datasourceInstance) {
        const target = (await getDataSourceSrv().get(options.datasourceUid)).type;
        const source =
          datasourceInstance.uid === MIXED_DATASOURCE_NAME
            ? get(queries, '0.datasource.type')
            : datasourceInstance.type;
        const tracking = {
          origin: 'panel',
          panelType,
          source,
          target,
          exploreId,
        };
        reportInteraction('grafana_explore_split_view_opened', tracking);
      }
    };
  };

  const onPinLineCallback = () => {
    setContentOutlineVisible(true);
  };

  const splitOpenFnLogs = onSplitOpen('logs');

  const renderEmptyState = (exploreContainerStyles: string) => (
    <div className={cx(exploreContainerStyles)}>
      <NoDataSourceCallToAction />
    </div>
  );

  const renderNoData = () => <NoData />;

  const renderCustom = (width: number) => {
    const groupedByPlugin = groupBy(queryResponse?.customFrames, 'meta.preferredVisualisationPluginId');

    return Object.entries(groupedByPlugin).map(([pluginId, frames], index) => (
      <ContentOutlineItem panelId={pluginId} title={pluginId} icon="plug" key={index}>
        <CustomContainer
          key={index}
          timeZone={timeZone}
          pluginId={pluginId}
          frames={frames}
          state={queryResponse.state}
          timeRange={queryResponse.timeRange}
          height={400}
          width={width}
          splitOpenFn={onSplitOpen(pluginId)}
          eventBus={eventBus}
        />
      </ContentOutlineItem>
    ));
  };

  const renderGraphPanel = (width: number) => (
    <ContentOutlineItem panelId="Graph" title={t('explore.explore.title-graph', 'Graph')} icon="graph-bar">
      <GraphContainer
        data={graphResult!}
        height={showFlameGraph ? 180 : 400}
        width={width}
        timeRange={queryResponse.timeRange}
        timeZone={timeZone}
        onChangeTime={onUpdateTimeRange}
        annotations={queryResponse.annotations}
        splitOpenFn={onSplitOpen('graph')}
        loadingState={queryResponse.state}
        eventBus={graphEventBus.current}
        queriesChangedIndexAtRun={queriesChangedIndexAtRun}
      />
    </ContentOutlineItem>
  );

  const renderTablePanel = (width: number) => (
    <ContentOutlineItem panelId="Table" title={t('explore.explore.title-table', 'Table')} icon="table">
      <TableContainer
        ariaLabel={selectors.pages.Explore.General.table}
        width={width}
        exploreId={exploreId}
        onCellFilterAdded={onCellFilterAdded}
        timeZone={timeZone}
        splitOpenFn={onSplitOpen('table')}
        eventBus={eventBus}
      />
    </ContentOutlineItem>
  );

  const renderRawPrometheus = (width: number) => (
    <ContentOutlineItem
      panelId="Raw Prometheus"
      title={t('explore.explore.title-raw-prometheus', 'Raw Prometheus')}
      icon="gf-prometheus"
    >
      <RawPrometheusContainer
        showRawPrometheus={true}
        ariaLabel={selectors.pages.Explore.General.table}
        width={width}
        exploreId={exploreId}
        onCellFilterAdded={datasourceInstance?.modifyQuery ? onCellFilterAdded : undefined}
        timeZone={timeZone}
        splitOpenFn={onSplitOpen('table')}
      />
    </ContentOutlineItem>
  );

  const renderLogsPanel = (width: number) => {
    const logsContentOutlineWrapper = css({
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    });
    return (
      <ContentOutlineItem
        panelId="Logs"
        title={t('explore.explore.title-logs', 'Logs')}
        icon="gf-logs"
        className={logsContentOutlineWrapper}
      >
        <LogsContainer
          exploreId={exploreId}
          loadingState={queryResponse.state}
          syncedTimes={syncedTimes}
          width={width - 16}
          onClickFilterLabel={onClickFilterLabel}
          onClickFilterOutLabel={onClickFilterOutLabel}
          onStartScanning={onStartScanning}
          onStopScanning={onStopScanning}
          eventBus={logsEventBus.current}
          splitOpenFn={splitOpenFnLogs}
          isFilterLabelActive={isFilterLabelActive}
          onClickFilterString={onClickFilterString}
          onClickFilterOutString={onClickFilterOutString}
          onPinLineCallback={onPinLineCallback}
        />
      </ContentOutlineItem>
    );
  };

  const renderLogsSamplePanel = () => (
    <ContentOutlineItem
      panelId="Logs Sample"
      title={t('explore.explore.title-logs-sample', 'Logs sample')}
      icon="gf-logs"
    >
      <LogsSamplePanel
        queryResponse={logsSample.data}
        timeZone={timeZone}
        enabled={logsSample.enabled}
        queries={queries}
        datasourceInstance={datasourceInstance}
        splitOpen={onSplitOpen('logsSample')}
        setLogsSampleEnabled={(enabled: boolean) =>
          dispatch(setSupplementaryQueryEnabled(exploreId, enabled, SupplementaryQueryType.LogsSample))
        }
        timeRange={queryResponse.timeRange}
      />
    </ContentOutlineItem>
  );

  const renderNodeGraphPanel = () => {
    const datasourceType = datasourceInstance ? datasourceInstance?.type : 'unknown';
    return (
      <ContentOutlineItem
        panelId="Node Graph"
        title={t('explore.explore.title-node-graph', 'Node graph')}
        icon="code-branch"
      >
        <NodeGraphContainer
          dataFrames={queryResponse.nodeGraphFrames}
          exploreId={exploreId}
          withTraceView={showTrace}
          datasourceType={datasourceType}
          splitOpenFn={onSplitOpen('nodeGraph')}
        />
      </ContentOutlineItem>
    );
  };

  const renderFlameGraphPanel = () => (
    <ContentOutlineItem
      panelId="Flame Graph"
      title={t('explore.explore.title-flame-graph', 'Flame graph')}
      icon="fire"
    >
      <FlameGraphExploreContainer dataFrames={queryResponse.flameGraphFrames} />
    </ContentOutlineItem>
  );

  const renderTraceViewPanel = () => {
    const dataFrames = queryResponse.series.filter((series) => series.meta?.preferredVisualisationType === 'trace');

    return (
      dataFrames.length && (
        <ContentOutlineItem panelId="Traces" title={t('explore.explore.title-traces', 'Traces')} icon="file-alt">
          <TraceViewContainer
            exploreId={exploreId}
            dataFrames={dataFrames}
            splitOpenFn={onSplitOpen('traceView')}
            scrollElement={scrollElementRef.current}
            timeRange={queryResponse.timeRange}
          />
        </ContentOutlineItem>
      )
    );
  };

  const showPanels = queryResponse && queryResponse.state !== LoadingState.NotStarted;
  const richHistoryRowButtonHidden = !supportedFeatures().queryHistoryAvailable;
  const showNoData =
    queryResponse.state === LoadingState.Done &&
    [
      queryResponse.logsFrames,
      queryResponse.graphFrames,
      queryResponse.nodeGraphFrames,
      queryResponse.flameGraphFrames,
      queryResponse.tableFrames,
      queryResponse.rawPrometheusFrames,
      queryResponse.traceFrames,
      queryResponse.customFrames,
    ].every((e) => e.length === 0);

  let correlationsBox = undefined;
  const isCorrelationsEditorMode = correlationEditorDetails?.editorMode;
  const showCorrelationHelper = Boolean(isCorrelationsEditorMode || correlationEditorDetails?.correlationDirty);
  if (showCorrelationHelper && correlationEditorHelperData !== undefined) {
    correlationsBox = <CorrelationHelper exploreId={exploreId} correlations={correlationEditorHelperData} />;
  }

  return (
    <ContentOutlineContextProvider refreshDependencies={queries}>
      <ExploreToolbar
        exploreId={exploreId}
        onChangeTime={onChangeTime}
        onContentOutlineToogle={onContentOutlineToogle}
        isContentOutlineOpen={contentOutlineVisible}
      />
      <div
        style={{
          position: 'relative',
          height: '100%',
          paddingLeft: '16px',
        }}
      >
        <div className={styles.wrapper}>
          {contentOutlineVisible && !compact && (
            <ContentOutline scroller={scrollElementRef.current} panelId={`content-outline-container-${exploreId}`} />
          )}
          <ScrollContainer
            data-testid={selectors.pages.Explore.General.scrollView}
            ref={(scrollElement) => {
              scrollElementRef.current = scrollElement || undefined;
            }}
          >
            <div className={styles.exploreContainer}>
              {datasourceInstance ? (
                <>
                  <ContentOutlineItem
                    panelId="Queries"
                    title={t('explore.explore.title-queries', 'Queries')}
                    icon="arrow"
                    mergeSingleChild={true}
                  >
                    <PanelContainer className={styles.queryContainer}>
                      {correlationsBox}
                      <QueryRows
                        exploreId={exploreId}
                        isOpen={compact ? false : undefined}
                        changeCompactMode={(compact: boolean) => dispatch(changeCompactMode(exploreId, false))}
                      />
                      <SecondaryActions
                        addQueryRowButtonDisabled={
                          isLive || (isCorrelationsEditorMode && datasourceInstance.meta.mixed) || !!queryLibraryRef
                        }
                        addQueryRowButtonHidden={false}
                        richHistoryRowButtonHidden={richHistoryRowButtonHidden}
                        queryInspectorButtonActive={showQueryInspector}
                        onClickAddQueryRowButton={onClickAddQueryRowButton}
                        onClickQueryInspectorButton={() => setShowQueryInspector(!showQueryInspector)}
                        onSelectQueryFromLibrary={async (query) => {
                          const newQueries = [
                            ...queries,
                            {
                              ...query,
                              refId: getNextRefId(queries),
                            },
                          ];
                          dispatch(setQueries(exploreId, newQueries));
                          if (query.datasource?.uid) {
                            const uniqueDatasources = new Set(newQueries.map((q) => q.datasource?.uid));
                            const isMixed = uniqueDatasources.size > 1;
                            const newDatasourceRef = {
                              uid: isMixed ? MIXED_DATASOURCE_NAME : query.datasource.uid,
                            };
                            const shouldChangeDatasource = datasourceInstance.uid !== newDatasourceRef.uid;
                            if (shouldChangeDatasource) {
                              await dispatch(changeDatasource({ exploreId, datasource: newDatasourceRef }));
                            }
                          }
                        }}
                      />
                      <ResponseErrorContainer exploreId={exploreId} />
                    </PanelContainer>
                  </ContentOutlineItem>
                  <AutoSizer onResize={onResize} disableHeight>
                    {({ width }) => {
                      if (width === 0) {
                        return null;
                      }

                      return (
                        <main className={cx(styles.exploreMain)} style={{ width }}>
                          <ErrorBoundaryAlert boundaryName="explore-main">
                            {showPanels && (
                              <>
                                {showMetrics && graphResult && (
                                  <ErrorBoundaryAlert boundaryName="explore-graph-panel">
                                    {renderGraphPanel(width)}
                                  </ErrorBoundaryAlert>
                                )}
                                {showRawPrometheus && (
                                  <ErrorBoundaryAlert boundaryName="explore-raw-prometheus">
                                    {renderRawPrometheus(width)}
                                  </ErrorBoundaryAlert>
                                )}
                                {showTable && (
                                  <ErrorBoundaryAlert boundaryName="explore-table-panel">
                                    {renderTablePanel(width)}
                                  </ErrorBoundaryAlert>
                                )}
                                {showLogs && (
                                  <ErrorBoundaryAlert boundaryName="explore-logs-panel">
                                    {renderLogsPanel(width)}
                                  </ErrorBoundaryAlert>
                                )}
                                {showNodeGraph && (
                                  <ErrorBoundaryAlert boundaryName="explore-node-graph-panel">
                                    {renderNodeGraphPanel()}
                                  </ErrorBoundaryAlert>
                                )}
                                {showFlameGraph && (
                                  <ErrorBoundaryAlert boundaryName="explore-flame-graph-panel">
                                    {renderFlameGraphPanel()}
                                  </ErrorBoundaryAlert>
                                )}
                                {showTrace && (
                                  <ErrorBoundaryAlert boundaryName="explore-trace-view-panel">
                                    {renderTraceViewPanel()}
                                  </ErrorBoundaryAlert>
                                )}
                                {showLogsSample && (
                                  <ErrorBoundaryAlert boundaryName="explore-logs-sample-panel">
                                    {renderLogsSamplePanel()}
                                  </ErrorBoundaryAlert>
                                )}
                                {showCustom && (
                                  <ErrorBoundaryAlert boundaryName="explore-custom-panel">
                                    {renderCustom(width)}
                                  </ErrorBoundaryAlert>
                                )}
                                {showNoData && (
                                  <ErrorBoundaryAlert boundaryName="explore-no-data">
                                    {renderNoData()}
                                  </ErrorBoundaryAlert>
                                )}
                              </>
                            )}
                          </ErrorBoundaryAlert>
                        </main>
                      );
                    }}
                  </AutoSizer>
                </>
              ) : (
                renderEmptyState(styles.exploreContainer)
              )}
            </div>
          </ScrollContainer>
        </div>
      </div>
    </ContentOutlineContextProvider>
  );
}

export default Explore;
