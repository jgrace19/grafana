import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { ruleConfigStatusStyles } from './RuleConfigStatus.stylex';
import { useMemo } from 'react';

import { Trans } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { Icon, Tooltip } from '@grafana/ui';

import { type CombinedRule } from '../../../../../types/unified-alerting';
import { checkEvaluationIntervalGlobalLimit } from '../../utils/config';
import { rulerRuleType } from '../../utils/rules';

interface RuleConfigStatusProps {
  rule: CombinedRule;
}

export function RuleConfigStatus({ rule }: RuleConfigStatusProps) {
  const isGrafanaManagedRule = rulerRuleType.grafana.rule(rule.rulerRule);

  const exceedsLimit = useMemo(() => {
    return isGrafanaManagedRule ? checkEvaluationIntervalGlobalLimit(rule.group.interval).exceedsLimit : false;
  }, [rule.group.interval, isGrafanaManagedRule]);

  if (!exceedsLimit) {
    return null;
  }

  return (
    <Tooltip
      theme="error"
      content={
        <div>
          <Trans
            i18nKey="alerting.rule-config-status.tooltip-min-interval"
            values={{ minInterval: config.unifiedAlerting.minInterval, ruleInterval: rule.group.interval }}
          >
            A minimum evaluation interval of <span {...stylex.props(ruleConfigStatusStyles.globalLimitValue)}>{'{{minInterval}}'}</span> has
            been configured in Grafana and will be used instead of the {'{{ruleInterval}}'} interval configured for the
            Rule Group.
          </Trans>
        </div>
      }
    >
      <Icon name="stopwatch-slash" {...stylex.props(ruleConfigStatusStyles.icon)} />
    </Tooltip>
  );
}

