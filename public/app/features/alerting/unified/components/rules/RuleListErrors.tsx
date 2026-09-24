import { type SerializedError } from '@reduxjs/toolkit';
import * as stylex from '@stylexjs/stylex';
import { type FC, type JSX, type ReactElement, useMemo, useState } from 'react';
import { useLocalStorage } from 'react-use';

import { type DataSourceInstanceSettings } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { Alert, Button, Tooltip } from '@grafana/ui';
import { colors, typography } from '@grafana/ui/stylex/tokens.stylex';

import { useUnifiedAlertingSelector } from '../../hooks/useUnifiedAlertingSelector';
import { GRAFANA_RULES_SOURCE_NAME, getRulesDataSources } from '../../utils/datasource';
import { makeDataSourceLink } from '../../utils/misc';
import { isRulerNotSupportedResponse } from '../../utils/rules';

export function RuleListErrors(): ReactElement {
  const [expanded, setExpanded] = useState(false);
  const [closed, setClosed] = useLocalStorage('grafana.unifiedalerting.hideErrors', false);
  const promRuleRequests = useUnifiedAlertingSelector((state) => state.promRules);
  const rulerRuleRequests = useUnifiedAlertingSelector((state) => state.rulerRules);
  const errors = useMemo((): JSX.Element[] => {
    const [promRequestErrors, rulerRequestErrors] = [promRuleRequests, rulerRuleRequests].map((requests) =>
      getRulesDataSources().reduce<Array<{ error: SerializedError; dataSource: DataSourceInstanceSettings }>>(
        (result, dataSource) => {
          const error = requests[dataSource.name]?.error;
          if (requests[dataSource.name] && error && !isRulerNotSupportedResponse(requests[dataSource.name])) {
            return [...result, { dataSource, error }];
          }
          return result;
        },
        []
      )
    );
    const grafanaPromError = promRuleRequests[GRAFANA_RULES_SOURCE_NAME]?.error;
    const grafanaRulerError = rulerRuleRequests[GRAFANA_RULES_SOURCE_NAME]?.error;

    const result: JSX.Element[] = [];

    const unknownError = t('alerting.rule-list-errors.unknown-error', 'Unknown error.');

    if (grafanaPromError) {
      result.push(
        <>
          <Trans i18nKey="alerting.rule-list-errors.failed-to-load-grafana-rules-state">
            Failed to load Grafana rules state:
          </Trans>{' '}
          {grafanaPromError.message || unknownError}
        </>
      );
    }
    if (grafanaRulerError) {
      result.push(
        <>
          <Trans i18nKey="alerting.rule-list-errors.failed-to-load-grafana-rules-config">
            Failed to load Grafana rules config:
          </Trans>{' '}
          {grafanaRulerError?.message || unknownError}
        </>
      );
    }

    promRequestErrors.forEach(({ dataSource, error }) =>
      result.push(
        <>
          <Trans
            i18nKey="alerting.rule-list-errors.failed-to-load-rules-state"
            values={{ dataSource: dataSource.name }}
          >
            Failed to load rules state from{' '}
            <a href={makeDataSourceLink(dataSource.uid)} {...stylex.props(styles.dsLink)}>
              {'{{dataSource}}'}
            </a>
          </Trans>
          : {error.message || unknownError}
        </>
      )
    );

    rulerRequestErrors.forEach(({ dataSource, error }) =>
      result.push(
        <>
          <Trans
            i18nKey="alerting.rule-list-errors.failed-to-load-rules-config"
            values={{ dataSource: dataSource.name }}
          >
            Failed to load rules config from{' '}
            <a href={makeDataSourceLink(dataSource.uid)} {...stylex.props(styles.dsLink)}>
              {'{{dataSource}}'}
            </a>
          </Trans>
          : {error.message || unknownError}
        </>
      )
    );

    return result;
  }, [promRuleRequests, rulerRuleRequests]);

  return (
    <>
      {!!errors.length && closed && (
        <ErrorSummaryButton count={errors.length} onClick={() => setClosed((closed) => !closed)} />
      )}
      {!!errors.length && !closed && (
        <Alert
          data-testid="cloud-rulessource-errors"
          title={t(
            'alerting.rule-list-errors.cloud-rulessource-errors-title-errors-loading-rules',
            'Errors loading rules'
          )}
          severity="error"
          onRemove={() => setClosed(true)}
        >
          {expanded && errors.map((item, idx) => <div key={idx}>{item}</div>)}
          {!expanded && (
            <>
              <div>{errors[0]}</div>
              {errors.length >= 2 && (
                <Button
                  style={{ padding: 0 }}
                  fill="text"
                  icon="angle-right"
                  size="sm"
                  onClick={() => setExpanded(true)}
                >
                  <Trans i18nKey="alerting.rule-list-errors.more-errors" count={errors.length - 1}>
                    {'{{count}}'} more errors
                  </Trans>
                </Button>
              )}
            </>
          )}
        </Alert>
      )}
    </>
  );
}

interface ErrorSummaryProps {
  count: number;
  onClick: () => void;
}

const ErrorSummaryButton: FC<ErrorSummaryProps> = ({ count, onClick }) => {
  return (
    <div {...stylex.props(styles.floatRight)}>
      <Tooltip
        content={t('alerting.error-summary-button.content-show-all-errors', 'Show all errors')}
        placement="bottom"
      >
        <Button fill="text" variant="destructive" icon="exclamation-triangle" onClick={onClick}>
          <Trans i18nKey="alerting.rule-list-errors.button-errors" count={count}>
            {'{{count}}'} errors
          </Trans>
        </Button>
      </Tooltip>
    </div>
  );
};

const styles = stylex.create({
  floatRight: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  dsLink: {
    fontWeight: typography['--gf-typography-font-weight-bold'],
    color: colors['--gf-colors-text-link'],
  },
});
