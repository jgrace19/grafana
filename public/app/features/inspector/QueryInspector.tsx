import { css } from '@emotion/css';
import { useEffect, useRef, useState } from 'react';
import { Subscription } from 'rxjs';

import { LoadingState, type PanelData } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { Button, ClipboardButton, JSONFormatter, LoadingPlaceholder, Space, Stack } from '@grafana/ui';
import { backendSrv } from 'app/core/services/backend_srv';

import { getPanelInspectorStyles2 } from './styles';

interface ExecutedQueryInfo {
  refId: string;
  query: string;
  frames: number;
  rows: number;
}

interface Props {
  instanceId?: string;
  data: PanelData;
  onRefreshQuery: () => void;
}

export function QueryInspector({ instanceId, data, onRefreshQuery }: Props) {
  const [allNodesExpanded, setAllNodesExpanded] = useState<boolean | null>(null);
  const [executedQueries, setExecutedQueries] = useState<ExecutedQueryInfo[]>([]);
  const [response, setResponse] = useState<object>({});
  const formattedJsonRef = useRef<object | undefined>(undefined);

  const onDataSourceResponse = (resp: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    if ((resp.config as Record<string, unknown>)?.hideFromInspector) {
      return;
    }

    const cloned: Record<string, unknown> = { ...resp };

    if (cloned.headers) {
      delete cloned.headers;
    }

    if (cloned.config) {
      cloned.request = cloned.config;
      delete cloned.config;
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const request = cloned.request as Record<string, unknown>;
      delete request.transformRequest;
      delete request.transformResponse;
      delete request.paramSerializer;
      delete request.jsonpCallbackParam;
      delete request.headers;
      delete request.requestId;
      delete request.inspect;
      delete request.retry;
      delete request.timeout;
    }

    if (cloned.data) {
      cloned.response = cloned.data;
      delete cloned.config;
      delete cloned.data;
      delete cloned.status;
      delete cloned.statusText;
      delete cloned.ok;
      delete cloned.url;
      delete cloned.redirected;
      delete cloned.type;
      delete cloned.$$config;
    }

    setResponse(cloned);
  };

  useEffect(() => {
    const subs = new Subscription();
    subs.add(
      backendSrv.getInspectorStream().subscribe({
        next: (resp) => {
          let update = true;
          if (instanceId && resp?.requestId) {
            update = resp.requestId.startsWith(instanceId);
          }
          if (update) {
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            onDataSourceResponse(resp.response as unknown as Record<string, unknown>);
          }
        },
      })
    );
    return () => subs.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instanceId]);

  useEffect(() => {
    const frames = data.series;
    const queries: ExecutedQueryInfo[] = [];

    if (frames?.length) {
      let last: ExecutedQueryInfo | undefined = undefined;

      frames.forEach((frame) => {
        const query = frame.meta?.executedQueryString;

        if (query) {
          const refId = frame.refId || '?';

          if (last?.refId === refId) {
            last.frames++;
            last.rows += frame.length;
          } else {
            last = {
              refId,
              frames: 0,
              rows: frame.length,
              query,
            };
            queries.push(last);
          }
        }
      });
    }

    setExecutedQueries(queries);
  }, [data]);

  const setFormattedJson = (formattedJson: object) => {
    formattedJsonRef.current = formattedJson;
  };

  const getTextForClipboard = () => {
    return JSON.stringify(formattedJsonRef.current, null, 2);
  };

  const onToggleExpand = () => {
    setAllNodesExpanded((prev) => !prev);
  };

  const getNrOfOpenNodes = () => {
    if (allNodesExpanded === null) {
      return 3;
    } else if (allNodesExpanded) {
      return 20;
    }
    return 1;
  };

  const renderExecutedQueries = (queries: ExecutedQueryInfo[]) => {
    if (!queries.length) {
      return null;
    }

    const styles = {
      refId: css({
        fontWeight: config.theme.typography.weight.semibold,
        color: config.theme.colors.textBlue,
        marginRight: '8px',
      }),
    };

    return (
      <div>
        {queries.map((info) => {
          return (
            <Stack key={info.refId} gap={1} direction="column">
              <div>
                <span className={styles.refId}>{info.refId}:</span>
                {info.frames > 1 && (
                  <span>
                    <Trans i18nKey="inspector.query-inspector.count-frames" count={info.frames}>
                      {'{{count}}'} frames,{' '}
                    </Trans>
                  </span>
                )}
                <span>
                  <Trans i18nKey="inspector.query-inspector.count-rows" count={info.rows}>
                    {'{{count}}'} rows
                  </Trans>
                </span>
              </div>
              <pre>{info.query}</pre>
            </Stack>
          );
        })}
      </div>
    );
  };

  const openNodes = getNrOfOpenNodes();
  const styles = getPanelInspectorStyles2(config.theme2);
  const haveData = Object.keys(response).length > 0;
  const isLoading = data.state === LoadingState.Loading;

  return (
    <div className={styles.wrap}>
      <div data-testid={selectors.components.PanelInspector.Query.content}>
        <h3 className={styles.heading}>
          <Trans i18nKey="inspector.query-inspector.query-inspector">Query inspector</Trans>
        </h3>
        <p className="small muted">
          <Trans i18nKey="inspector.query.description">
            Query inspector allows you to view raw request and response. To collect this data Grafana needs to issue a
            new query. Click refresh button below to trigger a new query.
          </Trans>
        </p>
      </div>
      {renderExecutedQueries(executedQueries)}
      <Stack direction={'row'} gap={2} justifyContent={'flex-start'} wrap>
        <Button
          icon="sync"
          onClick={onRefreshQuery}
          data-testid={selectors.components.PanelInspector.Query.refreshButton}
        >
          <Trans i18nKey="inspector.query.refresh">Refresh</Trans>
        </Button>

        {haveData && (
          <Button icon={allNodesExpanded ? 'minus' : 'plus'} variant="secondary" onClick={onToggleExpand}>
            {allNodesExpanded ? (
              <Trans i18nKey="inspector.query.collapse-all">Collapse all</Trans>
            ) : (
              <Trans i18nKey="inspector.query.expand-all">Expand all</Trans>
            )}
          </Button>
        )}

        {haveData && (
          <ClipboardButton getText={getTextForClipboard} icon="copy" variant="secondary">
            <Trans i18nKey="inspector.query.copy-to-clipboard">Copy to clipboard</Trans>
          </ClipboardButton>
        )}
      </Stack>
      <Space v={2} />
      <div className={styles.content}>
        {isLoading && (
          <LoadingPlaceholder
            text={t('inspector.query-inspector.text-loading-query-inspector', 'Loading query inspector...')}
          />
        )}
        {!isLoading && haveData && (
          <JSONFormatter json={response} open={openNodes} onDidRender={setFormattedJson} />
        )}
        {!isLoading && !haveData && (
          <p className="muted">
            <Trans i18nKey="inspector.query.no-data">No request and response collected yet. Hit refresh button</Trans>
          </p>
        )}
      </div>
    </div>
  );
}
