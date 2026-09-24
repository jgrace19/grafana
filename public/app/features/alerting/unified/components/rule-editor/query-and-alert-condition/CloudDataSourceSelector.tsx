import * as stylex from '@stylexjs/stylex';
import { Controller, useFormContext } from 'react-hook-form';

import { type DataSourceInstanceSettings } from '@grafana/data';
import { t } from '@grafana/i18n';
import { Field } from '@grafana/ui';

import { RuleFormType, type RuleFormValues } from '../../../types/rule-form';
import { CloudRulesSourcePicker } from '../CloudRulesSourcePicker';

export interface CloudDataSourceSelectorProps {
  disabled?: boolean;
  onChangeCloudDatasource: (datasourceUid: string) => void;
}
export const CloudDataSourceSelector = ({ disabled, onChangeCloudDatasource }: CloudDataSourceSelectorProps) => {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<RuleFormValues>();

  const ruleFormType = watch('type');

  return (
    <div {...stylex.props(styles.flexRow)}>
      {(ruleFormType === RuleFormType.cloudAlerting || ruleFormType === RuleFormType.cloudRecording) && (
        <Field
          className={stylex.props(styles.formInput).className}
          label={
            disabled
              ? t('alerting.cloud-data-source-selector.label-disabled', 'Data source')
              : t('alerting.cloud-data-source-selector.label', 'Select data source')
          }
          error={errors.dataSourceName?.message}
          invalid={!!errors.dataSourceName?.message}
        >
          <Controller
            render={({ field: { onChange, ref, ...field } }) => (
              <CloudRulesSourcePicker
                {...field}
                disabled={disabled}
                onChange={(ds: DataSourceInstanceSettings) => {
                  // reset expression as they don't need to persist after changing datasources
                  setValue('expression', '');
                  onChange(ds?.name ?? null);
                  onChangeCloudDatasource(ds?.uid ?? null);
                }}
              />
            )}
            name="dataSourceName"
            control={control}
            rules={{
              required: {
                value: true,
                message: t(
                  'alerting.cloud-data-source-selector.message.please-select-a-data-source',
                  'Please select a data source'
                ),
              },
            }}
          />
        </Field>
      )}
    </div>
  );
};

const styles = stylex.create({
  formInput: {
    width: '330px',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
});
