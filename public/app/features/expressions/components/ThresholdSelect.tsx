import * as stylex from '@stylexjs/stylex';

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
  return <ButtonSelect xstyle={styles.select} options={thresholdFunctions} onChange={onChange} value={value} />;
}

const styles = stylex.create({
  // Over ButtonSelect's ToolbarButton, whose own :hover colours still win.
  select: {
    color: {
      default: colors['--gf-colors-primary-text'],
      ':hover': { default: colors['--gf-colors-text-primary'], ':disabled': colors['--gf-colors-text-disabled'] },
    },
    fontSize: typography['--gf-typography-body-small-font-size'],
    textTransform: 'uppercase',
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x1'],
  },
});
