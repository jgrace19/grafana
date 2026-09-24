import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { grafanaRuleQueryViewerStyles } from './GrafanaRuleQueryViewer.stylex';
import { keyBy, startCase, uniqueId } from 'lodash';
import * as React from 'react';

import { type DataSourceInstanceSettings, type GrafanaTheme2, type PanelData, urlUtil } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { type DataSourceRef } from '@grafana/schema';
import { Preview } from '@grafana/sql';
import { Alert, Badge, ErrorBoundaryAlert, LinkButton, Stack, Text } from '@grafana/ui';
import { type CombinedRule } from 'app/types/unified-alerting';

import { type AlertDataQuery, type AlertQuery } from '../../../types/unified-alerting-dto';
import { isExpressionQuery } from '../../expressions/guards';
import {
  type ExpressionQuery,
  ExpressionQueryType,
  ReducerMode,
  downsamplingTypes,
  reducerModes,
  reducerTypes,
  thresholdFunctions,
  upsamplingTypes,
} from '../../expressions/types';
import alertDef, { EvalFunction } from '../state/alertDef';

import { Spacer } from './components/Spacer';
import { TimeRangeLabel } from './components/TimeRangeLabel';
import { WithReturnButton } from './components/WithReturnButton';
import { ExpressionResult } from './components/expressions/Expression';
import { type ThresholdDefinition, getThresholdsForQueries } from './components/rule-editor/util';
import { RuleViewerVisualization } from './components/rule-viewer/RuleViewerVisualization';
import { DatasourceModelPreview } from './components/rule-viewer/tabs/Query/DataSourceModelPreview';
import { AlertRuleAction, useAlertRuleAbility } from './hooks/useAbilities';

interface GrafanaRuleViewerProps {
  rule: CombinedRule;
  queries: AlertQuery[];
  condition: string;
  evalDataByQuery?: Record<string, PanelData>;
}

export function GrafanaRuleQueryViewer({ rule, queries, condition, evalDataByQuery = {} }: GrafanaRuleViewerProps) {
  const dsByUid = keyBy(Object.values(config.datasources), (ds) => ds.uid);
  const dataQueries = queries.filter((q) => !isExpressionQuery(q.model));
  const expressions = queries.filter((q) => isExpressionQuery(q.model));

  const thresholds = getThresholdsForQueries(queries, condition);

  return (
    <Stack gap={1} direction="column" flex={'1 1 320px'}>
      <div {...stylex.props(grafanaRuleQueryViewerStyles.maxWidthContainer)}>
        <Stack gap={1} wrap="wrap" data-testid="queries-container">
          {dataQueries.map(({ model, relativeTimeRange, refId, datasourceUid }, index) => {
            const dataSource = dsByUid[datasourceUid];

            return (
              <QueryPreview
                rule={rule}
                key={index}
                refId={refId}
                model={model}
                relativeTimeRange={relativeTimeRange}
                dataSource={dataSource}
                thresholds={thresholds[refId]}
                queryData={evalDataByQuery[refId]}
              />
            );
          })}
        </Stack>
      </div>
      <div {...stylex.props(grafanaRuleQueryViewerStyles.maxWidthContainer)}>
        <Stack gap={1} wrap="wrap" data-testid="expressions-container">
          {expressions.map(({ model, refId, datasourceUid }, index) => {
            return (
              isExpressionQuery(model) && (
                <ExpressionPreview
                  key={index}
                  refId={refId}
                  isAlertCondition={condition === refId}
                  model={model}
                  evalData={evalDataByQuery[refId]}
                />
              )
            );
          })}
        </Stack>
      </div>
    </Stack>
  );
}

interface QueryPreviewProps extends Pick<AlertQuery, 'refId' | 'relativeTimeRange' | 'model'> {
  rule: CombinedRule;
  dataSource?: DataSourceInstanceSettings;
  queryData?: PanelData;
  thresholds?: ThresholdDefinition;
}

export function QueryPreview({
  refId,
  rule,
  thresholds,
  model,
  dataSource,
  queryData,
  relativeTimeRange,
}: QueryPreviewProps) {
  const isExpression = isExpressionQuery(model);
  const [exploreSupported, exploreAllowed] = useAlertRuleAbility(rule, AlertRuleAction.Explore);
  const canExplore = exploreSupported && exploreAllowed;

  const headerItems: React.ReactNode[] = [];

  if (dataSource) {
    const dataSourceName = dataSource.name ?? '[[Data source not found]]';
    const dataSourceImgUrl = dataSource.meta.info.logos.small;

    headerItems.push(<DataSourceBadge name={dataSourceName} imgUrl={dataSourceImgUrl} key="datasource" />);
  }

  if (relativeTimeRange) {
    headerItems.push(
      <Text color="secondary" key="timerange">
        <TimeRangeLabel relativeTimeRange={relativeTimeRange} />
      </Text>
    );
  }

  let exploreLink: string | undefined = undefined;
  if (!isExpression && canExplore) {
    exploreLink = dataSource && createExploreLink(dataSource, model);
  }

  return (
    <>
      <QueryBox refId={refId} headerItems={headerItems} exploreLink={exploreLink}>
        <div {...stylex.props(grafanaRuleQueryViewerStyles.queryPreviewWrapper)}>
          <ErrorBoundaryAlert>
            {model && dataSource && <DatasourceModelPreview model={model} dataSource={dataSource} />}
          </ErrorBoundaryAlert>
        </div>
      </QueryBox>
      {dataSource && <RuleViewerVisualization data={queryData} thresholds={thresholds} />}
    </>
  );
}

function createExploreLink(settings: DataSourceRef, model: AlertDataQuery): string {
  const { uid, type } = settings;
  const { refId, ...rest } = model;

  /*
    In my testing I've found some alerts that don't have a data source embedded inside the model.
    At this moment in time it is unclear to me why some alert definitions not have a data source embedded in the model.

    I don't think that should happen here, the fact that the datasource ref is sometimes missing here is a symptom of another cause. (Gilles)
   */
  return urlUtil.renderUrl(`${config.appSubUrl}/explore`, {
    left: JSON.stringify({
      datasource: settings.uid,
      queries: [{ refId: 'A', ...rest, datasource: { type, uid } }],
      range: { from: 'now-1h', to: 'now' },
    }),
  });
}

interface DataSourceBadgeProps {
  name: string;
  imgUrl: string;
}

function DataSourceBadge({ name, imgUrl }: DataSourceBadgeProps) {

  return (
    <div {...stylex.props(grafanaRuleQueryViewerStyles.dataSource)} key="datasource">
      <img src={imgUrl} width={16} alt={name} />
      {name}
    </div>
  );
}


interface ExpressionPreviewProps extends Pick<AlertQuery, 'refId'> {
  isAlertCondition: boolean;
  model: ExpressionQuery;
  evalData?: PanelData;
}

function ExpressionPreview({ refId, model, evalData, isAlertCondition }: ExpressionPreviewProps) {

  function renderPreview() {
    switch (model.type) {
      case ExpressionQueryType.math:
        return <MathExpressionViewer model={model} />;

      case ExpressionQueryType.reduce:
        return <ReduceConditionViewer model={model} />;

      case ExpressionQueryType.resample:
        return <ResampleExpressionViewer model={model} />;

      case ExpressionQueryType.classic:
        return <ClassicConditionViewer model={model} />;

      case ExpressionQueryType.threshold:
        return <ThresholdExpressionViewer model={model} />;

      case ExpressionQueryType.sql:
        return <Preview rawSql={model.expression || ''} datasourceType={model.datasource?.type} />;

      default:
        return (
          <Trans i18nKey="alerting.expression-preview.expression-not-supported" values={{ type: model.type }}>
            Expression not supported: {'{{type}}'}
          </Trans>
        );
    }
  }

  return (
    <QueryBox
      refId={refId}
      headerItems={[
        <Text color="secondary" key="expression-type">
          {startCase(model.type)}
        </Text>,
      ]}
      isAlertCondition={isAlertCondition}
    >
      <div {...stylex.props(grafanaRuleQueryViewerStyles.previewWrapper)}>
        {evalData?.errors?.map((error) => (
          <Alert
            key={uniqueId()}
            title={t('alerting.expression-preview.title-expression-failed', 'Expression failed')}
            severity="error"
            bottomSpacing={1}
          >
            {error.message}
          </Alert>
        ))}
        {renderPreview()}
      </div>
      <Spacer />
      {evalData && <ExpressionResult series={evalData.series} isAlertCondition={isAlertCondition} />}
    </QueryBox>
  );
}

interface QueryBoxProps extends React.PropsWithChildren<unknown> {
  refId: string;
  headerItems?: React.ReactNode;
  isAlertCondition?: boolean;
  exploreLink?: string;
}

function QueryBox({ refId, headerItems = [], children, isAlertCondition, exploreLink }: QueryBoxProps) {

  return (
    <div {...stylex.props(grafanaRuleQueryViewerStyles.container)}>
      <header {...stylex.props(grafanaRuleQueryViewerStyles.header)}>
        <span {...stylex.props(grafanaRuleQueryViewerStyles.refId)}>{refId}</span>
        {headerItems}
        <Spacer />
        {isAlertCondition && (
          <Badge color="green" icon="check" text={t('alerting.query-box.text-alert-condition', 'Alert condition')} />
        )}
        {exploreLink && (
          <WithReturnButton
            component={
              <LinkButton size="md" variant="secondary" icon="compass" href={exploreLink}>
                <Trans i18nKey="alerting.query-box.view-in-explore">View in Explore</Trans>
              </LinkButton>
            }
          />
        )}
      </header>
      {children}
    </div>
  );
}

;

function ClassicConditionViewer({ model }: { model: ExpressionQuery }) {

  const reducerFunctions = keyBy(alertDef.reducerTypes, (rt) => rt.value);
  const evalOperators = keyBy(alertDef.evalOperators, (eo) => eo.value);
  const evalFunctions = keyBy(alertDef.evalFunctions, (ef) => ef.value);

  return (
    <div {...stylex.props(grafanaRuleQueryViewerStyles.container)}>
      {model.conditions?.map(({ query, operator, reducer, evaluator }, index) => {
        const isRange = isRangeEvaluator(evaluator);

        return (
          <React.Fragment key={index}>
            <div {...stylex.props(grafanaRuleQueryViewerStyles.blue)}>
              {index === 0
                ? t('alerting.classic-condition-viewer.when', 'WHEN')
                : !!operator?.type && evalOperators[operator?.type]?.text}
            </div>
            <div {...stylex.props(grafanaRuleQueryViewerStyles.bold)}>{reducer?.type && reducerFunctions[reducer.type]?.text}</div>
            <div {...stylex.props(grafanaRuleQueryViewerStyles.blue)}>
              <Trans i18nKey="alerting.classic-condition-viewer.of">OF</Trans>
            </div>
            <div {...stylex.props(grafanaRuleQueryViewerStyles.bold)}>{query.params[0]}</div>
            <div {...stylex.props(grafanaRuleQueryViewerStyles.blue)}>{evalFunctions[evaluator.type].text}</div>
            <div {...stylex.props(grafanaRuleQueryViewerStyles.bold)}>
              {isRange ? `(${evaluator.params[0]}; ${evaluator.params[1]})` : evaluator.params[0]}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

;

function ReduceConditionViewer({ model }: { model: ExpressionQuery }) {

  const { reducer, expression, settings } = model;
  const reducerType = reducerTypes.find((rt) => rt.value === reducer);

  const reducerMode = settings?.mode ?? ReducerMode.Strict;
  const modeName = reducerModes.find((rm) => rm.value === reducerMode);

  return (
    <div {...stylex.props(grafanaRuleQueryViewerStyles.container)}>
      <div {...stylex.props(grafanaRuleQueryViewerStyles.label)}>
        <Trans i18nKey="alerting.reduce-condition-viewer.function">Function</Trans>
      </div>
      <div {...stylex.props(grafanaRuleQueryViewerStyles.value)}>{reducerType?.label}</div>

      <div {...stylex.props(grafanaRuleQueryViewerStyles.label)}>
        <Trans i18nKey="alerting.reduce-condition-viewer.input">Input</Trans>
      </div>
      <div {...stylex.props(grafanaRuleQueryViewerStyles.value)}>{expression}</div>

      <div {...stylex.props(grafanaRuleQueryViewerStyles.label)}>
        <Trans i18nKey="alerting.reduce-condition-viewer.mode">Mode</Trans>
      </div>
      <div {...stylex.props(grafanaRuleQueryViewerStyles.value)}>{modeName?.label}</div>
    </div>
  );
}

;

function ResampleExpressionViewer({ model }: { model: ExpressionQuery }) {

  const { expression, window, downsampler, upsampler } = model;
  const downsamplerType = downsamplingTypes.find((dt) => dt.value === downsampler);
  const upsamplerType = upsamplingTypes.find((ut) => ut.value === upsampler);

  return (
    <div {...stylex.props(grafanaRuleQueryViewerStyles.container)}>
      <div {...stylex.props(grafanaRuleQueryViewerStyles.label)}>
        <Trans i18nKey="alerting.resample-expression-viewer.input">Input</Trans>
      </div>
      <div {...stylex.props(grafanaRuleQueryViewerStyles.value)}>{expression}</div>

      <div {...stylex.props(grafanaRuleQueryViewerStyles.label)}>
        <Trans i18nKey="alerting.resample-expression-viewer.resample-to">Resample to</Trans>
      </div>
      <div {...stylex.props(grafanaRuleQueryViewerStyles.value)}>{window}</div>

      <div {...stylex.props(grafanaRuleQueryViewerStyles.label)}>
        <Trans i18nKey="alerting.resample-expression-viewer.downsample">Downsample</Trans>
      </div>
      <div {...stylex.props(grafanaRuleQueryViewerStyles.value)}>{downsamplerType?.label}</div>

      <div {...stylex.props(grafanaRuleQueryViewerStyles.label)}>
        <Trans i18nKey="alerting.resample-expression-viewer.upsample">Upsample</Trans>
      </div>
      <div {...stylex.props(grafanaRuleQueryViewerStyles.value)}>{upsamplerType?.label}</div>
    </div>
  );
}

;

function ThresholdExpressionViewer({ model }: { model: ExpressionQuery }) {

  const { expression, conditions } = model;

  const evaluator = conditions && conditions[0]?.evaluator;
  const thresholdFunction = thresholdFunctions.find((tf) => tf.value === evaluator?.type);

  const isRange = evaluator ? isRangeEvaluator(evaluator) : false;

  const unloadEvaluator = conditions && conditions[0]?.unloadEvaluator;
  const unloadThresholdFunction = thresholdFunctions.find((tf) => tf.value === unloadEvaluator?.type);

  const unloadIsRange = unloadEvaluator ? isRangeEvaluator(unloadEvaluator) : false;

  return (
    <>
      <div {...stylex.props(grafanaRuleQueryViewerStyles.container)}>
        <div {...stylex.props(grafanaRuleQueryViewerStyles.label)}>
          <Trans i18nKey="alerting.threshold-expression-viewer.input">Input</Trans>
        </div>
        <div {...stylex.props(grafanaRuleQueryViewerStyles.value)}>{expression}</div>

        {evaluator && (
          <>
            <div {...stylex.props(grafanaRuleQueryViewerStyles.blue)}>{thresholdFunction?.label}</div>
            <div {...stylex.props(grafanaRuleQueryViewerStyles.bold)}>
              {isRange ? `(${evaluator.params[0]}; ${evaluator.params[1]})` : evaluator.params[0]}
            </div>
          </>
        )}
      </div>
      <div {...stylex.props(grafanaRuleQueryViewerStyles.container)}>
        {unloadEvaluator && (
          <>
            <div {...stylex.props(grafanaRuleQueryViewerStyles.label)}>
              <Trans i18nKey="alerting.threshold-expression-viewer.stop-alerting-when">
                Stop alerting (or pending state) when{' '}
              </Trans>
            </div>
            <div {...stylex.props(grafanaRuleQueryViewerStyles.value)}>{expression}</div>

            <>
              <div {...stylex.props(grafanaRuleQueryViewerStyles.blue)}>{unloadThresholdFunction?.label}</div>
              <div {...stylex.props(grafanaRuleQueryViewerStyles.bold)}>
                {unloadIsRange
                  ? `(${unloadEvaluator.params[0]}; ${unloadEvaluator.params[1]})`
                  : unloadEvaluator.params[0]}
              </div>
            </>
          </>
        )}
      </div>
    </>
  );
}


function MathExpressionViewer({ model }: { model: ExpressionQuery }) {

  const { expression } = model;

  return (
    <div {...stylex.props(grafanaRuleQueryViewerStyles.container)}>
      <div {...stylex.props(grafanaRuleQueryViewerStyles.label)}>
        <Trans i18nKey="alerting.math-expression-viewer.input">Input</Trans>
      </div>
      <div {...stylex.props(grafanaRuleQueryViewerStyles.value)}>{expression}</div>
    </div>
  );
}

;

function isRangeEvaluator(evaluator: { params: number[]; type: EvalFunction }) {
  return (
    evaluator.type === EvalFunction.IsWithinRange ||
    evaluator.type === EvalFunction.IsOutsideRange ||
    evaluator.type === EvalFunction.IsOutsideRangeIncluded ||
    evaluator.type === EvalFunction.IsWithinRangeIncluded
  );
}
