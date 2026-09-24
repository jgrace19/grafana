import * as stylex from '@stylexjs/stylex';
import { useState, useMemo, useEffect } from 'react';
import { useAsyncFn, useDebounce } from 'react-use';

import { formattedValueToString, getValueFormat, type TimeRange } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { Icon, Spinner } from '@grafana/ui';

import { type DB, type SQLQuery, type ValidationResults } from '../../types';
import { sqlEditorStyles } from '../sqlComponents.stylex';

export interface QueryValidatorProps {
  db: DB;
  query: SQLQuery;
  range?: TimeRange;
  onValidate: (isValid: boolean) => void;
}

export function QueryValidator({ db, query, onValidate, range }: QueryValidatorProps) {
  const [validationResult, setValidationResult] = useState<ValidationResults | null>();
  const valueFormatter = useMemo(() => getValueFormat('bytes'), []);

  const [state, validateQuery] = useAsyncFn(
    async (q: SQLQuery) => {
      if (q.rawSql?.trim() === '') {
        return null;
      }

      return await db.validateQuery(q, range);
    },
    [db]
  );

  const [,] = useDebounce(
    async () => {
      const result = await validateQuery(query);
      if (result) {
        setValidationResult(result);
      }

      return null;
    },
    1000,
    [query, validateQuery]
  );

  useEffect(() => {
    if (validationResult?.isError) {
      onValidate(false);
    }
    if (validationResult?.isValid) {
      onValidate(true);
    }
  }, [validationResult, onValidate]);

  if (!state.value && !state.loading) {
    return null;
  }

  const error = state.value?.error ? processErrorMessage(state.value.error) : '';

  return (
    <>
      {state.loading && (
        <div {...stylex.props(sqlEditorStyles.validatorInfo)}>
          <Spinner inline={true} size="xs" />{' '}
          <Trans i18nKey="grafana-sql.components.query-validator.validating-query">Validating query...</Trans>
        </div>
      )}
      {!state.loading && state.value && (
        <>
          <>
            {state.value.isValid && state.value.statistics && (
              <div {...stylex.props(sqlEditorStyles.validatorValid)}>
                <Trans
                  i18nKey="grafana-sql.components.query-validator.query-will-process"
                  values={{ bytes: formattedValueToString(valueFormatter(state.value.statistics.TotalBytesProcessed)) }}
                >
                  <Icon name="check" /> This query will process <strong>{'{{bytes}}'}</strong> when run.
                </Trans>
              </div>
            )}
          </>

          <>{state.value.isError && <div {...stylex.props(sqlEditorStyles.validatorError)}>{error}</div>}</>
        </>
      )}
    </>
  );
}

function processErrorMessage(error: string) {
  const splat = error.split(':');
  if (splat.length > 2) {
    return splat.slice(2).join(':');
  }
  return error;
}
