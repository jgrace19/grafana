import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';
import { Icon, Tooltip } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { type Rule } from 'app/types/unified-alerting';

import { isErrorHealth } from '../rule-viewer/RuleViewer';

interface Prom {
  rule: Rule;
}

export const RuleHealth = ({ rule }: Prom) => {
  if (isErrorHealth(rule.health)) {
    return (
      <Tooltip theme="error" content={rule.lastError || 'No error message provided.'}>
        <div {...stylex.props(styles.warn)}>
          <Icon name="exclamation-triangle" />
          <span>
            <Trans i18nKey="alerting.rule-health.error">error</Trans>
          </span>
        </div>
      </Tooltip>
    );
  }

  return <>{rule.health}</>;
};

const styles = stylex.create({
  warn: {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    color: colors['--gf-colors-warning-text'],
  },
});
