import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { expressionStyles } from './Expression.stylex';
import { uniqueId } from 'lodash';
import { type FC, Suspense, lazy, useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  CoreApp,
  type DataFrame,
  type GrafanaTheme2,
  LoadingState,
  type PanelData,
  dateTimeFormat,
  isTimeSeriesFrames,
} from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { Alert, AutoSizeInput, Button, IconButton, Stack, Text, clearButtonStyles } from '@grafana/ui';
import { ClassicConditions } from 'app/features/expressions/components/ClassicConditions';
import { Math } from 'app/features/expressions/components/Math';
import { Reduce } from 'app/features/expressions/components/Reduce';
import { Resample } from 'app/features/expressions/components/Resample';
import { Threshold } from 'app/features/expressions/components/Threshold';
import {
  type ExpressionQuery,
  ExpressionQueryType,
  expressionTypes,
  getExpressionLabel,
} from 'app/features/expressions/types';
import { type AlertQuery, PromAlertingRuleState } from 'app/types/unified-alerting-dto';

import { usePagination } from '../../hooks/usePagination';
import { type RuleFormValues } from '../../types/rule-form';
import { isGrafanaRecordingRuleByType } from '../../utils/rules';
import { PopupCard } from '../HoverCard';
import { Spacer } from '../Spacer';
import { AlertStateTag } from '../rules/AlertStateTag';

import { ExpressionStatusIndicator } from './ExpressionStatusIndicator';
import { formatLabels, formatSeriesValue, getSeriesLabels, getSeriesName, getSeriesValue, isEmptySeries } from './util';

const SqlExpr = lazy(() =>
  import('app/features/expressions/components/SqlExpressions/SqlExpr').then((module) => ({
    default: module.SqlExpr,
  }))
);

interface ExpressionProps {
  isAlertCondition?: boolean;
  data?: PanelData;
  error?: Error;
  warning?: Error;
  queries: AlertQuery[];
  query: ExpressionQuery;
  onSetCondition: (refId: string) => void;
  onUpdateRefId: (oldRefId: string, newRefId: string) => void;
  onRemoveExpression: (refId: string) => void;
  onChangeQuery: (query: ExpressionQuery) => void;
}

export const Expression: FC<ExpressionProps> = ({
  queries = [],
  query,
  data,
  error,
  warning,
  isAlertCondition,
  onSetCondition,
  onUpdateRefId,
  onRemoveExpression,
  onChangeQuery,
}) => {

  const queryType = query?.type;

  const { setError, clearErrors, watch } = useFormContext<RuleFormValues>();
  const type = watch('type');
  const isGrafanaRecordingRule = type ? isGrafanaRecordingRuleByType(type) : false;

  const onQueriesValidationError = useCallback(
    (errorMsg: string | undefined) => {
      if (errorMsg) {
        setError('queries', { type: 'custom', message: errorMsg });
      } else {
        clearErrors('queries');
      }
    },
    [setError, clearErrors]
  );

  const isLoading = data && Object.values(data).some((d) => Boolean(d) && d.state === LoadingState.Loading);
  const hasResults = Array.isArray(data?.series) && !isLoading;
  const series = data?.series ?? [];

  const alertCondition = isAlertCondition ?? false;

  const { seriesCount, groupedByState } = getGroupedByStateAndSeriesCount(series);

  const renderExpressionType = useCallback(
    (query: ExpressionQuery) => {
      // these are the refs we can choose from that don't include the current one
      const availableRefIds = queries
        .filter((q) => query.refId !== q.refId)
        .map((q) => ({ value: q.refId, label: q.refId }));

      switch (query.type) {
        case ExpressionQueryType.math:
          return <Math onChange={onChangeQuery} query={query} labelWidth={'auto'} onRunQuery={() => {}} />;

        case ExpressionQueryType.reduce:
          return (
            <Reduce
              onChange={onChangeQuery}
              refIds={availableRefIds}
              labelWidth={'auto'}
              app={CoreApp.UnifiedAlerting}
              query={query}
            />
          );

        case ExpressionQueryType.resample:
          return <Resample onChange={onChangeQuery} query={query} labelWidth={'auto'} refIds={availableRefIds} />;

        case ExpressionQueryType.classic:
          return <ClassicConditions onChange={onChangeQuery} query={query} refIds={availableRefIds} />;

        case ExpressionQueryType.threshold:
          return (
            <Threshold
              onChange={onChangeQuery}
              query={query}
              labelWidth={'auto'}
              refIds={availableRefIds}
              onError={onQueriesValidationError}
              useHysteresis={true}
            />
          );

        case ExpressionQueryType.sql:
          return (
            <Suspense fallback={null}>
              <SqlExpr
                onChange={(query) => onChangeQuery(query)}
                query={query}
                refIds={availableRefIds}
                alerting
                queries={[]}
              />
            </Suspense>
          );

        default:
          return (
            <Trans i18nKey="alerting.expression.not-supported" values={{ expression: query.type }}>
              Expression not supported: {'{{expression}}'}
            </Trans>
          );
      }
    },
    [onChangeQuery, queries, onQueriesValidationError]
  );

  const selectedExpressionType = expressionTypes.find((o) => o.value === queryType);
  const selectedExpressionDescription = selectedExpressionType?.description ?? '';

  return (
    <div
      className={cx(
        expressionStyles.expression.wrapper,
        alertCondition && expressionStyles.expression.alertCondition,
        queryType === ExpressionQueryType.classic && expressionStyles.expression.classic,
        queryType !== ExpressionQueryType.classic && expressionStyles.expression.nonClassic
      )}
    >
      <div className={expressionStyles.expression.stack}>
        <Header
          refId={query.refId}
          queryType={queryType}
          onRemoveExpression={() => onRemoveExpression(query.refId)}
          onUpdateRefId={(newRefId) => onUpdateRefId(query.refId, newRefId)}
          onSetCondition={onSetCondition}
          query={query}
          alertCondition={alertCondition}
        />
        <div className={expressionStyles.expression.body}>
          {error && (
            <Alert title={t('alerting.expression.title-expression-failed', 'Expression failed')} severity="error">
              {error.message}
            </Alert>
          )}
          {warning && (
            <Alert title={t('alerting.expression.title-expression-warning', 'Expression warning')} severity="warning">
              {warning.message}
            </Alert>
          )}
          <div className={expressionStyles.expression.description}>{selectedExpressionDescription}</div>
          {renderExpressionType(query)}
        </div>
        {hasResults && (
          <>
            <ExpressionResult
              series={series}
              isAlertCondition={isAlertCondition}
              isRecordingRule={isGrafanaRecordingRule}
            />
            {!isGrafanaRecordingRule && (
              <div {...stylex.props(expressionStyles.footer)}>
                <Stack direction="row" alignItems="center">
                  <Spacer />

                  <PreviewSummary
                    isCondition={Boolean(isAlertCondition)}
                    firing={groupedByState[PromAlertingRuleState.Firing].length}
                    normal={groupedByState[PromAlertingRuleState.Inactive].length}
                    seriesCount={seriesCount}
                  />
                </Stack>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface ExpressionResultProps {
  series: DataFrame[];
  isAlertCondition?: boolean;
  isRecordingRule?: boolean;
}
export const PAGE_SIZE = 20;
export const ExpressionResult: FC<ExpressionResultProps> = ({ series, isAlertCondition, isRecordingRule = false }) => {
  const { pageItems, previousPage, nextPage, numberOfPages, pageStart, pageEnd } = usePagination(series, 1, PAGE_SIZE);

  // sometimes we receive results where every value is just "null" when noData occurs
  const emptyResults = isEmptySeries(series);
  const isTimeSeriesResults = !emptyResults && isTimeSeriesFrames(series);

  const shouldShowPagination = numberOfPages > 1;

  return (
    <div className={expressionStyles.expression.results}>
      {!emptyResults && isTimeSeriesResults && (
        <div>
          {pageItems.map((frame, index) => (
            <TimeseriesRow
              key={uniqueId()}
              frame={frame}
              index={pageStart + index}
              isAlertCondition={isAlertCondition}
            />
          ))}
        </div>
      )}
      {!emptyResults &&
        !isTimeSeriesResults &&
        pageItems.map((frame, index) => (
          // There's no way to uniquely identify a frame that doesn't cause render bugs :/ (Gilles)
          <FrameRow
            key={uniqueId()}
            frame={frame}
            index={pageStart + index}
            isAlertCondition={isAlertCondition}
            isRecordingRule={isRecordingRule}
          />
        ))}
      {emptyResults && (
        <div className={cx(expressionStyles.expression.noData, expressionStyles.mutedText)}>
          <Trans i18nKey="alerting.expression-result.no-data">No data</Trans>
        </div>
      )}
      {shouldShowPagination && (
        <div className={expressionStyles.pagination.wrapper} data-testid="paginate-expression">
          <Stack>
            <Button
              variant="secondary"
              fill="outline"
              onClick={previousPage}
              icon="angle-left"
              size="sm"
              aria-label={t('alerting.expression-result.aria-label-previouspage', 'previous-page')}
            />
            <Spacer />
            <span {...stylex.props(expressionStyles.mutedText)}>
              <Trans
                i18nKey="alerting.expression-result.page-counter"
                values={{ pageStart, pageEnd, numPages: series.length }}
              >
                {'{{pageStart}}'} - {'{{pageEnd}}'} of {'{{numPages}}'}
              </Trans>
            </span>
            <Spacer />
            <Button
              variant="secondary"
              fill="outline"
              onClick={nextPage}
              icon="angle-right"
              size="sm"
              aria-label={t('alerting.expression-result.aria-label-nextpage', 'next-page')}
            />
          </Stack>
        </div>
      )}
    </div>
  );
};

export const PreviewSummary: FC<{ firing: number; normal: number; isCondition: boolean; seriesCount: number }> = ({
  firing,
  normal,
  isCondition,
  seriesCount,
}) => {
  const { mutedText } = (getStyles);

  if (seriesCount === 0) {
    return (
      <span className={mutedText}>
        <Trans i18nKey="alerting.preview-summary.no-series">No series</Trans>
      </span>
    );
  }

  if (isCondition) {
    return <span className={mutedText}>{`${seriesCount} series: ${firing} firing, ${normal} normal`}</span>;
  }

  return <span className={mutedText}>{`${seriesCount} series`}</span>;
};

export function getGroupedByStateAndSeriesCount(series: DataFrame[]) {
  const noDataSeries = series.filter((serie) => getSeriesValue(serie) === undefined).length;
  const groupedByState = {
    // we need to filter out series with no data (undefined) or zero value
    [PromAlertingRuleState.Firing]: series.filter(
      (serie) => getSeriesValue(serie) !== undefined && getSeriesValue(serie) !== 0
    ),
    [PromAlertingRuleState.Inactive]: series.filter((serie) => getSeriesValue(serie) === 0),
  };

  const seriesCount = series.length - noDataSeries;

  return { groupedByState, seriesCount };
}

interface HeaderProps {
  refId: string;
  queryType: ExpressionQueryType;
  onUpdateRefId: (refId: string) => void;
  onRemoveExpression: () => void;
  onSetCondition: (refId: string) => void;
  query: ExpressionQuery;
  alertCondition: boolean;
}

const Header: FC<HeaderProps> = ({
  refId,
  queryType,
  onUpdateRefId,
  onRemoveExpression,
  onSetCondition,
  alertCondition,
  query,
}) => {
  const clearButton = (clearButtonStyles);
  /**
   * There are 3 edit modes:
   *
   * 1. "refId": Editing the refId (ie. A -> B)
   * 2. "expressionType": Editing the type of the expression (ie. Reduce -> Math)
   * 3. "false": This means we're not editing either of those
   */
  const [editMode, setEditMode] = useState<'refId' | 'expressionType' | false>(false);

  const editing = editMode !== false;
  const editingRefId = editing && editMode === 'refId';

  return (
    <header className={expressionStyles.header.wrapper}>
      <Stack direction="row" gap={0.5} alignItems="center">
        <Stack direction="row" gap={1} alignItems="center">
          {!editingRefId && (
            <button type="button" className={cx(clearButton, expressionStyles.editable)} onClick={() => setEditMode('refId')}>
              <div className={expressionStyles.expression.refId}>{refId}</div>
            </button>
          )}
          {editingRefId && (
            <AutoSizeInput
              autoFocus
              defaultValue={refId}
              minWidth={5}
              onFocus={(event) => event.target.select()}
              onBlur={(event) => {
                onUpdateRefId(event.currentTarget.value);
                setEditMode(false);
              }}
            />
          )}
          <div>{getExpressionLabel(queryType)}</div>
        </Stack>
        <Spacer />
        <ExpressionStatusIndicator
          refId={refId}
          onSetCondition={() => onSetCondition(query.refId)}
          isCondition={alertCondition}
        />
        <IconButton
          name="trash-alt"
          variant="secondary"
          {...stylex.props(expressionStyles.mutedIcon)}
          onClick={onRemoveExpression}
          tooltip={t('alerting.header.tooltip-remove', 'Remove expression "{{refId}}"', { refId })}
        />
      </Stack>
    </header>
  );
};

interface FrameProps extends Pick<ExpressionProps, 'isAlertCondition'> {
  frame: DataFrame;
  index: number;
  isRecordingRule?: boolean;
}

const OpeningBracket = () => <span>{'{'}</span>;
const ClosingBracket = () => <span>{'}'}</span>;
const Quote = () => <span>&quot;</span>;
const Equals = () => <span>{'='}</span>;

function FrameRow({ frame, index, isAlertCondition, isRecordingRule }: FrameProps) {

  const name = getSeriesName(frame) || 'Series ' + index;
  const value = getSeriesValue(frame);
  const labelsRecord = getSeriesLabels(frame);
  const labels = Object.entries(labelsRecord);
  const hasLabels = labels.length > 0;

  const showFiring = isAlertCondition && value !== 0;
  const showNormal = isAlertCondition && value === 0;

  const title = `${hasLabels ? '' : name}${hasLabels ? `{${formatLabels(labelsRecord)}}` : ''}`;
  const shouldRenderSumary = !isRecordingRule;

  return (
    <div className={expressionStyles.expression.resultsRow}>
      <Stack direction="row" gap={1} alignItems="center">
        <div className={expressionStyles.expression.resultLabel} title={title}>
          <Text variant="code">
            {hasLabels ? (
              <>
                <OpeningBracket />
                {labels.map(([key, value], index) => (
                  <Text variant="body" key={uniqueId()}>
                    <span className={expressionStyles.expression.labelKey}>{key}</span>
                    <Equals />
                    <Quote />
                    <span className={expressionStyles.expression.labelValue}>{value}</span>
                    <Quote />
                    {index < labels.length - 1 && <span>, </span>}
                  </Text>
                ))}
                <ClosingBracket />
              </>
            ) : (
              <span className={expressionStyles.expression.labelKey}>{title}</span>
            )}
          </Text>
        </div>
        <div className={expressionStyles.expression.resultValue}>{formatSeriesValue(value)}</div>
        {shouldRenderSumary && (
          <>
            {showFiring && <AlertStateTag state={PromAlertingRuleState.Firing} size="sm" />}
            {showNormal && <AlertStateTag state={PromAlertingRuleState.Inactive} size="sm" />}
          </>
        )}
      </Stack>
    </div>
  );
}
interface TimeseriesRowProps extends Omit<FrameProps, 'isRecordingRule'> {}
const TimeseriesRow: FC<TimeseriesRowProps & { index: number }> = ({ frame, index }) => {

  const valueField = frame.fields[1]; // field 0 is "time", field 1 is "value"

  const hasLabels = valueField.labels;
  const displayNameFromDS = valueField.config?.displayNameFromDS;
  const name = displayNameFromDS ?? (hasLabels ? formatLabels(valueField.labels ?? {}) : 'Series ' + index);

  const timestamps = frame.fields[0].values;

  const getTimestampFromIndex = (index: number) => frame.fields[0].values[index];
  const getValueFromIndex = (index: number) => frame.fields[1].values[index];

  return (
    <div className={expressionStyles.expression.resultsRow}>
      <Stack direction="row" alignItems="center">
        <span className={cx(expressionStyles.mutedText, expressionStyles.expression.resultLabel)} title={name}>
          {name}
        </span>
        <div className={expressionStyles.expression.resultValue}>
          <PopupCard
            placement="right"
            wrapperClassName={expressionStyles.timeseriesTableWrapper}
            content={
              <table {...stylex.props(expressionStyles.timeseriesTable)}>
                <thead>
                  <tr>
                    <th>
                      <Trans i18nKey="alerting.timeseries-row.timestamp">Timestamp</Trans>
                    </th>
                    <th>
                      <Trans i18nKey="alerting.timeseries-row.value">Value</Trans>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {timestamps.map((_, index) => (
                    <tr key={index}>
                      <td {...stylex.props(expressionStyles.mutedText)}>{dateTimeFormat(getTimestampFromIndex(index))}</td>
                      <td className={expressionStyles.expression.resultValue}>{getValueFromIndex(index)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }
          >
            <span>
              <Trans i18nKey="alerting.timeseries-row.time-series-data">Time series data</Trans>
            </span>
          </PopupCard>
        </div>
      </Stack>
    </div>
  );
};

