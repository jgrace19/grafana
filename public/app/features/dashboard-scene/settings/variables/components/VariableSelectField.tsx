import * as stylex from '@stylexjs/stylex';
import { type PropsWithChildren, useId } from 'react';
import * as React from 'react';

import { type SelectableValue } from '@grafana/data';
import { Field, Select } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

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
        className={stylex.props(styles.selectContainer).className}
      />
    </Field>
  );
}

const styles = stylex.create({
  selectContainer: {
    marginRight: spacing['--gf-spacing-x0-5'],
  },
});
