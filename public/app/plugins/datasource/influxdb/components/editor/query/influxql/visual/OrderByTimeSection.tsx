import type { JSX } from 'react';

import { type SelectableValue } from '@grafana/data';
import { Select } from '@grafana/ui';

import { unwrap } from '../utils/unwrap';

import { selectStyles } from './styles';

type Mode = 'ASC' | 'DESC';

const OPTIONS: Array<SelectableValue<Mode>> = [
  { label: 'ascending', value: 'ASC' },
  { label: 'descending', value: 'DESC' },
];

type Props = {
  value: Mode;
  onChange: (value: Mode) => void;
  inputId?: string;
};

export const OrderByTimeSection = ({ value, onChange, inputId }: Props): JSX.Element => {
  return (
    <>
      <Select<Mode>
        inputId={inputId}
        className="width-9"
        xstyle={selectStyles.paddingRight}
        onChange={(v) => {
          onChange(unwrap(v.value));
        }}
        value={value}
        options={OPTIONS}
      />
    </>
  );
};
