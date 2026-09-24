import * as stylex from '@stylexjs/stylex';
import { type HTMLProps, useEffect } from 'react';
import * as React from 'react';
import { useForm, type Mode, type DefaultValues, type SubmitHandler, type FieldValues } from 'react-hook-form';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { type FormAPI } from '../../types/forms';

interface FormProps<T extends FieldValues> extends Omit<HTMLProps<HTMLFormElement>, 'onSubmit' | 'children'> {
  validateOn?: Mode;
  validateOnMount?: boolean;
  validateFieldsOnMount?: string | string[];
  defaultValues?: DefaultValues<T>;
  onSubmit: SubmitHandler<T>;
  children: (api: FormAPI<T>) => React.ReactNode;
  /** Sets max-width for container. Use it instead of setting individual widths on inputs.*/
  maxWidth?: number | 'none';
}

/**
 * @deprecated use the `useForm` hook from react-hook-form instead
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/forms-form--docs
 */
export function Form<T extends FieldValues>({
  defaultValues,
  onSubmit,
  validateOnMount = false,
  validateFieldsOnMount,
  children,
  validateOn = 'onSubmit',
  maxWidth = 600,
  style,
  ...htmlProps
}: FormProps<T>) {
  const { handleSubmit, trigger, formState, ...rest } = useForm<T>({
    mode: validateOn,
    defaultValues,
  });

  useEffect(() => {
    if (validateOnMount) {
      //@ts-expect-error
      trigger(validateFieldsOnMount);
    }
  }, [trigger, validateFieldsOnMount, validateOnMount]);

  return (
    <form
      {...mergeStylexProps(
        stylex.props(styles.form, styles.maxWidth(maxWidth !== 'none' ? maxWidth + 'px' : maxWidth)),
        {
          style,
        }
      )}
      onSubmit={handleSubmit(onSubmit)}
      {...htmlProps}
    >
      {children({ errors: formState.errors, formState, trigger, ...rest })}
    </form>
  );
}

const styles = stylex.create({
  form: {
    width: '100%',
  },
  maxWidth: (maxWidth: string) => ({ maxWidth }),
});
