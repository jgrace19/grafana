import { css } from '@emotion/css';
import { useEffect, useRef, useState } from 'react';
import { type Unsubscribable } from 'rxjs';

import {
  CoreApp,
  type DataSourceApi,
  type DataSourceInstanceSettings,
  type ScopedVars,
  getDataSourceRef,
  getDefaultTimeRange,
  LoadingState,
  type PanelData,
} from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { getDataSourceSrv, locationService } from '@grafana/runtime';
import { type DataQuery } from '@grafana/schema';
import { Button, InlineFormLabel, Modal, ScrollContainer, Stack, stylesFactory } from '@grafana/ui';
import { PluginHelp } from 'app/core/components/PluginHelp/PluginHelp';
import config from 'app/core/config';
import { addQuery, queryIsEmpty } from 'app/core/utils/query';
import { DataSourceModal } from 'app/features/datasources/components/picker/DataSourceModal';
import { DataSourcePicker } from 'app/features/datasources/components/picker/DataSourcePicker';
import { dataSource as expressionDatasource } from 'app/features/expressions/ExpressionDatasource';
import { isSharedDashboardQuery } from 'app/plugins/datasource/dashboard/runSharedRequest';
import { type GrafanaQuery } from 'app/plugins/datasource/grafana/types';
import { type QueryGroupOptions } from 'app/types/query';

import { type PanelQueryRunner } from '../state/PanelQueryRunner';
import { updateQueries } from '../state/updateQueries';

import { GroupActionComponents } from './QueryActionComponent';
import { QueryEditorRows } from './QueryEditorRows';
import { QueryGroupOptionsEditor } from './QueryGroupOptions';

export interface Props {
  queryRunner: PanelQueryRunner;
  options: QueryGroupOptions;
  onOpenQueryInspector?: () => void;
  onRunQueries: () => void;
  onOptionsChange: (options: QueryGroupOptions) => void;
}

export function QueryGroup({ queryRunner, options, onOpenQueryInspector, onRunQueries, onOptionsChange }: Props) {
  const dataSourceSrv = getDataSourceSrv();
  const querySubscriptionRef = useRef<Unsubscribable | null>(null);

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [queries, setQueries] = useState<DataQuery[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceApi | undefined>(undefined);
  const [dsSettings, setDsSettings] = useState<DataSourceInstanceSettings | undefined>(undefined);
  const [defaultDataSource, setDefaultDataSource] = useState<DataSourceApi | undefined>(undefined);
  const [data, setData] = useState<PanelData>({
    state: LoadingState.NotStarted,
    series: [],
    timeRange: getDefaultTimeRange(),
  });
  const [scrollElement, setScrollElement] = useState<HTMLDivElement | undefined>(undefined);

  const setNewQueriesAndDatasource = async (opts: QueryGroupOptions) => {
    try {
      const ds = await dataSourceSrv.get(opts.dataSource);
      const settings = dataSourceSrv.getInstanceSettings(opts.dataSource);

      const defaultDs = await dataSourceSrv.get();
      const datasource = ds.getRef();
      const newQueries = opts.queries.map((q) => ({
        ...(queryIsEmpty(q) && ds?.getDefaultQuery?.(CoreApp.PanelEditor)),
        datasource,
        ...q,
      }));

      setQueries(newQueries);
      setDataSource(ds);
      setDsSettings(settings);
      setDefaultDataSource(defaultDs);
    } catch (error) {
      console.error('failed to load data source', error);
    }
  };

  useEffect(() => {
    const sub = queryRunner.getData({ withTransforms: false, withFieldConfig: false }).subscribe({
      next: (panelData: PanelData) => setData(panelData),
    });
    querySubscriptionRef.current = sub;

    setNewQueriesAndDatasource(options);

    return () => {
      if (querySubscriptionRef.current) {
        querySubscriptionRef.current.unsubscribe();
        querySubscriptionRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prevDsUidRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    getDataSourceSrv()
      .get(options.dataSource)
      .then((currentDS) => {
        if (dataSource && currentDS.uid !== dataSource.uid && prevDsUidRef.current !== currentDS.uid) {
          prevDsUidRef.current = currentDS.uid;
          setNewQueriesAndDatasource(options);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.dataSource]);

  const onChangeDataSource = async (
    newSettings: DataSourceInstanceSettings,
    defaultQueries?: DataQuery[] | GrafanaQuery[]
  ) => {
    const currentDS = dsSettings ? await getDataSourceSrv().get(dsSettings.uid) : undefined;
    const nextDS = await getDataSourceSrv().get(newSettings.uid);

    const newQueries =
      defaultQueries || (await updateQueries(nextDS, newSettings.uid, queries, currentDS));

    const newDataSource = await dataSourceSrv.get(newSettings.name);

    onChange({
      queries: newQueries,
      dataSource: {
        name: newSettings.name,
        uid: newSettings.uid,
        ...getDataSourceRef(newSettings),
      },
    });

    setQueries(newQueries);
    setDataSource(newDataSource);
    setDsSettings(newSettings);

    if (defaultQueries) {
      onRunQueries();
    }
  };

  const newQuery = (): Partial<DataQuery> => {
    const ds =
      dsSettings && !dsSettings.meta.mixed
        ? getDataSourceRef(dsSettings)
        : defaultDataSource
          ? defaultDataSource.getRef()
          : { type: undefined, uid: undefined };

    return {
      ...dataSource?.getDefaultQuery?.(CoreApp.PanelEditor),
      datasource: ds,
    };
  };

  const onChange = (changedProps: Partial<QueryGroupOptions>) => {
    onOptionsChange({
      ...options,
      ...changedProps,
    });
  };

  const onScrollBottom = () => {
    setTimeout(() => {
      if (scrollElement) {
        scrollElement.scrollTo({ top: 10000 });
      }
    }, 20);
  };

  const onAddQueryClick = () => {
    onQueriesChange(addQuery(queries, newQuery()));
    onScrollBottom();
  };

  const onAddExpressionClick = () => {
    onQueriesChange(addQuery(queries, expressionDatasource.newQuery()));
    onScrollBottom();
  };

  const onUpdateAndRun = (opts: QueryGroupOptions) => {
    onOptionsChange(opts);
    onRunQueries();
  };

  const onAddQuery = (query: Partial<DataQuery>) => {
    onQueriesChange(
      addQuery(queries, query, dsSettings ? getDataSourceRef(dsSettings) : { type: undefined, uid: undefined })
    );
    onScrollBottom();
  };

  const onQueriesChange = (newQueries: DataQuery[] | GrafanaQuery[]) => {
    onChange({ queries: newQueries });
    setQueries(newQueries);
  };

  const isExpressionsSupported = (settings: DataSourceInstanceSettings): boolean => {
    return (settings.meta.backend || settings.meta.alerting || settings.meta.mixed) === true;
  };

  const renderExtraActions = () => {
    return GroupActionComponents.getAllExtraRenderAction()
      .map((action, index) =>
        action({
          onAddQuery,
          onChangeDataSource,
          key: index,
        })
      )
      .filter(Boolean);
  };

  const styles = getStyles();

  return (
    <ScrollContainer minHeight="100%" ref={(el) => setScrollElement(el || undefined)}>
      <div className={styles.innerWrapper}>
        {dsSettings && dataSource && (
          <QueryGroupTopSection
            data={data}
            dataSource={dataSource}
            options={options}
            dsSettings={dsSettings}
            onOptionsChange={onUpdateAndRun}
            onDataSourceChange={onChangeDataSource}
            onOpenQueryInspector={onOpenQueryInspector}
          />
        )}
        {dsSettings && (
          <>
            <div className={styles.queriesWrapper}>
              <div data-testid={selectors.components.QueryTab.content}>
                <QueryEditorRows
                  queries={queries}
                  dsSettings={dsSettings}
                  onQueriesChange={onQueriesChange}
                  onAddQuery={onAddQuery}
                  onRunQueries={onRunQueries}
                  data={data}
                />
              </div>
            </div>
            <Stack gap={2} alignItems="flex-start">
              {!isSharedDashboardQuery(dsSettings.name) && (
                <Button
                  icon="plus"
                  onClick={onAddQueryClick}
                  variant="secondary"
                  data-testid={selectors.components.QueryTab.addQuery}
                >
                  <Trans i18nKey="query.query-group.add-query">Add query</Trans>
                </Button>
              )}
              {config.expressionsEnabled && isExpressionsSupported(dsSettings) && (
                <Button
                  icon="plus"
                  onClick={onAddExpressionClick}
                  variant="secondary"
                  className={styles.expressionButton}
                  data-testid="query-tab-add-expression"
                >
                  <span>
                    <Trans i18nKey="query.query-group.expression">Expression</Trans>
                  </span>
                </Button>
              )}
              {renderExtraActions()}
            </Stack>
            {isHelpOpen && (
              <Modal
                title={t('query.query-group.title-data-source-help', 'Data source help')}
                isOpen={true}
                onDismiss={() => setIsHelpOpen(false)}
              >
                <PluginHelp pluginId={dsSettings.meta.id} />
              </Modal>
            )}
          </>
        )}
      </div>
    </ScrollContainer>
  );
}

const getStyles = stylesFactory(() => {
  const { theme } = config;

  return {
    innerWrapper: css({
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing.md,
    }),
    dataSourceRow: css({
      display: 'flex',
      marginBottom: theme.spacing.md,
    }),
    dataSourceRowItem: css({
      marginRight: theme.spacing.inlineFormMargin,
    }),
    dataSourceRowItemOptions: css({
      flexGrow: 1,
      marginRight: theme.spacing.inlineFormMargin,
    }),
    queriesWrapper: css({
      paddingBottom: '16px',
    }),
    expressionWrapper: css({}),
    expressionButton: css({
      marginRight: theme.spacing.sm,
    }),
  };
});

interface QueryGroupTopSectionProps {
  data: PanelData;
  dataSource: DataSourceApi;
  dsSettings: DataSourceInstanceSettings;
  options: QueryGroupOptions;
  scopedVars?: ScopedVars;
  onOpenQueryInspector?: () => void;
  onOptionsChange?: (options: QueryGroupOptions) => void;
  onDataSourceChange?: (ds: DataSourceInstanceSettings, defaultQueries?: DataQuery[] | GrafanaQuery[]) => Promise<void>;
}

export function QueryGroupTopSection({
  dataSource,
  options,
  data,
  dsSettings,
  scopedVars,
  onDataSourceChange,
  onOptionsChange,
  onOpenQueryInspector,
}: QueryGroupTopSectionProps) {
  const styles = getStyles();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <>
      <div data-testid={selectors.components.QueryTab.queryGroupTopSection}>
        <div className={styles.dataSourceRow}>
          <InlineFormLabel htmlFor="data-source-picker" width={'auto'}>
            <Trans i18nKey="query.query-group-top-section.data-source">Data source</Trans>
          </InlineFormLabel>
          <div className={styles.dataSourceRowItem}>
            <DataSourcePickerWithPrompt
              options={options}
              scopedVars={scopedVars}
              onChange={async (ds, defaultQueries) => {
                return await onDataSourceChange?.(ds, defaultQueries);
              }}
              isDataSourceModalOpen={Boolean(locationService.getSearchObject().firstPanel)}
            />
          </div>
          {dataSource && (
            <>
              <div className={styles.dataSourceRowItem}>
                <Button
                  variant="secondary"
                  icon="question-circle"
                  tooltip={t(
                    'query.query-group-top-section.query-tab-help-button-title-open-data-source-help',
                    'Open data source help'
                  )}
                  onClick={() => setIsHelpOpen(true)}
                  data-testid="query-tab-help-button"
                />
              </div>
              <div className={styles.dataSourceRowItemOptions}>
                <QueryGroupOptionsEditor
                  options={options}
                  dataSource={dataSource}
                  data={data}
                  onChange={(opts) => {
                    onOptionsChange?.(opts);
                  }}
                />
              </div>
              {onOpenQueryInspector && (
                <div className={styles.dataSourceRowItem}>
                  <Button
                    variant="secondary"
                    onClick={onOpenQueryInspector}
                    data-testid={selectors.components.QueryTab.queryInspectorButton}
                  >
                    <Trans i18nKey="query.query-group-top-section.query-inspector">Query inspector</Trans>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {isHelpOpen && (
        <Modal
          title={t('query.query-group-top-section.title-data-source-help', 'Data source help')}
          isOpen={true}
          onDismiss={() => setIsHelpOpen(false)}
        >
          <PluginHelp pluginId={dsSettings.meta.id} />
        </Modal>
      )}
    </>
  );
}

interface DataSourcePickerWithPromptProps {
  isDataSourceModalOpen?: boolean;
  options: QueryGroupOptions;
  scopedVars?: ScopedVars;
  onChange: (ds: DataSourceInstanceSettings, defaultQueries?: DataQuery[] | GrafanaQuery[]) => Promise<void>;
}

function DataSourcePickerWithPrompt({ options, scopedVars, onChange, ...otherProps }: DataSourcePickerWithPromptProps) {
  const [isDataSourceModalOpen, setIsDataSourceModalOpen] = useState(Boolean(otherProps.isDataSourceModalOpen));

  useEffect(() => {
    if (!!locationService.getSearchObject().firstPanel) {
      locationService.partial({ firstPanel: null }, true);
    }
  }, []);

  const commonProps = {
    metrics: true,
    mixed: true,
    dashboard: true,
    variables: true,
    current: options.dataSource,
    scopedVars,
    onChange: async (ds: DataSourceInstanceSettings, defaultQueries?: DataQuery[] | GrafanaQuery[]) => {
      await onChange(ds, defaultQueries);
      setIsDataSourceModalOpen(false);
    },
  };

  return (
    <>
      {isDataSourceModalOpen && (
        <DataSourceModal {...commonProps} onDismiss={() => setIsDataSourceModalOpen(false)}></DataSourceModal>
      )}

      <DataSourcePicker {...commonProps} />
    </>
  );
}
