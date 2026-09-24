import * as stylex from '@stylexjs/stylex';
import { useEffect } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import { Trans, t } from '@grafana/i18n';
import { Button, Divider, Field, IconButton, Input, Select } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';
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
          <div {...stylex.props(styles.matchers, styles.indent)}>
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
                <div {...stylex.props(styles.row)} key={`${matcher.id}`} data-testid="matcher">
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
                  <Field
                    label={t('alerting.matchers-field.label-operator', 'Operator')}
                    className={stylex.props(styles.rowSibling).className}
                  >
                    <Controller
                      control={control}
                      render={({ field: { onChange, ref, ...field } }) => (
                        <Select
                          {...field}
                          onChange={(value) => onChange(value.value)}
                          className={stylex.props(styles.matcherOptions).className}
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
                    className={stylex.props(styles.rowSibling).className}
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
                      style={removeButtonStyle}
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
            className={stylex.props(styles.indent).className}
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

const styles = stylex.create({
  row: {
    marginTop: spacing['--gf-spacing-x1'],
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'row',
    backgroundColor: colors['--gf-colors-background-secondary'],
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x1'],
  },
  rowSibling: {
    marginLeft: spacing['--gf-spacing-x2'],
  },
  matcherOptions: {
    minWidth: '140px',
  },
  matchers: {
    maxWidth: '544px',
    marginTop: spacing['--gf-spacing-x1'],
    marginRight: 0,
    marginBottom: spacing['--gf-spacing-x1'],
    marginLeft: 0,
    paddingTop: spacing['--gf-spacing-x0-5'],
  },
  indent: {
    marginLeft: spacing['--gf-spacing-x2'],
  },
});

// IconButton has no xstyle, and its own margins must lose to these.
const removeButtonStyle = {
  marginLeft: spacing['--gf-spacing-x1'],
  marginTop: spacing['--gf-spacing-x2-5'],
};

export default MatchersField;
