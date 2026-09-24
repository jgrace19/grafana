import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { groupAndNamespaceFieldsStyles } from './GroupAndNamespaceFields.stylex';
import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { t } from '@grafana/i18n';
import { Field, VirtualizedSelect } from '@grafana/ui';

import { type RuleFormValues } from '../../types/rule-form';

import { useGetNameSpacesByDatasourceName } from './useAlertRuleSuggestions';

interface Props {
  rulesSourceName: string;
}

export const GroupAndNamespaceFields = ({ rulesSourceName }: Props) => {
  const {
    control,
    watch,
    formState: { errors },
    setValue,
  } = useFormContext<RuleFormValues>();
  const { namespaceGroups, isLoading } = useGetNameSpacesByDatasourceName(rulesSourceName);

  const namespace = watch('namespace');

  const namespaceOptions: Array<SelectableValue<string>> = useMemo(
    () =>
      Array.from(namespaceGroups.keys()).map((namespace) => ({
        label: namespace,
        value: namespace,
      })),
    [namespaceGroups]
  );

  const groupOptions: Array<SelectableValue<string>> = useMemo(
    () => (namespace && namespaceGroups.get(namespace)?.map((group) => ({ label: group, value: group }))) || [],
    [namespace, namespaceGroups]
  );

  return (
    <div {...stylex.props(groupAndNamespaceFieldsStyles.flexRow)}>
      <Field
        data-testid="namespace-picker"
        label={t('alerting.group-and-namespace-fields.namespace-picker-label-namespace', 'Namespace')}
        // Disable translations as we don't intend to use this dropdown longterm,
        // so avoiding us adding translations for the sake of it
        // eslint-disable-next-line @grafana/i18n/no-untranslated-strings
        description="Type to search for an existing namespace or create a new one"
        error={errors.namespace?.message}
        invalid={!!errors.namespace?.message}
      >
        <Controller
          render={({ field: { onChange, ref, ...field } }) => (
            <VirtualizedSelect
              {...field}
              allowCustomValue
              {...stylex.props(groupAndNamespaceFieldsStyles.input)}
              onChange={(value) => {
                setValue('group', ''); //reset if namespace changes
                onChange(value.value);
              }}
              options={namespaceOptions}
              width={42}
              isLoading={isLoading}
              disabled={isLoading}
            />
          )}
          name="namespace"
          control={control}
          rules={{
            required: { value: true, message: t('alerting.group-and-namespace-fields.message.required', 'Required.') },
          }}
        />
      </Field>
      <Field
        data-testid="group-picker"
        label={t('alerting.group-and-namespace-fields.group-picker-label-group', 'Group')}
        // Disable translations as we don't intend to use this dropdown longterm,
        // so avoiding us adding translations for the sake of it
        // eslint-disable-next-line @grafana/i18n/no-untranslated-strings
        description="Type to search for an existing group or create a new one"
        error={errors.group?.message}
        invalid={!!errors.group?.message}
      >
        <Controller
          render={({ field: { ref, ...field } }) => (
            <VirtualizedSelect
              {...field}
              allowCustomValue
              options={groupOptions}
              width={42}
              onChange={(value) => {
                setValue('group', value.value ?? '');
              }}
              {...stylex.props(groupAndNamespaceFieldsStyles.input)}
              isLoading={isLoading}
              disabled={isLoading}
            />
          )}
          name="group"
          control={control}
          rules={{
            required: { value: true, message: t('alerting.group-and-namespace-fields.message.required', 'Required.') },
          }}
        />
      </Field>
    </div>
  );
};

