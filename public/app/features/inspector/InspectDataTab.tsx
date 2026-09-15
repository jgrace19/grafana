import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

import {
  applyFieldOverrides,
  applyRawFieldOverrides,
  type CoreApp,
  type DataFrame,
  DataTransformerID,
  type FieldConfigSource,
  type SelectableValue,
  type TimeZone,
  transformDataFrame,
} from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { config, getTemplateSrv, reportInteraction } from '@grafana/runtime';
import { Button, Spinner, Table } from '@grafana/ui';
import { type GetDataOptions } from 'app/features/query/state/PanelQueryRunner';

import { dataFrameToLogsModel } from '../logs/logsModel';

import { InspectDataOptions } from './InspectDataOptions';
import { getPanelInspectorStyles } from './styles';
import { downloadAsJson, downloadDataFrameAsCsv, downloadLogsModelAsTxt, downloadTraceAsJson } from './utils/download';

interface Props {
  isLoading: boolean;
  options: GetDataOptions;
  timeZone: TimeZone;
  app?: CoreApp;
  data?: DataFrame[];
  /** The title of the panel or other context name */
  dataName: string;
  panelPluginId?: string;
  fieldConfig?: FieldConfigSource;
  hasTransformations?: boolean;
  formattedDataDescription?: string;
  onOptionsChange?: (options: GetDataOptions) => void;
}

function buildTransformationOptions(): Array<SelectableValue<DataTransformerID>> {
  return [
    {
      value: DataTransformerID.joinByField,
      label: t('dashboard.inspect-data.transformation', 'Series joined by time'),
      transformer: {
        id: DataTransformerID.joinByField,
        options: { byField: undefined },
      },
    },
  ];
}

function cleanTableConfigFromFieldConfig(fieldConfig: FieldConfigSource): FieldConfigSource {
  fieldConfig = cloneDeep(fieldConfig);
  fieldConfig.defaults.custom = {};

  for (const override of fieldConfig.overrides) {
    for (const prop of override.properties) {
      if (prop.id.startsWith('custom.')) {
        const index = override.properties.indexOf(prop);
        override.properties.slice(index, 1);
      }
    }
  }

  return fieldConfig;
}

export function InspectDataTab({
  isLoading,
  options,
  timeZone,
  app,
  data,
  dataName,
  panelPluginId,
  fieldConfig,
  hasTransformations,
  formattedDataDescription,
  onOptionsChange,
}: Props) {
  const [selectedDataFrame, setSelectedDataFrame] = useState<number | DataTransformerID>(0);
  const [transformId, setTransformId] = useState<DataTransformerID>(DataTransformerID.noop);
  const [dataFrameIndex, setDataFrameIndex] = useState(0);
  const [transformationOptions] = useState<Array<SelectableValue<DataTransformerID>>>(buildTransformationOptions);
  const [transformedData, setTransformedData] = useState<DataFrame[]>(data ?? []);
  const [excelCompatibilityMode, setExcelCompatibilityMode] = useState(false);

  useEffect(() => {
    if (!data) {
      setTransformedData([]);
      return;
    }

    if (options.withTransforms) {
      setTransformedData(data);
      return;
    }

    const currentTransform = transformationOptions.find((item) => item.value === transformId);

    if (currentTransform && currentTransform.transformer.id !== DataTransformerID.noop) {
      const subscription = transformDataFrame([currentTransform.transformer], data).subscribe((transformed) => {
        setTransformedData(transformed);
        subscription.unsubscribe();
      });
      return;
    }

    setTransformedData(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, transformId, options.withTransforms]);

  const getProcessedData = (): DataFrame[] => {
    const rawData = transformedData;

    if (!options.withFieldConfig) {
      return applyRawFieldOverrides(rawData);
    }

    let fieldConfigCleaned = fieldConfig ?? { defaults: {}, overrides: [] };
    if (panelPluginId === 'table' && fieldConfig) {
      fieldConfigCleaned = cleanTableConfigFromFieldConfig(fieldConfig);
    }

    return applyFieldOverrides({
      data: rawData,
      theme: config.theme2,
      fieldConfig: fieldConfigCleaned,
      timeZone,
      replaceVariables: (value, scopedVars, format) => getTemplateSrv().replace(value, scopedVars, format),
    });
  };

  const exportCsv = (dataFrames: DataFrame[], hasLogs: boolean) => {
    const dataFrame = dataFrames[dataFrameIndex];

    if (hasLogs) {
      reportInteraction('grafana_logs_download_clicked', { app, format: 'csv' });
    }

    downloadDataFrameAsCsv(dataFrame, dataName, {}, transformId, excelCompatibilityMode);
  };

  const onExportLogsAsTxt = () => {
    reportInteraction('grafana_logs_download_logs_clicked', { app, format: 'logs', area: 'inspector' });
    const logsModel = dataFrameToLogsModel(data || []);
    downloadLogsModelAsTxt(logsModel, dataName);
  };

  const onExportTracesAsJson = () => {
    if (!data) {
      return;
    }

    for (const df of data) {
      if (df.meta?.preferredVisualisationType !== 'trace') {
        continue;
      }

      const traceFormat = downloadTraceAsJson(df, dataName + '-traces');

      reportInteraction('grafana_traces_download_traces_clicked', {
        app,
        grafana_version: config.buildInfo.version,
        trace_format: traceFormat,
        location: 'inspector',
      });
    }
  };

  const onExportServiceGraph = () => {
    reportInteraction('grafana_traces_download_service_graph_clicked', {
      app,
      grafana_version: config.buildInfo.version,
      location: 'inspector',
    });

    if (!data) {
      return;
    }

    downloadAsJson(data, dataName);
  };

  const onDataFrameChange = (item: SelectableValue<DataTransformerID | number>) => {
    setTransformId(
      item.value === DataTransformerID.joinByField ? DataTransformerID.joinByField : DataTransformerID.noop
    );
    setDataFrameIndex(typeof item.value === 'number' ? item.value : 0);
    setSelectedDataFrame(item.value!);
  };

  const onToggleExcelCompatibilityMode = () => {
    setExcelCompatibilityMode((prev) => !prev);
  };

  const styles = getPanelInspectorStyles();

  if (isLoading) {
    return (
      <div>
        <Spinner inline={true} /> <Trans i18nKey="inspector.inspect-data-tab.loading">Loading</Trans>
      </div>
    );
  }

  const dataFrames = getProcessedData();

  if (!dataFrames || !dataFrames.length) {
    return (
      <div>
        <Trans i18nKey="inspector.inspect-data-tab.no-data">No data</Trans>
      </div>
    );
  }

  const index = !dataFrames[dataFrameIndex] ? 0 : dataFrameIndex;
  const dataFrame = dataFrames[index];
  const hasLogs = dataFrames.some((df) => df?.meta?.preferredVisualisationType === 'logs');
  const hasTraces = dataFrames.some((df) => df?.meta?.preferredVisualisationType === 'trace');
  const hasServiceGraph = dataFrames.some((df) => df?.meta?.preferredVisualisationType === 'nodeGraph');

  const actions = (
    <>
      <Button variant="primary" onClick={() => exportCsv(dataFrames, hasLogs)} size="sm">
        <Trans i18nKey="dashboard.inspect-data.download-csv">Download CSV</Trans>
      </Button>
      {hasLogs && !config.exploreHideLogsDownload && (
        <Button variant="primary" onClick={onExportLogsAsTxt} size="sm">
          <Trans i18nKey="dashboard.inspect-data.download-logs">Download logs</Trans>
        </Button>
      )}
      {hasTraces && (
        <Button variant="primary" onClick={onExportTracesAsJson} size="sm">
          <Trans i18nKey="dashboard.inspect-data.download-traces">Download traces</Trans>
        </Button>
      )}
      {hasServiceGraph && (
        <Button variant="primary" onClick={onExportServiceGraph} size="sm">
          <Trans i18nKey="dashboard.inspect-data.download-service">Download service graph</Trans>
        </Button>
      )}
    </>
  );

  return (
    <div className={styles.wrap} data-testid={selectors.components.PanelInspector.Data.content}>
      <div className={styles.toolbar}>
        <InspectDataOptions
          data={data}
          hasTransformations={hasTransformations}
          options={options}
          dataFrames={dataFrames}
          transformationOptions={transformationOptions}
          selectedDataFrame={selectedDataFrame}
          formattedDataDescription={formattedDataDescription}
          onOptionsChange={onOptionsChange}
          onDataFrameChange={onDataFrameChange}
          excelCompatibilityMode={excelCompatibilityMode}
          toggleExcelCompatibilityMode={onToggleExcelCompatibilityMode}
          actions={actions}
        />
      </div>
      <div className={styles.content}>
        <AutoSizer>
          {({ width, height }) => {
            if (width === 0) {
              return null;
            }

            return <Table width={width} height={height} data={dataFrame} showTypeIcons={true} />;
          }}
        </AutoSizer>
      </div>
    </div>
  );
}
