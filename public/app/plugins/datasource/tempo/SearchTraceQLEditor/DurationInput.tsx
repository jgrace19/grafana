import * as stylex from '@stylexjs/stylex';
import { durationInputStyles } from './DurationInput.stylex';

import { Select, Stack, Input } from '@grafana/ui';

import { type TraceqlFilter } from '../dataquery.gen';

import { operatorSelectableValue } from './utils';

interface Props {
  filter: TraceqlFilter;
  updateFilter: (f: TraceqlFilter) => void;
  isTagsLoading?: boolean;
  operators: string[];
}

// Support template variables (e.g., `$dur`, `$v_1`) and durations (e.g., `300µs`, `1.2ms`)
const validationRegex = /^(\$\w+)|(\d+(?:\.\d)?\d*(?:us|µs|ns|ms|s|m|h))$/;


const DurationInput = ({ filter, operators, updateFilter }: Props) => {

  let invalid = false;
  if (typeof filter.value === 'string') {
    invalid = filter.value ? !validationRegex.test(filter.value.concat('')) : false;
  }

  return (
    <Stack gap={0}>
      <Select
        {...stylex.props(durationInputStyles.noBoxShadow)}
        inputId={`${filter.id}-operator`}
        options={operators.map(operatorSelectableValue)}
        value={filter.operator}
        onChange={(v) => {
          updateFilter({ ...filter, operator: v?.value });
        }}
        isClearable={false}
        aria-label={`select ${filter.id} operator`}
        allowCustomValue={true}
        width={8}
      />
      <Input
        {...stylex.props(durationInputStyles.noBoxShadow)}
        value={filter.value}
        onChange={(v) => {
          updateFilter({ ...filter, value: v.currentTarget.value });
        }}
        placeholder="e.g. 100ms, 1.2s"
        aria-label={`select ${filter.id} value`}
        invalid={invalid}
        width={18}
      />
    </Stack>
  );
};

export default DurationInput;
