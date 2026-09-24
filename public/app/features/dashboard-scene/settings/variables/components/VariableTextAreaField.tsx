import { useId } from '@react-aria/utils';
import { type FormEvent, type PropsWithChildren, type ReactElement, type ReactNode } from 'react';

import { Field, TextArea } from '@grafana/ui';

import './VariableTextAreaField.css';

interface VariableTextAreaFieldProps {
  name: string;
  value?: string;
  defaultValue?: string;
  placeholder: string;
  onChange?: (event: FormEvent<HTMLTextAreaElement>) => void;
  width: number;
  ariaLabel?: string;
  required?: boolean;
  testId?: string;
  onBlur?: (event: FormEvent<HTMLTextAreaElement>) => void;
  description?: ReactNode;
  noMargin?: boolean;
}

export function VariableTextAreaField({
  value,
  defaultValue,
  name,
  description,
  placeholder,
  onChange,
  onBlur,
  ariaLabel,
  required,
  width,
  noMargin,
  testId,
}: PropsWithChildren<VariableTextAreaFieldProps>): ReactElement {
  const id = useId();

  return (
    <Field label={name} description={description} htmlFor={id} noMargin={noMargin}>
      <TextArea
        id={id}
        rows={2}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        aria-label={ariaLabel}
        cols={width}
        className={VARIABLE_TEXTAREA_CLASS}
        data-testid={testId}
      />
    </Field>
  );
}

/** Sizes a variable editor TextArea; styled in VariableTextAreaField.css. */
export const VARIABLE_TEXTAREA_CLASS = 'gf-variable-textarea';
