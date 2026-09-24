import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { matchersFieldStyles } from './MatchersField.stylex';
import { useEffect } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import { Trans, t } from '@grafana/i18n';
import { Button, Divider, Field, IconButton, Input, Select } from '@grafana/ui';
import { alertRuleApi } from 'app/features/alerting/unified/api/alertRuleApi';
import { MatcherOperator } from 'app/plugins/datasource/alertmanager/types';

import { type SilenceFormFields } from '../../types/silence-form';
import { matcherFieldOptions } from '../../utils/alertmanager';

interface Props {
  className?: string;
  required: boolean;
  ruleUid?: string;
}

const MatchersField = ({ className, required, ruleUid }: Props) => {
  const formApi = useFormContext<SilenceFormFields>();
  const {
    control,
    register,
    formState: { errors },
  } = formApi;

  const { fields: matchers = [], append, remove } = useFieldArray<SilenceFormFields>({ name: 'matchers' });

  const [getAlertRule, { data: alertRule }] = alertRuleApi.endpoints.getAlertRule.useLazyQuery();
  useEffect(() => {
    // If we have a UID, fetch the alert rule details so we can display the rule name
    if (ruleUid) {
      getAlertRule({ uid: ruleUid });
    }
  }, [getAlertRule, ruleUid]);

  return (
    <div className={className}>
      <Field
        label={t('alerting.matchers-field.label-refine-affected-alerts', 'Refine affected alerts')}
        required={required}
      >
        <div>
          <div {...mergeStylexClassName(stylex.props(formStyles.matchers), stylex.props(formStyles.indent))}>
            {alertRule && (
              <div>
                <Field label={t('alerting.matchers-field.label-alert-rule', 'Alert rule')} disabled>
                  <Input id="alert-rule-name" defaultValue={alertRule.grafana_alert.title} disabled />
                </Field>
                <Divider />
              </div>
            )}
            {matchers.map((matcher, index) => {
              return (
                <div {...stylex.props(matchersFieldStyles.row)} key={`${matcher.id}`} data-testid="matcher">
                  <Field
                    label={t('alerting.matchers-field.label-label', 'Label')}
                    invalid={!!errors?.matchers?.[index]?.name}
                    error={errors?.matchers?.[index]?.name?.message}
                  >
                    <Input
                      {...register(`matchers.${index}.name` as const, {
                        required: {
                          value: required,
                          message: t('alerting.matchers-field.message.required', 'Required.'),
                        },
                      })}
                      defaultValue={matcher.name}
                      placeholder={t('alerting.matchers-field.placeholder-label', 'label')}
                      id={`matcher-${index}-label`}
                    />
                  </Field>
                  <Field label={t('alerting.matchers-field.label-operator', 'Operator')}>
                    <Controller
                      control={control}
                      render={({ field: { onChange, ref, ...field } }) => (
                        <Select
                          {...field}
                          onChange={(value) => onChange(value.value)}
                          {...stylex.props(matchersFieldStyles.matcherOptions)}
                          options={matcherFieldOptions}
                          aria-label={t('alerting.matchers-field.aria-label-operator', 'operator')}
                          id={`matcher-${index}-operator`}
                        />
                      )}
                      defaultValue={matcher.operator || matcherFieldOptions[0].value}
                      name={`matchers.${index}.operator`}
                      rules={{
                        required: {
                          value: required,
                          message: t('alerting.matchers-field.message.required', 'Required.'),
                        },
                      }}
                    />
                  </Field>
                  <Field
                    label={t('alerting.matchers-field.label-value', 'Value')}
                    invalid={!!errors?.matchers?.[index]?.value}
                    error={errors?.matchers?.[index]?.value?.message}
                  >
                    <Input
                      {...register(`matchers.${index}.value` as const, {
                        required: {
                          value: required,
                          message: t('alerting.matchers-field.message.required', 'Required.'),
                        },
                      })}
                      defaultValue={matcher.value}
                      placeholder={t('alerting.matchers-field.placeholder-value', 'value')}
                      id={`matcher-${index}-value`}
                    />
                  </Field>
                  {(matchers.length > 1 || !required) && (
                    <IconButton
                      aria-label={t('alerting.matchers-field.aria-label-remove-matcher', 'Remove matcher')}
                      {...stylex.props(matchersFieldStyles.removeButton)}
                      name="trash-alt"
                      onClick={() => remove(index)}
                    >
                      <Trans i18nKey="alerting.matchers-field.remove">Remove</Trans>
                    </IconButton>
                  )}
                </div>
              );
            })}
          </div>
          <Button
            {...stylex.props(matchersFieldStyles.indent)}
            tooltip={t(
              'alerting.matchers-field.tooltip-refine-which-alert-instances-silenced-selecting',
              'Refine which alert instances are silenced by selecting label matchers'
            )}
            type="button"
            icon="plus"
            variant="secondary"
            onClick={() => {
              const newMatcher = { name: '', value: '', operator: MatcherOperator.equal };
              append(newMatcher);
            }}
          >
            <Trans i18nKey="alerting.matchers-field.add-matcher">Add matcher</Trans>
          </Button>
        </div>
      </Field>
    </div>
  );
};


export default MatchersField;
