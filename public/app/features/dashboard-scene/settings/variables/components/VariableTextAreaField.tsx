import { useId } from '@react-aria/utils';
import * as stylex from '@stylexjs/stylex';
import { type FormEvent, type PropsWithChildren, type ReactElement, type ReactNode } from 'react';

import { Field, TextArea } from '@grafana/ui';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

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
        xstyle={variableTextAreaStyles.textarea}
        data-testid={testId}
      />
    </Field>
  );
}

/** Sizes a variable editor TextArea. */
export const variableTextAreaStyles = stylex.create({
  textarea: {
    whiteSpace: 'pre-wrap',
    minHeight: spacing['--gf-spacing-x4'],
    height: 'auto',
    overflow: 'auto',
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    paddingLeft: spacing['--gf-spacing-x1'],
    width: { default: 'inherit', [bp.smDown]: '100%' },
  },
});
