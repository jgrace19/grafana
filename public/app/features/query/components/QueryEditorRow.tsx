import classNames from 'classnames';
import { cloneDeep, filter, uniqBy, uniqueId } from 'lodash';
import pluralize from 'pluralize';
import { type ReactNode, type JSX, useEffect, useRef, useState } from 'react';

import {
  CoreApp,
  type DataSourceApi,
  type DataSourceInstanceSettings,
  DataSourcePluginContextProvider,
  type PluginExtensionQueryEditorRowAdaptiveTelemetryV1Context,
  type EventBusExtended,
  type HistoryItem,
  LoadingState,
  type PanelData,
  type QueryResultMetaNotice,
  type TimeRange,
  getDataSourceRef,
  PluginExtensionPoints,
} from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { getDataSourceSrv, renderLimitedComponents, reportInteraction, usePluginComponents } from '@grafana/runtime';
import { type DataQuery } from '@grafana/schema';
import { Badge, ErrorBoundaryAlert, List } from '@grafana/ui';
import { OperationRowHelp } from 'app/core/components/QueryOperationRow/OperationRowHelp';
import {
  QueryOperationAction,
  QueryOperationToggleAction,
} from 'app/core/components/QueryOperationRow/QueryOperationAction';
import {
  QueryOperationRow,
  type QueryOperationRowRenderProps,
} from 'app/core/components/QueryOperationRow/QueryOperationRow';

import { useQueryLibraryContext } from '../../explore/QueryLibrary/QueryLibraryContext';
import { ExpressionDatasourceUID } from '../../expressions/types';

import { type QueryActionComponent, RowActionComponents } from './QueryActionComponent';
import { QueryEditorRowHeader } from './QueryEditorRowHeader';
import { QueryErrorAlert } from './QueryErrorAlert';
import { QueryLibraryEditingContainer } from './QueryLibraryEditingContainer';

export interface Props<TQuery extends DataQuery> {
  data: PanelData;
  query: TQuery;
  queries: TQuery[];
  id: string;
  index: number;
  dataSource: DataSourceInstanceSettings;
  onChangeDataSource?: (dsSettings: DataSourceInstanceSettings) => void;
  onDataSourceLoaded?: (instance: DataSourceApi) => void;
  renderHeaderExtras?: () => ReactNode;
  onAddQuery: (query: TQuery) => void;
  onRemoveQuery: (query: TQuery) => void;
  onChange: (query: TQuery) => void;
  onReplace?: (query: DataQuery) => void;
  onRunQuery: () => void;
  visualization?: ReactNode;
  hideHideQueryButton?: boolean;
  app?: CoreApp;
  range: TimeRange;
  history?: Array<HistoryItem<TQuery>>;
  eventBus?: EventBusExtended;
  hideActionButtons?: boolean;
  onQueryCopied?: () => void;
  onQueryRemoved?: () => void;
  onQueryToggled?: (queryStatus?: boolean | undefined) => void;
  onQueryOpenChanged?: (status?: boolean | undefined) => void;
  onQueryReplacedFromLibrary?: () => void;
  collapsable?: boolean;
  hideRefId?: boolean;
  queryLibraryRef?: string;
  onCancelQueryLibraryEdit?: () => void;
  isOpen?: boolean;
}

export function QueryEditorRow<TQuery extends DataQuery>({
  data,
  query,
  queries,
  id,
  index,
  dataSource,
  onChangeDataSource,
  onDataSourceLoaded,
  renderHeaderExtras,
  onAddQuery,
  onRemoveQuery,
  onChange,
  onReplace,
  onRunQuery,
  visualization,
  hideHideQueryButton = false,
  app = CoreApp.PanelEditor,
  range,
  history,
  eventBus,
  hideActionButtons,
  onQueryCopied,
  onQueryRemoved,
  onQueryToggled,
  onQueryOpenChanged,
  onQueryReplacedFromLibrary,
  collapsable,
  hideRefId,
  queryLibraryRef,
  onCancelQueryLibraryEdit,
  isOpen,
}: Props<TQuery>) {
  const dataSourceSrv = getDataSourceSrv();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const rowId = useRef(uniqueId(id + '_'));

  const [datasource, setDatasource] = useState<DataSourceApi<TQuery> | null>(null);
  const [queriedDataSourceIdentifier, setQueriedDataSourceIdentifier] = useState<string | null | undefined>(undefined);
  const [filteredData, setFilteredData] = useState<PanelData | undefined>(() => filterPanelDataToQuery(data, query.refId));
  const [showingHelp, setShowingHelp] = useState(false);

  const getInterpolatedDataSourceUID = (): string | undefined => {
    if (query.datasource) {
      const instanceSettings = dataSourceSrv.getInstanceSettings(query.datasource);
      return instanceSettings?.rawRef?.uid ?? instanceSettings?.uid;
    }
    return dataSource.rawRef?.uid ?? dataSource.uid;
  };

  const loadDatasource = async () => {
    let ds: DataSourceApi;
    const interpolatedUID = getInterpolatedDataSourceUID();

    try {
      ds = await dataSourceSrv.get(interpolatedUID);
    } catch (error) {
      ds = await dataSourceSrv.get();
    }

    if (typeof onDataSourceLoaded === 'function') {
      onDataSourceLoaded(ds);
    }

    setDatasource(ds as unknown as DataSourceApi<TQuery>);
    setQueriedDataSourceIdentifier(interpolatedUID);
  };

  // On mount
  useEffect(() => {
    setFilteredData(filterPanelDataToQuery(data, query.refId));
    loadDatasource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update row id when id prop changes
  const prevIdRef = useRef(id);
  useEffect(() => {
    if (prevIdRef.current !== id) {
      prevIdRef.current = id;
      rowId.current = uniqueId(id + '_');
    }
  }, [id]);

  // Update filtered data when data changes
  useEffect(() => {
    setFilteredData(filterPanelDataToQuery(data, query.refId));
  }, [data, query.refId]);

  // Reload datasource when needed
  const prevQueriedRef = useRef(queriedDataSourceIdentifier);
  useEffect(() => {
    if (datasource && queriedDataSourceIdentifier !== getInterpolatedDataSourceUID()) {
      loadDatasource();
    }
    prevQueriedRef.current = queriedDataSourceIdentifier;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.datasource, dataSource]);

  const isWaitingForDatasourceToLoad = (): boolean => {
    return getInterpolatedDataSourceUID() !== queriedDataSourceIdentifier;
  };

  const getQueryEditor = (ds: DataSourceApi<TQuery>) => {
    if (!ds) {
      return;
    }

    switch (app) {
      case CoreApp.Explore:
        return (
          ds.components?.ExploreMetricsQueryField ||
          ds.components?.ExploreLogsQueryField ||
          ds.components?.ExploreQueryField ||
          ds.components?.QueryEditor
        );
      case CoreApp.PanelEditor:
      case CoreApp.Dashboard:
      default:
        return ds.components?.QueryEditor;
    }
  };

  const renderPluginEditor = () => {
    if (isWaitingForDatasourceToLoad()) {
      return null;
    }

    if (datasource) {
      const QueryEditor = getQueryEditor(datasource);

      if (QueryEditor) {
        return (
          <DataSourcePluginContextProvider instanceSettings={dataSource}>
            <QueryEditor
              key={datasource?.name}
              query={query}
              datasource={datasource}
              onChange={onChange}
              onRunQuery={onRunQuery}
              onAddQuery={onAddQuery}
              data={filteredData}
              range={range}
              queries={queries}
              app={app}
              history={history}
            />
          </DataSourcePluginContextProvider>
        );
      }
    }

    return (
      <div>
        <Trans i18nKey="query-operation.query-editor-not-exported">
          Data source plugin does not export any Query Editor component
        </Trans>
      </div>
    );
  };

  const onRemoveQueryFn = () => {
    const isExpressionQuery = query.datasource?.uid === ExpressionDatasourceUID;
    if (isExpressionQuery && 'type' in query && query.type) {
      reportInteraction('dashboards_expression_interaction', {
        action: 'remove_expression',
        expression_type: query.type,
        context: 'panel_query_section',
      });
    }

    onRemoveQuery(query);

    if (onQueryRemoved) {
      onQueryRemoved();
    }
  };

  const onCancelQueryLibraryEditFn = () => {
    reportInteraction('query_library-update_query_from_explore_cancelled', {
      datasourceType: query.datasource?.type,
    });
    onCancelQueryLibraryEdit?.();
  };

  const onExitQueryLibraryEditingMode = () => {
    onCancelQueryLibraryEdit?.();
  };

  const onCopyQuery = () => {
    const copy = cloneDeep(query);
    onAddQuery(copy);

    if (onQueryCopied) {
      onQueryCopied();
    }
  };

  const onHideQuery = () => {
    onChange({ ...query, hide: !query.hide });
    onRunQuery();

    if (onQueryToggled) {
      onQueryToggled(query.hide);
    }

    reportInteraction('query_editor_row_hide_query_clicked', {
      hide: !query.hide,
    });
  };

  const onToggleHelp = () => {
    setShowingHelp((prev) => !prev);
  };

  const onClickExample = (exampleQuery: TQuery) => {
    if (exampleQuery.datasource === undefined) {
      exampleQuery.datasource = getDataSourceRef(dataSource);
    }

    onChange({
      ...exampleQuery,
      refId: query.refId,
    });
    onToggleHelp();
  };

  const onSelectQueryFromLibrary = (libQuery: DataQuery) => {
    onQueryReplacedFromLibrary?.();
    onReplace?.(libQuery);
  };

  const renderCollapsedText = (): string | null => {
    if (!datasource || typeof datasource.getQueryDisplayText !== 'function') {
      return null;
    }

    try {
      return datasource.getQueryDisplayText(query);
    } catch (error) {
      return null;
    }
  };

  const renderWarnings = (type: string): JSX.Element | null => {
    const dataFilteredByRefId = filterPanelDataToQuery(data, query.refId)?.series ?? [];

    const allWarnings = dataFilteredByRefId.reduce((acc: QueryResultMetaNotice[], serie) => {
      if (!serie.meta?.notices) {
        return acc;
      }
      const warnings = filter(serie.meta.notices, (item: QueryResultMetaNotice) => item.severity === type) ?? [];
      return acc.concat(warnings);
    }, []);

    const uniqueWarnings = uniqBy(allWarnings, 'text');

    const hasWarnings = uniqueWarnings.length > 0;
    if (!hasWarnings) {
      return null;
    }

    const key = 'query-' + type + 's';
    const colour = type === 'warning' ? 'orange' : 'blue';
    const iconName = type === 'warning' ? 'exclamation-triangle' : 'file-landscape-alt';

    const listItems = uniqueWarnings.map((warning) => warning.text);
    const serializedWarnings = <List items={listItems} renderItem={(item) => <>{item}</>} />;

    return (
      <Badge
        key={key}
        color={colour}
        icon={iconName}
        text={
          <>
            {uniqueWarnings.length} {pluralize(type, uniqueWarnings.length)}
          </>
        }
        tooltip={serializedWarnings}
      />
    );
  };

  const renderExtraActions = () => {
    const unscopedActions = RowActionComponents.getAllExtraRenderAction();

    let scopedActions: QueryActionComponent[] = [];

    if (app !== undefined) {
      scopedActions = RowActionComponents.getScopedExtraRenderAction(app);
    }

    const extraActions = [...unscopedActions, ...scopedActions]
      .map((action, idx) =>
        action({
          query,
          queries,
          timeRange: data.timeRange,
          onAddQuery: onAddQuery as (q: DataQuery) => void,
          dataSource,
          key: idx,
        })
      )
      .filter(Boolean);

    extraActions.push(renderWarnings('info'));
    extraActions.push(renderWarnings('warning'));
    extraActions.push(<AdaptiveTelemetryQueryActions key="adaptive-telemetry-actions" query={query} />);

    return extraActions;
  };

  const renderActions = (props: QueryOperationRowRenderProps) => {
    const isHidden = !!query.hide;
    const hasEditorHelp = datasource?.components?.QueryEditorHelp;
    const isEditingQueryLibrary = queryLibraryRef !== undefined;
    const isUnifiedAlerting = app === CoreApp.UnifiedAlerting;
    const isExpressionQuery = query.datasource?.uid === ExpressionDatasourceUID;

    return (
      <>
        {!isEditingQueryLibrary && !isUnifiedAlerting && !isExpressionQuery && (
          <SavedQueryButtons
            query={{
              ...query,
              datasource: datasource ? { uid: datasource.uid, type: datasource.type } : query.datasource,
            }}
            app={app}
            onUpdateSuccess={onExitQueryLibraryEditingMode}
            onSelectQuery={onSelectQueryFromLibrary}
            datasourceFilters={datasource?.name ? [datasource.name] : []}
            parentRef={editorRef}
          />
        )}

        {hasEditorHelp && (
          <QueryOperationToggleAction
            title={t('query-operation.header.datasource-help', 'Show data source help')}
            icon="question-circle"
            onClick={onToggleHelp}
            active={showingHelp}
          />
        )}
        {renderExtraActions()}
        {!isEditingQueryLibrary && (
          <QueryOperationAction
            title={t('query-operation.header.duplicate-query', 'Duplicate query')}
            icon="copy"
            onClick={onCopyQuery}
          />
        )}

        {!hideHideQueryButton ? (
          <QueryOperationToggleAction
            dataTestId={selectors.components.QueryEditorRow.actionButton('Hide response')}
            title={
              query.hide
                ? t('query-operation.header.show-response', 'Show response')
                : t('query-operation.header.hide-response', 'Hide response')
            }
            icon={isHidden ? 'eye-slash' : 'eye'}
            active={isHidden}
            onClick={onHideQuery}
          />
        ) : null}
        {!isEditingQueryLibrary && (
          <QueryOperationAction
            title={t('query-operation.header.remove-query', 'Remove query')}
            icon="trash-alt"
            onClick={onRemoveQueryFn}
          />
        )}
      </>
    );
  };

  const renderHeader = (props: QueryOperationRowRenderProps) => {
    return (
      <QueryEditorRowHeader
        query={query}
        queries={queries}
        onChangeDataSource={onChangeDataSource}
        dataSource={dataSource}
        hidden={query.hide}
        onChange={onChange}
        collapsedText={!props.isOpen ? renderCollapsedText() : null}
        renderExtras={() => <>{renderHeaderExtras && renderHeaderExtras()}</>}
        alerting={app === CoreApp.UnifiedAlerting}
        hideRefId={hideRefId}
      />
    );
  };

  const isHidden = query.hide;
  const error =
    filteredData?.error && filteredData.error.refId === query.refId
      ? filteredData.error
      : filteredData?.errors?.find((e) => e.refId === query.refId);
  const rowClasses = classNames('query-editor-row', {
    'query-editor-row--disabled': isHidden,
    'gf-form-disabled': isHidden,
  });

  if (!datasource) {
    return null;
  }

  const editor = renderPluginEditor();
  const DatasourceCheatsheet = datasource.components?.QueryEditorHelp;

  const queryOperationRow = (
    <QueryOperationRow
      id={rowId.current}
      draggable={!hideActionButtons && !queryLibraryRef}
      collapsable={collapsable}
      index={index}
      headerElement={renderHeader}
      actions={hideActionButtons ? undefined : renderActions}
      isOpen={isOpen}
      onOpen={onQueryOpenChanged}
    >
      <div className={rowClasses} id={rowId.current}>
        <ErrorBoundaryAlert boundaryName="query-editor-operation-row">
          {showingHelp && DatasourceCheatsheet && (
            <OperationRowHelp>
              <DatasourceCheatsheet
                onClickExample={(q) => onClickExample(q)}
                query={query}
                datasource={datasource}
              />
            </OperationRowHelp>
          )}
          {editor}
        </ErrorBoundaryAlert>
        {error && <QueryErrorAlert error={error} query={query} />}
        {visualization}
      </div>
    </QueryOperationRow>
  );

  return (
    <div data-testid={selectors.components.QueryEditorRows.rows} ref={editorRef}>
      {queryLibraryRef && (
        <MaybeQueryLibraryEditingHeader
          query={query}
          app={app}
          queryLibraryRef={queryLibraryRef}
          onCancelEdit={onCancelQueryLibraryEditFn}
          onUpdateSuccess={onExitQueryLibraryEditingMode}
          onSelectQuery={onSelectQueryFromLibrary}
        />
      )}
      {queryLibraryRef ? (
        <QueryLibraryEditingContainer>{queryOperationRow}</QueryLibraryEditingContainer>
      ) : (
        queryOperationRow
      )}
    </div>
  );
}

/**
 * Get a version of the PanelData limited to the query we are looking at
 */
export function filterPanelDataToQuery(data: PanelData, refId: string): PanelData | undefined {
  const series = data.series.filter((series) => series.refId === refId);

  if (data.state !== LoadingState.Loading && (data.error || data.errors?.length) && !data.series.length) {
    return {
      ...data,
      state: LoadingState.Error,
    };
  }

  let state = data.state;
  let error = data.errors?.find((e) => e.refId === refId);
  if (!error && data.error) {
    error = data.error.refId === refId ? data.error : undefined;
  }

  if (state !== LoadingState.Loading) {
    if (error) {
      state = LoadingState.Error;
    } else if (data.state === LoadingState.Error) {
      state = LoadingState.Done;
    }
  }

  const timeRange = data.timeRange;

  return {
    ...data,
    state,
    series,
    error,
    errors: error ? [error] : undefined,
    timeRange,
  };
}

// Will render anything only if saved query is enabled
function SavedQueryButtons(props: {
  query: DataQuery;
  app?: CoreApp;
  onUpdateSuccess?: () => void;
  onSelectQuery: (query: DataQuery) => void;
  datasourceFilters: string[];
  parentRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { renderSavedQueryButtons } = useQueryLibraryContext();
  return renderSavedQueryButtons(
    props.query,
    props.app,
    props.onUpdateSuccess,
    props.onSelectQuery,
    undefined,
    props.parentRef
  );
}

// Will render editing header only if query library is enabled
function MaybeQueryLibraryEditingHeader(props: {
  query: DataQuery;
  app?: CoreApp;
  queryLibraryRef?: string;
  onCancelEdit?: () => void;
  onUpdateSuccess?: () => void;
  onSelectQuery?: (query: DataQuery) => void;
}) {
  const { renderQueryLibraryEditingHeader } = useQueryLibraryContext();
  return renderQueryLibraryEditingHeader(
    props.query,
    props.app,
    props.queryLibraryRef,
    props.onCancelEdit,
    props.onUpdateSuccess,
    props.onSelectQuery
  );
}

function AdaptiveTelemetryQueryActions({ query }: { query: DataQuery }) {
  try {
    const { isLoading, components } = usePluginComponents<PluginExtensionQueryEditorRowAdaptiveTelemetryV1Context>({
      extensionPointId: PluginExtensionPoints.QueryEditorRowAdaptiveTelemetryV1,
    });

    if (isLoading || !components.length) {
      return null;
    }

    return renderLimitedComponents({
      props: { query, contextHints: ['queryeditorrow', 'header'] },
      components,
      limit: 1,
      pluginId: /grafana-adaptive.*/,
    });
  } catch (error) {
    return null;
  }
}
