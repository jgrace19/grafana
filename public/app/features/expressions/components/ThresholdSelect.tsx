import { type SelectableValue } from '@grafana/data';
import { ButtonSelect } from '@grafana/ui';
import { type EvalFunction } from 'app/features/alerting/state/alertDef';

import { thresholdFunctions } from '../types';

import './ThresholdSelect.css';

export interface ThresholdSelectProps {
  onChange: (value: SelectableValue<EvalFunction>) => void;
  value: SelectableValue<EvalFunction> | undefined;
}
export function ThresholdSelect({ onChange, value }: ThresholdSelectProps) {
  return (
    <ButtonSelect className="gf-threshold-select" options={thresholdFunctions} onChange={onChange} value={value} />
  );
}
