
import { ButtonSelect, } from '@grafana/ui';
import { type EvalFunction } from 'app/features/alerting/state/alertDef';

import { thresholdFunctions } from '../types';

export interface ThresholdSelectProps {
  onChange: (value: SelectableValue<EvalFunction>) => void;
  value: SelectableValue<EvalFunction> | undefined;
}
export function ThresholdSelect({ onChange, value }: ThresholdSelectProps) {
  const styles = (getStyles);
  return (
    <ButtonSelect {...stylex.props(thresholdSelectStyles.buttonSelectText)} options={thresholdFunctions} onChange={onChange} value={value} />
  );
}

