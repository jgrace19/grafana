import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { ruleListStateSectionStyles } from './RuleListStateSection.stylex';
import { useState } from 'react';

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
      <h4 {...stylex.props(ruleListStateSectionStyles.header)}>
        <CollapseToggle
          {...stylex.props(ruleListStateSectionStyles.collapseToggle)}
          size="xxl"
          isCollapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
        {alertStateToReadable(state)} ({rules.length})
      </h4>
      {!collapsed && <RulesTable {...stylex.props(ruleListStateSectionStyles.rulesTable)} rules={rules} showGroupColumn={true} />}
    </>
  );
};

