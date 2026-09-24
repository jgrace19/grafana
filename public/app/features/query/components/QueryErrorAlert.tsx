import * as stylex from '@stylexjs/stylex';
import { useMemo } from 'react';

import {
  OpenAssistantButton,
  createAssistantContextItem,
  useAssistant,
  useProvidePageContext,
} from '@grafana/assistant';
import { type DataQueryError } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { type DataQuery } from '@grafana/schema';
import { Icon } from '@grafana/ui';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

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
    <div {...stylex.props(styles.wrapper)}>
      <div {...stylex.props(styles.icon)}>
        <Icon name="exclamation-triangle" />
      </div>
      <div {...stylex.props(styles.message)}>
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
        <div {...stylex.props(styles.assistantButton)}>
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

const styles = stylex.create({
  wrapper: {
    marginTop: spacing['--gf-spacing-x0-5'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    backgroundColor: colors['--gf-colors-error-main'],
    color: colors['--gf-colors-error-contrast-text'],
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
  },
  message: {
    fontSize: typography['--gf-typography-body-small-font-size'],
    fontFamily: typography['--gf-typography-font-family-monospace'],
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
    flex: '1',
  },
  assistantButton: {
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x1'],
  },
});
