import * as stylex from '@stylexjs/stylex';
import { useFormContext } from 'react-hook-form';

import { Badge } from '@grafana/ui';
import { colors } from '@grafana/ui/stylex/tokens.stylex';

import { type RuleFormValues } from '../../types/rule-form';
import { isGrafanaRecordingRuleByType } from '../../utils/rules';

interface AlertConditionProps {
  isCondition?: boolean;
  onSetCondition?: () => void;
  refId?: string;
}

export const ExpressionStatusIndicator = ({ isCondition, onSetCondition, refId }: AlertConditionProps) => {
  const { watch } = useFormContext<RuleFormValues>();
  const type = watch('type');
  const isGrafanaRecordingRule = type ? isGrafanaRecordingRuleByType(type) : false;
  const conditionText = isGrafanaRecordingRule ? 'Recording rule output' : 'Alert condition';

  const setAsConditionText = refId ? `Set "${refId}" as alert condition` : 'Set as alert condition';
  const makeConditionText = isGrafanaRecordingRule ? 'Set as recording rule output' : setAsConditionText;

  if (isCondition) {
    return <Badge key="condition" color="green" icon="check" text={conditionText} />;
  } else {
    return (
      <button
        key="make-condition"
        type="button"
        {...stylex.props(styles.actionLink)}
        onClick={() => onSetCondition && onSetCondition()}
      >
        {makeConditionText}
      </button>
    );
  }
};

const styles = stylex.create({
  actionLink: {
    backgroundColor: 'transparent',
    borderStyle: 'none',
    padding: 0,
    color: colors['--gf-colors-text-link'],
    cursor: 'pointer',
    textDecorationLine: { default: null, ':hover': 'underline' },
  },
});
