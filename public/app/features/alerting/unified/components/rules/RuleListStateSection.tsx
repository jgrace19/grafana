import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import { type CombinedRule } from 'app/types/unified-alerting';
import { type PromAlertingRuleState } from 'app/types/unified-alerting-dto';

import { alertStateToReadable } from '../../utils/rules';
import { CollapseToggle } from '../CollapseToggle';

import { RulesTable } from './RulesTable';

interface Props {
  rules: CombinedRule[];
  state: PromAlertingRuleState;
  defaultCollapsed?: boolean;
}

export const RuleListStateSection = ({ rules, state, defaultCollapsed = false }: Props) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  return (
    <>
      <h4 {...stylex.props(styles.header)}>
        <CollapseToggle size="xxl" isCollapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        {alertStateToReadable(state)} ({rules.length})
      </h4>
      {!collapsed && <RulesTable xstyle={styles.rulesTable} rules={rules} showGroupColumn={true} />}
    </>
  );
};

const styles = stylex.create({
  header: {
    marginTop: spacing['--gf-spacing-x2'],
  },
  rulesTable: {
    marginTop: spacing['--gf-spacing-x3'],
  },
});
