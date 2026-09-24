import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { variableSelectFieldStyles } from './VariableSelectField.stylex';
import { type PropsWithChildren, useId } from 'react';
import * as React from 'react';

import {Field, Select} from '@grafana/ui';

interface VariableSelectFieldProps<T> {
  name: string;
  value?: SelectableValue<T>;
  options: Array<SelectableValue<T>>;
  onChange: (option: SelectableValue<T>) => void;
  testId?: string;
  width?: number;
  description?: React.ReactNode;
}

export function VariableSelectField({
  name,
  description,
  value,
  options,
  onChange,
  testId,
  width,
}: PropsWithChildren<VariableSelectFieldProps<any>>) {

  const uniqueId = useId();
  const inputId = `variable-select-input-${name}-${uniqueId}`;

  return (
    <Field label={name} description={description} htmlFor={inputId}>
      <Select
        data-testid={testId}
        inputId={inputId}
        onChange={onChange}
        value={value}
        width={width ?? 30}
        options={options}
        {...stylex.props(variableSelectFieldStyles.selectContainer)}
      />
    </Field>
  );
}


