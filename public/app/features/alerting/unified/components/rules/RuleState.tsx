import * as stylex from '@stylexjs/stylex';
import { useMemo } from 'react';

import { intervalToAbbreviatedDurationString } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { Icon, Spinner, Stack, Tooltip } from '@grafana/ui';
import { colors, typography } from '@grafana/ui/stylex/tokens.stylex';
import { type CombinedRule } from 'app/types/unified-alerting';
import { PromAlertingRuleState } from 'app/types/unified-alerting-dto';

import { getFirstActiveAt, prometheusRuleType, rulerRuleType } from '../../utils/rules';
import { StateTag } from '../StateTag';

import { AlertStateTag } from './AlertStateTag';

interface Props {
  rule: CombinedRule;
  isDeleting: boolean;
  isCreating: boolean;
  isPaused?: boolean;
}

export const RuleState = ({ rule, isDeleting, isCreating, isPaused }: Props) => {
  const { promRule, rulerRule } = rule;
  // return how long the rule has been in its firing state, if any
  const RecordingRuleState = () => {
    if (isPaused && rulerRuleType.grafana.recordingRule(rulerRule)) {
      return (
        <Tooltip
          content={t(
            'alerting.rule-state.recording-rule-state.content-recording-rule-evaluation-is-currently-paused',
            'Recording rule evaluation is currently paused'
          )}
          placement="top"
        >
          <StateTag state="warning">
            <Icon name="pause" size="xs" />
            <Trans i18nKey="alerting.rule-state.paused">Paused</Trans>
          </StateTag>
        </Tooltip>
      );
    } else {
      return <Trans i18nKey="alerting.rule-state.recording-rule">Recording rule</Trans>;
    }
  };
  const forTime = useMemo(() => {
    if (
      prometheusRuleType.alertingRule(promRule) &&
      promRule.alerts?.length &&
      promRule.state !== PromAlertingRuleState.Inactive
    ) {
      // find earliest alert
      const firstActiveAt = promRule.activeAt ? new Date(promRule.activeAt) : getFirstActiveAt(promRule);

      // calculate time elapsed from earliest alert
      if (firstActiveAt) {
        return (
          <span title={String(firstActiveAt)} {...stylex.props(styles.for)}>
            <Trans
              i18nKey="alerting.rule-state.for"
              values={{
                duration: intervalToAbbreviatedDurationString(
                  {
                    start: firstActiveAt,
                    end: new Date(),
                  },
                  false
                ),
              }}
            >
              for {'{{duration}}'}
            </Trans>{' '}
          </span>
        );
      }
    }
    return null;
  }, [promRule]);

  if (isDeleting) {
    return (
      <Stack gap={1}>
        <Spinner />
        <Trans i18nKey="alerting.rule-state.deleting">Deleting</Trans>
      </Stack>
    );
  } else if (isCreating) {
    return (
      <Stack gap={1}>
        <Spinner />
        <Trans i18nKey="alerting.rule-state.creating">Creating</Trans>
      </Stack>
    );
  } else if (prometheusRuleType.alertingRule(promRule)) {
    return (
      <Stack gap={1}>
        <AlertStateTag state={promRule.state} isPaused={isPaused} />
        {!isPaused && forTime}
      </Stack>
    );
  } else if (promRule && prometheusRuleType.recordingRule(promRule)) {
    return <RecordingRuleState />;
  }
  return <Trans i18nKey="alerting.rule-state.na">n/a</Trans>;
};

const styles = stylex.create({
  for: {
    fontSize: typography['--gf-typography-body-small-font-size'],
    color: colors['--gf-colors-text-secondary'],
    whiteSpace: 'nowrap',
    paddingTop: '2px',
  },
});
