import * as stylex from '@stylexjs/stylex';
import { expressionStatusIndicatorStyles } from './ExpressionStatusIndicator.stylex';
import { useFormContext } from 'react-hook-form';

import { Badge, clearButtonStyles } from '@grafana/ui';

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
        {...stylex.props(formStyles.actionLink)}
        onClick={() => onSetCondition && onSetCondition()}
      >
        {makeConditionText}
      </button>
    );
  }
};

