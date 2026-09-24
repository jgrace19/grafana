// eslint-disable-next-line no-restricted-imports -- stylex: Pagination has no xstyle or style prop
import { css } from '@emotion/css';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { useEffect, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';

import { t } from '@grafana/i18n';
import { Pagination, Tooltip } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { type CombinedRule, type RulesSource } from 'app/types/unified-alerting';

import { DEFAULT_PER_PAGE_PAGINATION } from '../../../../../core/constants';
import { alertRuleApi } from '../../api/alertRuleApi';
import { featureDiscoveryApi } from '../../api/featureDiscoveryApi';
import { shouldUsePrometheusRulesPrimary } from '../../featureToggles';
import { useAsync } from '../../hooks/useAsync';
import { attachRulerRuleToCombinedRule } from '../../hooks/useCombinedRuleNamespaces';
import { useHasRuler } from '../../hooks/useHasRuler';
import { usePagination } from '../../hooks/usePagination';
import { useUnifiedAlertingSelector } from '../../hooks/useUnifiedAlertingSelector';
import { PluginOriginBadge } from '../../plugins/PluginOriginBadge';
import { calculateNextEvaluationEstimate } from '../../rule-list/components/util';
import { Annotation } from '../../utils/constants';
import { GRAFANA_RULES_SOURCE_NAME, getRulesSourceName } from '../../utils/datasource';
import { getRulePluginOrigin, isPausedRule, rulerRuleType } from '../../utils/rules';
import { DynamicTable, type DynamicTableColumnProps, type DynamicTableItemProps } from '../DynamicTable';
import { DynamicTableWithGuidelines } from '../DynamicTableWithGuidelines';
import { ProvisioningBadge } from '../Provisioning';
import { RuleLocation } from '../RuleLocation';
import { Tokenize } from '../Tokenize';

import { RuleActionsButtons } from './RuleActionsButtons';
import { RuleConfigStatus } from './RuleConfigStatus';
import { RuleDetails } from './RuleDetails';
import { RuleHealth } from './RuleHealth';
import { RuleState } from './RuleState';

type RuleTableColumnProps = DynamicTableColumnProps<CombinedRule>;
type RuleTableItemProps = DynamicTableItemProps<CombinedRule>;

interface Props {
  rules: CombinedRule[];
  showGuidelines?: boolean;
  showGroupColumn?: boolean;
  showSummaryColumn?: boolean;
  showNextEvaluationColumn?: boolean;
  emptyMessage?: string;
  className?: string;
  /** first-party StyleX overrides */
  xstyle?: StyleXStyles;
}

const prometheusRulesPrimary = shouldUsePrometheusRulesPrimary();

const { useLazyGetRuleGroupForNamespaceQuery } = alertRuleApi;
const { useLazyDiscoverDsFeaturesQuery } = featureDiscoveryApi;

export const RulesTable = ({
  rules,
  className,
  xstyle,
  showGuidelines = false,
  emptyMessage = 'No rules found.',
  showGroupColumn = false,
  showSummaryColumn = false,
  showNextEvaluationColumn = false,
}: Props) => {
  const wrapperStyles = [styles.wrapper, xstyle, showGuidelines && styles.wrapperMargin];

  const { pageItems, page, numberOfPages, onPageChange } = usePagination(rules, 1, DEFAULT_PER_PAGE_PAGINATION);

  const { result: rulesWithRulerDefinitions, status: rulerRulesLoadingStatus } = useLazyLoadRulerRules(pageItems);

  const isLoadingRulerGroup = rulerRulesLoadingStatus === 'loading';

  const items = useMemo((): RuleTableItemProps[] => {
    return rulesWithRulerDefinitions.map((rule, ruleIdx) => {
      return {
        id: `${rule.namespace.name}-${rule.group.name}-${rule.name}-${ruleIdx}`,
        data: rule,
      };
    });
  }, [rulesWithRulerDefinitions]);

  const columns = useColumns(showSummaryColumn, showGroupColumn, showNextEvaluationColumn, isLoadingRulerGroup);

  if (!pageItems.length) {
    return (
      <div {...mergeStylexProps(stylex.props(wrapperStyles, styles.emptyMessage), { className })}>{emptyMessage}</div>
    );
  }

  const TableComponent = showGuidelines ? DynamicTableWithGuidelines : DynamicTable;

  return (
    <div {...mergeStylexProps(stylex.props(wrapperStyles), { className })} data-testid="rules-table">
      <TableComponent
        cols={columns}
        isExpandable={true}
        items={items}
        renderExpandedContent={({ data: rule }) => <RuleDetails rule={rule} />}
      />
      <Pagination
        currentPage={page}
        numberOfPages={numberOfPages}
        onNavigate={onPageChange}
        hideWhenSinglePage
        className={pendingEmotionStyles.pagination}
      />
    </div>
  );
};

/**
 * This hook is used to lazy load the Ruler rule for each rule.
 * If the `prometheusRulesPrimary` feature flag is enabled, the hook will fetch the Ruler rule counterpart for each Prometheus rule.
 * If the `prometheusRulesPrimary` feature flag is disabled, the hook will return the rules as is.
 * @param rules Combined rules with or without Ruler rule property
 * @returns Combined rules enriched with Ruler rule property
 */
function useLazyLoadRulerRules(rules: CombinedRule[]) {
  const [fetchRulerRuleGroup] = useLazyGetRuleGroupForNamespaceQuery();
  const [fetchDsFeatures] = useLazyDiscoverDsFeaturesQuery();

  const [actions, state] = useAsync(async () => {
    const result = Promise.all(
      rules.map(async (rule) => {
        const dsFeatures = await fetchDsFeatures(
          { rulesSourceName: getRulesSourceName(rule.namespace.rulesSource) },
          true
        ).unwrap();

        // Due to lack of ruleUid and folderUid in Prometheus rules we cannot do the lazy load for GMA
        if (dsFeatures.rulerConfig && rule.namespace.rulesSource !== GRAFANA_RULES_SOURCE_NAME) {
          // RTK Query should handle caching and deduplication for us
          const rulerRuleGroup = await fetchRulerRuleGroup(
            {
              namespace: rule.namespace.name,
              group: rule.group.name,
              rulerConfig: dsFeatures.rulerConfig,
            },
            true
          ).unwrap();

          attachRulerRuleToCombinedRule(rule, rulerRuleGroup);
        }

        return rule;
      })
    );
    return result;
  }, rules);

  useEffect(() => {
    if (prometheusRulesPrimary) {
      actions.execute();
    } else {
      // We need to reset the actions to update the rules if they changed
      // Otherwise useAsync acts like a cache and always return the first rules passed to it
      actions.reset();
    }
  }, [rules, actions]);

  return state;
}

// stylex: Pagination has no xstyle or style prop, and only an unlayered class beats its float.
const pendingEmotionStyles = {
  pagination: css({
    display: 'flex',
    margin: 0,
    paddingTop: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0-25'],
    justifyContent: 'center',
    borderLeft: `1px solid ${colors['--gf-colors-border-medium']}`,
    borderRight: `1px solid ${colors['--gf-colors-border-medium']}`,
    borderBottom: `1px solid ${colors['--gf-colors-border-medium']}`,
    float: 'none',
  }),
};

const styles = stylex.create({
  wrapperMargin: {
    marginLeft: { default: null, [bp.mdUp]: '36px' },
  },
  emptyMessage: {
    padding: spacing['--gf-spacing-x1'],
  },
  wrapper: {
    width: 'auto',
    borderRadius: shape['--gf-shape-radius-default'],
  },
  skeletonWrapper: {
    flex: '1',
  },
});

function useColumns(
  showSummaryColumn: boolean,
  showGroupColumn: boolean,
  showNextEvaluationColumn: boolean,
  isRulerLoading: boolean
) {
  return useMemo((): RuleTableColumnProps[] => {
    const columns: RuleTableColumnProps[] = [
      {
        id: 'state',
        label: t('alerting.use-columns.columns.label.state', 'State'),
        renderCell: ({ data: rule }) => <RuleStateCell rule={rule} />,
        size: '165px',
      },
      {
        id: 'name',
        label: t('alerting.use-columns.columns.label.name', 'Name'),
        // eslint-disable-next-line react/display-name
        renderCell: ({ data: rule }) => rule.name,
        size: showNextEvaluationColumn ? 4 : 5,
      },
      {
        id: 'metadata',
        label: '',
        // eslint-disable-next-line react/display-name
        renderCell: ({ data: rule }) => {
          const { promRule, rulerRule } = rule;

          const originMeta = getRulePluginOrigin(promRule ?? rulerRule);
          if (originMeta) {
            return <PluginOriginBadge pluginId={originMeta.pluginId} />;
          }

          const isGrafanaManagedRule = rulerRuleType.grafana.rule(rulerRule);
          if (!isGrafanaManagedRule) {
            return null;
          }

          const provenance = rulerRule.grafana_alert.provenance;
          return provenance ? <ProvisioningBadge /> : null;
        },
        size: '100px',
      },
      {
        id: 'warnings',
        label: '',
        renderCell: ({ data: combinedRule }) => <RuleConfigStatus rule={combinedRule} />,
        size: '45px',
      },
      {
        id: 'health',
        label: t('alerting.use-columns.columns.label.health', 'Health'),
        // eslint-disable-next-line react/display-name
        renderCell: ({ data: { promRule, group } }) => (promRule ? <RuleHealth rule={promRule} /> : null),
        size: '75px',
      },
    ];
    if (showSummaryColumn) {
      columns.push({
        id: 'summary',
        label: t('alerting.use-columns.label.summary', 'Summary'),
        // eslint-disable-next-line react/display-name
        renderCell: ({ data: rule }) => {
          return <Tokenize input={rule.annotations[Annotation.summary] ?? ''} />;
        },
        size: showNextEvaluationColumn ? 4 : 5,
      });
    }

    if (showNextEvaluationColumn) {
      columns.push({
        id: 'nextEvaluation',
        label: t('alerting.use-columns.label.next-evaluation', 'Next evaluation'),
        renderCell: ({ data: rule }) => {
          const nextEvalInfo = calculateNextEvaluationEstimate(rule.promRule?.lastEvaluation, rule.group.interval);

          return (
            nextEvalInfo && (
              <Tooltip
                placement="top"
                // eslint-disable-next-line @grafana/i18n/no-untranslated-strings
                content={`${nextEvalInfo?.fullDate}`}
                theme="info"
              >
                <span>{nextEvalInfo?.humanized}</span>
              </Tooltip>
            )
          );
        },
        size: 2,
      });
    }

    if (showGroupColumn) {
      columns.push({
        id: 'group',
        label: t('alerting.use-columns.label.group', 'Group'),
        // eslint-disable-next-line react/display-name
        renderCell: ({ data: rule }) => {
          const { namespace, group } = rule;
          // ungrouped rules are rules that are in the "default" group name
          const isUngrouped = group.name === 'default';
          const groupName = isUngrouped ? (
            <RuleLocation namespace={namespace.name} />
          ) : (
            <RuleLocation namespace={namespace.name} group={group.name} />
          );

          return groupName;
        },
        size: 5,
      });
    }
    columns.push({
      id: 'actions',
      label: t('alerting.use-columns.label.actions', 'Actions'),
      // eslint-disable-next-line react/display-name
      renderCell: ({ data: rule }) => <RuleActionsCell rule={rule} isLoadingRuler={isRulerLoading} />,
      size: '215px',
    });

    return columns;
  }, [showNextEvaluationColumn, showSummaryColumn, showGroupColumn, isRulerLoading]);
}

function RuleStateCell({ rule }: { rule: CombinedRule }) {
  const { isDeleting, isCreating, isPaused } = useRuleStatus(rule);
  return <RuleState rule={rule} isDeleting={isDeleting} isCreating={isCreating} isPaused={isPaused} />;
}

function RuleActionsCell({ rule, isLoadingRuler }: { rule: CombinedRule; isLoadingRuler: boolean }) {
  const { isDeleting, isCreating } = useRuleStatus(rule);

  if (isLoadingRuler) {
    return <Skeleton containerClassName={stylex.props(styles.skeletonWrapper).className} />;
  }

  return (
    <RuleActionsButtons
      compact
      showViewButton={!isDeleting && !isCreating}
      rule={rule}
      rulesSource={rule.namespace.rulesSource}
    />
  );
}

export function useIsRulesLoading(rulesSource: RulesSource) {
  const rulerRules = useUnifiedAlertingSelector((state) => state.rulerRules);
  const rulesSourceName = getRulesSourceName(rulesSource);

  const rulerRulesLoaded = Boolean(rulerRules[rulesSourceName]?.result);
  return rulerRulesLoaded;
}

function useRuleStatus(rule: CombinedRule) {
  const rulesSource = rule.namespace.rulesSource;

  const rulerRulesLoaded = useIsRulesLoading(rulesSource);
  const { hasRuler } = useHasRuler(rulesSource);

  const { promRule, rulerRule } = rule;

  // If prometheusRulesPrimary is enabled, we don't fetch rules from the Ruler API (except for Grafana managed rules)
  // so there is no way to detect statuses
  if (prometheusRulesPrimary && !rulerRuleType.grafana.rule(rulerRule)) {
    return { isDeleting: false, isCreating: false, isPaused: false };
  }

  const isDeleting = Boolean(hasRuler && rulerRulesLoaded && promRule && !rulerRule);
  const isCreating = Boolean(hasRuler && rulerRulesLoaded && rulerRule && !promRule);
  const isPaused = rulerRuleType.grafana.rule(rulerRule) && isPausedRule(rulerRule);

  return { isDeleting, isCreating, isPaused };
}
