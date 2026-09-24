import type { JSX } from 'react';

import { Select } from '@grafana/ui';

import { type ResultFormat } from '../../../../../types';
import { RESULT_FORMATS } from '../../../constants';
import { unwrap } from '../utils/unwrap';

import { selectStyles } from './styles';

type Props = {
  inputId?: string;
  format: ResultFormat;
  onChange: (newFormat: ResultFormat) => void;
};

export const FormatAsSection = ({ format, inputId, onChange }: Props): JSX.Element => {
  return (
    <Select<ResultFormat>
      inputId={inputId}
      className="width-8"
      xstyle={selectStyles.paddingRight}
      onChange={(v) => {
        onChange(unwrap(v.value));
      }}
      value={format}
      options={RESULT_FORMATS}
    />
  );
};
