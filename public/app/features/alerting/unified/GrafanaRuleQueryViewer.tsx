import * as stylex from '@stylexjs/stylex';
import { keyBy, startCase, uniqueId } from 'lodash';
import * as React from 'react';

import { type DataSourceInstanceSettings, type PanelData, urlUtil } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { type DataSourceRef } from '@grafana/schema';
import { Preview } from '@grafana/sql';
import { Alert, Badge, ErrorBoundaryAlert, LinkButton, Stack, Text } from '@grafana/ui';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
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
      <div {...stylex.props(expressionViewerStyles.maxWidthContainer)}>
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
      <div {...stylex.props(expressionViewerStyles.maxWidthContainer)}>
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
        <div {...stylex.props(queryPreviewStyles.queryPreviewWrapper)}>
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
    <div {...stylex.props(queryPreviewStyles.dataSource)} key="datasource">
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
      <div {...stylex.props(queryBoxStyles.previewWrapper)}>
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
    <div {...stylex.props(queryBoxStyles.container)}>
      <header {...stylex.props(queryBoxStyles.header)}>
        <span {...stylex.props(queryBoxStyles.refId)}>{refId}</span>
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

function ClassicConditionViewer({ model }: { model: ExpressionQuery }) {
  const reducerFunctions = keyBy(alertDef.reducerTypes, (rt) => rt.value);
  const evalOperators = keyBy(alertDef.evalOperators, (eo) => eo.value);
  const evalFunctions = keyBy(alertDef.evalFunctions, (ef) => ef.value);

  return (
    <div {...stylex.props(classicConditionViewerStyles.container)}>
      {model.conditions?.map(({ query, operator, reducer, evaluator }, index) => {
        const isRange = isRangeEvaluator(evaluator);

        return (
          <React.Fragment key={index}>
            <div {...stylex.props(commonQueryStyles.blue)}>
              {index === 0
                ? t('alerting.classic-condition-viewer.when', 'WHEN')
                : !!operator?.type && evalOperators[operator?.type]?.text}
            </div>
            <div {...stylex.props(commonQueryStyles.bold)}>{reducer?.type && reducerFunctions[reducer.type]?.text}</div>
            <div {...stylex.props(commonQueryStyles.blue)}>
              <Trans i18nKey="alerting.classic-condition-viewer.of">OF</Trans>
            </div>
            <div {...stylex.props(commonQueryStyles.bold)}>{query.params[0]}</div>
            <div {...stylex.props(commonQueryStyles.blue)}>{evalFunctions[evaluator.type].text}</div>
            <div {...stylex.props(commonQueryStyles.bold)}>
              {isRange ? `(${evaluator.params[0]}; ${evaluator.params[1]})` : evaluator.params[0]}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function ReduceConditionViewer({ model }: { model: ExpressionQuery }) {
  const { reducer, expression, settings } = model;
  const reducerType = reducerTypes.find((rt) => rt.value === reducer);

  const reducerMode = settings?.mode ?? ReducerMode.Strict;
  const modeName = reducerModes.find((rm) => rm.value === reducerMode);

  return (
    <div {...stylex.props(reduceConditionViewerStyles.container)}>
      <div {...stylex.props(commonQueryStyles.label)}>
        <Trans i18nKey="alerting.reduce-condition-viewer.function">Function</Trans>
      </div>
      <div {...stylex.props(commonQueryStyles.value)}>{reducerType?.label}</div>

      <div {...stylex.props(commonQueryStyles.label)}>
        <Trans i18nKey="alerting.reduce-condition-viewer.input">Input</Trans>
      </div>
      <div {...stylex.props(commonQueryStyles.value)}>{expression}</div>

      <div {...stylex.props(commonQueryStyles.label)}>
        <Trans i18nKey="alerting.reduce-condition-viewer.mode">Mode</Trans>
      </div>
      <div {...stylex.props(commonQueryStyles.value, reduceConditionViewerStyles.modeValue)}>{modeName?.label}</div>
    </div>
  );
}

function ResampleExpressionViewer({ model }: { model: ExpressionQuery }) {
  const { expression, window, downsampler, upsampler } = model;
  const downsamplerType = downsamplingTypes.find((dt) => dt.value === downsampler);
  const upsamplerType = upsamplingTypes.find((ut) => ut.value === upsampler);

  return (
    <div {...stylex.props(resampleExpressionViewerStyles.container)}>
      <div {...stylex.props(commonQueryStyles.label)}>
        <Trans i18nKey="alerting.resample-expression-viewer.input">Input</Trans>
      </div>
      <div {...stylex.props(commonQueryStyles.value)}>{expression}</div>

      <div {...stylex.props(commonQueryStyles.label)}>
        <Trans i18nKey="alerting.resample-expression-viewer.resample-to">Resample to</Trans>
      </div>
      <div {...stylex.props(commonQueryStyles.value)}>{window}</div>

      <div {...stylex.props(commonQueryStyles.label)}>
        <Trans i18nKey="alerting.resample-expression-viewer.downsample">Downsample</Trans>
      </div>
      <div {...stylex.props(commonQueryStyles.value)}>{downsamplerType?.label}</div>

      <div {...stylex.props(commonQueryStyles.label)}>
        <Trans i18nKey="alerting.resample-expression-viewer.upsample">Upsample</Trans>
      </div>
      <div {...stylex.props(commonQueryStyles.value)}>{upsamplerType?.label}</div>
    </div>
  );
}

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
      <div {...stylex.props(expressionViewerStyles.container)}>
        <div {...stylex.props(commonQueryStyles.label)}>
          <Trans i18nKey="alerting.threshold-expression-viewer.input">Input</Trans>
        </div>
        <div {...stylex.props(commonQueryStyles.value)}>{expression}</div>

        {evaluator && (
          <>
            <div {...stylex.props(commonQueryStyles.blue, expressionViewerStyles.blue)}>{thresholdFunction?.label}</div>
            <div {...stylex.props(commonQueryStyles.bold, expressionViewerStyles.bold)}>
              {isRange ? `(${evaluator.params[0]}; ${evaluator.params[1]})` : evaluator.params[0]}
            </div>
          </>
        )}
      </div>
      <div {...stylex.props(expressionViewerStyles.container)}>
        {unloadEvaluator && (
          <>
            <div {...stylex.props(commonQueryStyles.label)}>
              <Trans i18nKey="alerting.threshold-expression-viewer.stop-alerting-when">
                Stop alerting (or pending state) when{' '}
              </Trans>
            </div>
            <div {...stylex.props(commonQueryStyles.value)}>{expression}</div>

            <>
              <div {...stylex.props(commonQueryStyles.blue, expressionViewerStyles.blue)}>
                {unloadThresholdFunction?.label}
              </div>
              <div {...stylex.props(commonQueryStyles.bold, expressionViewerStyles.bold)}>
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
    <div {...stylex.props(expressionViewerStyles.container)}>
      <div {...stylex.props(commonQueryStyles.label)}>
        <Trans i18nKey="alerting.math-expression-viewer.input">Input</Trans>
      </div>
      <div {...stylex.props(commonQueryStyles.value)}>{expression}</div>
    </div>
  );
}

function isRangeEvaluator(evaluator: { params: number[]; type: EvalFunction }) {
  return (
    evaluator.type === EvalFunction.IsWithinRange ||
    evaluator.type === EvalFunction.IsOutsideRange ||
    evaluator.type === EvalFunction.IsOutsideRangeIncluded ||
    evaluator.type === EvalFunction.IsWithinRangeIncluded
  );
}

const queryPreviewStyles = stylex.create({
  queryPreviewWrapper: {
    margin: spacing['--gf-spacing-x1'],
  },
  dataSource: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    borderRadius: shape['--gf-shape-radius-default'],
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
  },
});

const queryBoxStyles = stylex.create({
  container: {
    flexGrow: '1',
    flexShrink: '0',
    flexBasis: '25%',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    maxWidth: '100%',
    borderRadius: shape['--gf-shape-radius-default'],
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    padding: spacing['--gf-spacing-x1'],
    backgroundColor: colors['--gf-colors-background-secondary'],
  },
  refId: {
    color: colors['--gf-colors-text-link'],
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    borderRadius: shape['--gf-shape-radius-default'],
  },
  previewWrapper: {
    padding: spacing['--gf-spacing-x1'],
  },
});

const classicConditionViewerStyles = stylex.create({
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, max-content)',
    rowGap: 0,
    columnGap: spacing['--gf-spacing-x1'],
  },
});

const reduceConditionViewerStyles = stylex.create({
  container: {
    display: 'grid',
    gap: spacing['--gf-spacing-x0-5'],
    gridTemplateRows: '1fr 1fr',
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
  modeValue: {
    gridColumn: 'span 3',
  },
});

const resampleExpressionViewerStyles = stylex.create({
  container: {
    display: 'grid',
    gap: spacing['--gf-spacing-x0-5'],
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateRows: '1fr 1fr',
  },
});

const expressionViewerStyles = stylex.create({
  maxWidthContainer: {
    maxWidth: '100%',
  },
  container: {
    display: 'flex',
    gap: spacing['--gf-spacing-x0-5'],
  },
  blue: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 0,
    marginRight: 0,
  },
  bold: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 0,
    marginRight: 0,
  },
});

const commonQueryStyles = stylex.create({
  blue: {
    color: colors['--gf-colors-text-link'],
  },
  bold: {
    fontWeight: typography['--gf-typography-font-weight-bold'],
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    lineHeight: typography['--gf-typography-body-small-line-height'],
    fontWeight: typography['--gf-typography-font-weight-bold'],
    borderRadius: shape['--gf-shape-radius-default'],
  },
  value: {
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    borderRadius: shape['--gf-shape-radius-default'],
  },
});
