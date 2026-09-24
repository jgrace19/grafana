import * as stylex from '@stylexjs/stylex';
import type { JSX } from 'react';

import { t } from '@grafana/i18n';
import { type CombinedRule, type RulesSource } from 'app/types/unified-alerting';

import { isCloudRulesSource } from '../../utils/datasource';
import { DetailsField } from '../DetailsField';
import { Expression } from '../Expression';

type Props = {
  rule: CombinedRule;
  rulesSource: RulesSource;
  annotations: Array<[string, string]>;
};

export function RuleDetailsExpression(props: Props): JSX.Element | null {
  const { annotations, rulesSource, rule } = props;

  if (!isCloudRulesSource(rulesSource)) {
    return null;
  }

  return (
    <DetailsField
      label={t('alerting.rule-details-expression.label-expression', 'Expression')}
      horizontal={true}
      xstyle={!!annotations.length && styles.exprRow}
    >
      <Expression expression={rule.query} rulesSource={rulesSource} />
    </DetailsField>
  );
}

const styles = stylex.create({
  exprRow: {
    marginBottom: '46px',
  },
});
