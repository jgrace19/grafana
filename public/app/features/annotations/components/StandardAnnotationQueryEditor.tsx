import { type ReactElement, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { lastValueFrom } from 'rxjs';

import {
  type AnnotationEventMappings,
  type AnnotationQuery,
  type DataSourceApi,
  type DataSourceInstanceSettings,
  DataSourcePluginContextProvider,
  LoadingState,
} from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { type DataQuery } from '@grafana/schema';
import { Alert, type AlertVariant, Button, Space, Spinner } from '@grafana/ui';
import { getDashboardSrv } from 'app/features/dashboard/services/DashboardSrv';
import { getTimeSrv } from 'app/features/dashboard/services/TimeSrv';
import { PanelModel } from 'app/features/dashboard/state/PanelModel';

import { executeAnnotationQuery } from '../executeAnnotationQuery';
import { shouldUseLegacyRunner, shouldUseMappingUI, standardAnnotationSupport } from '../standardAnnotationSupport';
import { type AnnotationQueryResponse } from '../types';
import { updateAnnotationFromSavedQuery } from '../utils/savedQueryUtils';

import { AnnotationQueryEditorActionsWrapper } from './AnnotationQueryEditorActionsWrapper';
import { AnnotationFieldMapper } from './AnnotationResultMapper';

export interface Props {
  datasource: DataSourceApi;
  datasourceInstanceSettings: DataSourceInstanceSettings;
  annotation: AnnotationQuery<DataQuery>;
  onChange: (annotation: AnnotationQuery<DataQuery>) => void;
  disableSavedQueries?: boolean;
}

function getStatusSeverity(response: AnnotationQueryResponse): AlertVariant {
  const { events, panelData } = response;

  if (panelData?.errors || panelData?.error) {
    return 'error';
  }

  if (!events?.length) {
    return 'warning';
  }

  return 'success';
}

function renderStatusText(response: AnnotationQueryResponse, running: boolean | undefined): ReactElement {
  const { events, panelData } = response;

  if (running || response?.panelData?.state === LoadingState.Loading || !response) {
    return <p>{'loading...'}</p>;
  }

  if (panelData?.errors) {
    return (
      <>
        {panelData.errors.map((e, i) => (
          <p key={i}>{e.message}</p>
        ))}
      </>
    );
  }
  if (panelData?.error) {
    return <p>{panelData.error.message ?? 'There was an error fetching data'}</p>;
  }

  if (!events?.length) {
    return (
      <p>
        <Trans i18nKey="annotations.standard-annotation-query-editor.no-events-found">No events found</Trans>
      </p>
    );
  }

  const frame = panelData?.series?.[0] ?? panelData?.annotations?.[0];
  const numEvents = events.length;
  const numFields = frame?.fields.length;
  return (
    <p>
      <Trans i18nKey="annotations.standard-annotation-query-editor.events-found">
        {{ numEvents }} events (from {{ numFields }} fields)
      </Trans>
    </p>
  );
}

export interface StandardAnnotationQueryEditorRef {
  onQueryReplace: (query: DataQuery) => Promise<void>;
}

const StandardAnnotationQueryEditor = forwardRef<StandardAnnotationQueryEditorRef, Props>(function StandardAnnotationQueryEditor(
  {
    datasource,
    datasourceInstanceSettings,
    annotation,
    onChange,
    disableSavedQueries,
  }: Props,
  ref
) {
  const [running, setRunning] = useState<boolean | undefined>(false);
  const [response, setResponse] = useState<AnnotationQueryResponse | undefined>(undefined);
  const [skipNextVerification, setSkipNextVerification] = useState(false);
  const prevAnnotationRef = useRef(annotation);

  const onRunQuery = async () => {
    if (shouldUseLegacyRunner(datasource)) {
      return;
    }

    const dashboard = getDashboardSrv().getCurrent();
    if (!dashboard) {
      return;
    }

    setRunning(true);
    const resp = await lastValueFrom(
      executeAnnotationQuery(
        {
          range: getTimeSrv().timeRange(),
          panel: new PanelModel({}),
          dashboard,
        },
        datasource,
        annotation
      )
    );
    setRunning(false);
    setResponse(resp);
  };

  const verifyDataSource = () => {
    if (skipNextVerification) {
      setSkipNextVerification(false);
      onRunQuery();
      return;
    }

    const processor = {
      ...standardAnnotationSupport,
      ...datasource.annotations,
    };

    const fixed = processor.prepareAnnotation!(annotation);
    if (fixed !== annotation) {
      onChange(fixed);
    } else {
      onRunQuery();
    }
  };

  useImperativeHandle(ref, () => ({
    onQueryReplace,
  }));

  // On mount
  useEffect(() => {
    verifyDataSource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On annotation change
  useEffect(() => {
    if (prevAnnotationRef.current !== annotation && !shouldUseLegacyRunner(datasource)) {
      verifyDataSource();
    }
    prevAnnotationRef.current = annotation;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annotation, datasource]);

  const onQueryChange = (target: DataQuery) => {
    if (annotation.query && annotation.query.spec) {
      target = {
        ...annotation.query.spec,
        ...target,
      };
    }
    onChange({
      ...annotation,
      target,
      ...(annotation.query && {
        query: {
          kind: annotation.query.kind,
          spec: { ...target },
        },
      }),
      ...(annotation.legacyOptions ? { legacyOptions: annotation.legacyOptions } : {}),
    });
  };

  const onMappingChange = (mappings?: AnnotationEventMappings) => {
    onChange({
      ...annotation,
      mappings,
    });
  };

  const onAnnotationChange = (ann: AnnotationQuery) => {
    onChange({
      ...ann,
      ...(annotation.legacyOptions ? { legacyOptions: annotation.legacyOptions } : {}),
    });
  };

  const onQueryReplace = async (replacedQuery: DataQuery) => {
    try {
      const preparedAnnotation = await updateAnnotationFromSavedQuery(annotation, replacedQuery);
      setSkipNextVerification(true);
      onChange(preparedAnnotation);
    } catch (error) {
      console.error('Failed to replace annotation query:', error);
    }
  };

  const renderStatus = () => {
    if (!response) {
      return null;
    }

    return (
      <>
        <Space v={2} />
        <div>
          {running ? (
            <Spinner />
          ) : (
            <Button
              data-testid={selectors.components.Annotations.editor.testButton}
              variant="secondary"
              size="xs"
              onClick={onRunQuery}
            >
              <Trans i18nKey="annotations.standard-annotation-query-editor.test-annotation-query">
                Test annotation query
              </Trans>
            </Button>
          )}
        </div>
        <Space v={2} layout="block" />
        <Alert
          data-testid={selectors.components.Annotations.editor.resultContainer}
          severity={getStatusSeverity(response)}
          title={t('annotations.standard-annotation-query-editor.title-query-result', 'Query result')}
        >
          {renderStatusText(response, running)}
        </Alert>
      </>
    );
  };

  let QueryEditor = datasource.annotations?.QueryEditor || datasource.components?.QueryEditor;
  if (!QueryEditor) {
    return (
      <div>
        <Trans i18nKey="annotations.standard-annotation-query-editor.no-query-editor">
          Annotations are not supported. This datasource needs to export a QueryEditor
        </Trans>
      </div>
    );
  }

  let target = annotation.target;

  if (annotation.query && annotation.query.spec) {
    target = {
      ...annotation.query.spec,
    };
  }

  let query = {
    ...datasource.annotations?.getDefaultQuery?.(),
    ...(target ?? { refId: 'Anno' }),
  };

  let editorAnnotation = annotation;

  if (annotation.query && annotation.legacyOptions) {
    editorAnnotation = { ...annotation.legacyOptions, ...annotation };
  }

  return (
    <>
      <DataSourcePluginContextProvider instanceSettings={datasourceInstanceSettings}>
        <AnnotationQueryEditorActionsWrapper
          disableSavedQueries={disableSavedQueries}
          annotation={annotation}
          datasource={datasource}
          onQueryReplace={onQueryReplace}
        >
          <QueryEditor
            key={datasource?.name}
            query={query}
            datasource={datasource}
            onChange={onQueryChange}
            onRunQuery={onRunQuery}
            data={response?.panelData}
            range={getTimeSrv().timeRange()}
            annotation={editorAnnotation}
            onAnnotationChange={onAnnotationChange}
          />
        </AnnotationQueryEditorActionsWrapper>
      </DataSourcePluginContextProvider>
      {shouldUseMappingUI(datasource) && (
        <>
          {renderStatus()}
          <AnnotationFieldMapper response={response} mappings={annotation.mappings} change={onMappingChange} />
        </>
      )}
    </>
  );
});

export default StandardAnnotationQueryEditor;
