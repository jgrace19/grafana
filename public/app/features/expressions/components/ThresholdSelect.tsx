// eslint-disable-next-line no-restricted-imports -- stylex: pending child migration, see the override below
import { css } from '@emotion/css';


import { type SelectableValue } from '@grafana/data';
import { ButtonSelect } from '@grafana/ui';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
import { type EvalFunction } from 'app/features/alerting/state/alertDef';

import { thresholdFunctions } from '../types';

export interface ThresholdSelectProps {
  onChange: (value: SelectableValue<EvalFunction>) => void;
  value: SelectableValue<EvalFunction> | undefined;
}
export function ThresholdSelect({ onChange, value }: ThresholdSelectProps) {
  return (
    <ButtonSelect
      className={buttonSelectTextClassName}
      options={thresholdFunctions}
      onChange={onChange}
      value={value}
    />
  );
}

// stylex: pending ToolbarButton migration: ButtonSelect's own color, font size and padding would beat a StyleX className
const buttonSelectTextClassName = css({
  color: colors['--gf-colors-primary-text'],
  fontSize: typography['--gf-typography-body-small-font-size'],
  padding: `0 ${spacing['--gf-spacing-x1']}`,
});
