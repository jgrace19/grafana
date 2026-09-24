import * as stylex from '@stylexjs/stylex';
import { lazy, Suspense } from 'react';

import { t } from '@grafana/i18n';
import { LoadingPlaceholder } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { sqlEditorStyles } from './sqlComponents.stylex';
import type { SqlQueryEditorProps } from './QueryEditor';
const QueryEditor = lazy(() => import(/* webpackChunkName: "sql-query-editor" */ './QueryEditor'));

export function SqlQueryEditorLazy(props: SqlQueryEditorProps) {
  return (
    <Suspense
      fallback={
        <LoadingPlaceholder
          text={t('grafana-sql.components.sql-query-editor-lazy.text-loading-editor', 'Loading editor')}
          className={mergeStylexClassName(stylex.props(sqlEditorStyles.lazyContainer)).className}
        />
      }
    >
      <QueryEditor {...props} />
    </Suspense>
  );
}
