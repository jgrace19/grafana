import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { queryErrorAlertStyles } from './QueryErrorAlert.stylex';
import { useMemo } from 'react';

import {
  OpenAssistantButton,
  createAssistantContextItem,
  useAssistant,
  useProvidePageContext,
} from '@grafana/assistant';
import { type DataQueryError, type GrafanaTheme2 } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { type DataQuery } from '@grafana/schema';
import { Icon } from '@grafana/ui';

export interface Props {
  error: DataQueryError;
  query?: DataQuery;
}

export function QueryErrorAlert({ error, query }: Props) {
  const { isAvailable } = useAssistant();

  const message = error?.message ?? error?.data?.message ?? 'Query error';

  const context = useMemo(() => buildAssistantContext(error, message, query), [error, message, query]);
  useProvidePageContext(/\/explore.*/, context);

  return (
    <div {...stylex.props(queryErrorAlertStyles.wrapper)}>
      <div {...stylex.props(queryErrorAlertStyles.icon)}>
        <Icon name="exclamation-triangle" />
      </div>
      <div {...stylex.props(queryErrorAlertStyles.message)}>
        {message}
        {error.traceId != null && (
          <>
            <br />{' '}
            <span>
              <Trans i18nKey="query.query-error-alert.trace-id" values={{ traceId: error.traceId }}>
                (Trace ID: {'{{traceId}}'})
              </Trans>
            </span>
          </>
        )}
      </div>
      {isAvailable && (
        <div {...stylex.props(queryErrorAlertStyles.assistantButton)}>
          <OpenAssistantButton
            origin="grafana/query-editor-error"
            prompt={`Help me analyze and fix the following ${error.type ? `\`${error.type}\`` : ''} query error: \`\`\`${message}\`\`\``}
            title={t('query.query-error-alert.fix-with-assistant', 'Fix with Assistant')}
            size="sm"
          />
        </div>
      )}
    </div>
  );
}

function buildAssistantContext(error: DataQueryError, message: string, query?: DataQuery) {
  const context = [
    createAssistantContextItem('structured', {
      title: t('query.query-error-alert.error-details', 'Query error details'),
      data: {
        type: error.type,
        message,
      },
    }),
  ];

  if (query) {
    context.push(
      createAssistantContextItem('structured', {
        title: t('query.query-error-alert.original-query', 'Original query'),
        data: query,
      })
    );

    if (query.datasource?.uid) {
      context.push(
        createAssistantContextItem('datasource', {
          datasourceUid: query.datasource.uid,
        })
      );
    }
  }

  return context;
}

