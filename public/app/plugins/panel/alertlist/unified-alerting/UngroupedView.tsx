import * as stylex from '@stylexjs/stylex';
import { useLocation } from 'react-use';

import { intervalToAbbreviatedDurationString } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { Icon, Stack } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';
import alertDef from 'app/features/alerting/state/alertDef';
import { Spacer } from 'app/features/alerting/unified/components/Spacer';
import { fromCombinedRule, stringifyIdentifier } from 'app/features/alerting/unified/utils/rule-id';
import {
  alertStateToReadable,
  alertStateToState,
  getFirstActiveAt,
  prometheusRuleType,
} from 'app/features/alerting/unified/utils/rules';
import { createRelativeUrl } from 'app/features/alerting/unified/utils/url';
import { PromAlertingRuleState } from 'app/types/unified-alerting-dto';

import { GRAFANA_RULES_SOURCE_NAME } from '../../../../features/alerting/unified/utils/datasource';
import { type AlertInstanceTotalState, type CombinedRuleWithLocation } from '../../../../types/unified-alerting';
import { AlertInstances } from '../AlertInstances';
import { styles } from '../UnifiedAlertList';
import { type UnifiedAlertListOptions } from '../types';

type Props = {
  rules: CombinedRuleWithLocation[];
  options: UnifiedAlertListOptions;
  handleInstancesLimit?: (limit: boolean) => void;
  limitInstances: boolean;
  hideViewRuleLinkText?: boolean;
};

function getGrafanaInstancesTotal(totals: Partial<Record<AlertInstanceTotalState, number>>) {
  return Object.values(totals)
    .filter((total) => total !== undefined)
    .reduce((total, currentTotal) => total + currentTotal, 0);
}

const UngroupedModeView = ({ rules, options, handleInstancesLimit, limitInstances, hideViewRuleLinkText }: Props) => {
  const { href: returnTo } = useLocation();

  const rulesToDisplay = rules.length <= options.maxItems ? rules : rules.slice(0, options.maxItems);

  return (
    <>
      <ol {...stylex.props(styles.alertRuleList)}>
        {rulesToDisplay.map((ruleWithLocation, index) => {
          const { namespaceName, groupName, dataSourceName } = ruleWithLocation;
          const alertingRule = prometheusRuleType.alertingRule(ruleWithLocation.promRule)
            ? ruleWithLocation.promRule
            : undefined;
          const firstActiveAt = getFirstActiveAt(alertingRule);
          const indentifier = fromCombinedRule(ruleWithLocation.dataSourceName, ruleWithLocation);
          const strIndentifier = stringifyIdentifier(indentifier);

          const grafanaInstancesTotal =
            ruleWithLocation.dataSourceName === GRAFANA_RULES_SOURCE_NAME
              ? getGrafanaInstancesTotal(ruleWithLocation.instanceTotals)
              : undefined;
          const grafanaFilteredInstancesTotal =
            ruleWithLocation.dataSourceName === GRAFANA_RULES_SOURCE_NAME
              ? getGrafanaInstancesTotal(ruleWithLocation.filteredInstanceTotals)
              : undefined;

          const href = createRelativeUrl(
            `/alerting/${encodeURIComponent(dataSourceName)}/${encodeURIComponent(strIndentifier)}/view`,
            { returnTo: returnTo ?? '' }
          );
          if (alertingRule) {
            return (
              <li
                {...stylex.props(styles.alertRuleItem)}
                key={`alert-${namespaceName}-${groupName}-${ruleWithLocation.name}-${index}`}
              >
                <div {...stylex.props(stateTagStyles.icon)}>
                  <Icon
                    name={alertDef.getStateDisplayModel(alertingRule.state).iconClass}
                    xstyle={stateTagStyles[alertStateToState(alertingRule.state)]}
                    size={'lg'}
                  />
                </div>
                <div {...stylex.props(styles.alertNameWrapper)}>
                  <div {...stylex.props(styles.instanceDetails)}>
                    <Stack direction="row" gap={1}>
                      <div {...stylex.props(styles.alertName)} title={ruleWithLocation.name}>
                        {ruleWithLocation.name}
                      </div>
                      <Spacer />
                      {href && (
                        <a
                          href={href}
                          target="__blank"
                          {...stylex.props(styles.link)}
                          rel="noopener"
                          aria-label={t('alertlist.ungrouped-mode-view.aria-label-view-alert-rule', 'View alert rule')}
                        >
                          <span {...stylex.props(hideViewRuleLinkText && styles.hidden)}>
                            <Trans i18nKey="alertlist.ungrouped-mode-view.view-alert-rule">View alert rule</Trans>
                          </span>
                          <Icon name={'external-link-alt'} size="sm" />
                        </a>
                      )}
                    </Stack>
                    <div {...stylex.props(styles.alertDuration)}>
                      <span {...stylex.props(stateTagStyles[alertStateToState(alertingRule.state)])}>
                        {alertStateToReadable(alertingRule.state)}
                      </span>{' '}
                      {firstActiveAt && alertingRule.state !== PromAlertingRuleState.Inactive && (
                        <Trans
                          i18nKey="alertlist.ungrouped-mode-view.active-for"
                          values={{
                            duration: intervalToAbbreviatedDurationString({ start: firstActiveAt, end: Date.now() }),
                          }}
                        >
                          for <span>{'{{duration}}'}</span>
                        </Trans>
                      )}
                    </div>
                  </div>
                  <AlertInstances
                    rule={ruleWithLocation}
                    alerts={alertingRule.alerts ?? []}
                    options={options}
                    grafanaTotalInstances={grafanaInstancesTotal}
                    grafanaFilteredInstancesTotal={grafanaFilteredInstancesTotal}
                    handleInstancesLimit={handleInstancesLimit}
                    limitInstances={limitInstances}
                  />
                </div>
              </li>
            );
          } else {
            return null;
          }
        })}
      </ol>
    </>
  );
};

const stateTagStyles = stylex.create({
  icon: {
    marginTop: spacing['--gf-spacing-x2-5'],
    alignSelf: 'flex-start',
  },
  good: {
    color: colors['--gf-colors-success-main'],
  },
  bad: {
    color: colors['--gf-colors-error-main'],
  },
  warning: {
    color: colors['--gf-colors-warning-main'],
  },
  neutral: {
    color: colors['--gf-colors-secondary-main'],
  },
  info: {
    color: colors['--gf-colors-primary-main'],
  },
});

export default UngroupedModeView;
