import * as stylex from '@stylexjs/stylex';
import { useFormContext } from 'react-hook-form';

import { Field } from '@grafana/ui';
import { type RuleFormValues } from 'app/features/alerting/unified/types/rule-form';
import { promDurationValidator, repeatIntervalValidator } from 'app/features/alerting/unified/utils/amroutes';

import { PromDurationInput } from '../../../../notification-policies/PromDurationInput';
import { formStyles } from '../../../../notification-policies/formStyles';
import { routeTimingsFields } from '../../../../notification-policies/routeTimingsFields';
import { TIMING_OPTIONS_DEFAULTS } from '../../../../notification-policies/timingOptions';

interface RouteTimingsProps {
  alertManager: string;
}

export function RouteTimings({ alertManager }: RouteTimingsProps) {
  const {
    register,
    formState: { errors },
    getValues,
  } = useFormContext<RuleFormValues>();
  return (
    <>
      <Field
        label={routeTimingsFields.groupWait.label}
        description={routeTimingsFields.groupWait.description}
        invalid={!!errors.contactPoints?.[alertManager]?.groupWaitValue}
        error={errors.contactPoints?.[alertManager]?.groupWaitValue?.message}
      >
        <PromDurationInput
          {...register(`contactPoints.${alertManager}.groupWaitValue`, { validate: promDurationValidator })}
          aria-label={routeTimingsFields.groupWait.ariaLabel}
          className={stylex.props(formStyles.promDurationInput).className}
          placeholder={TIMING_OPTIONS_DEFAULTS.group_wait}
        />
      </Field>
      <Field
        label={routeTimingsFields.groupInterval.label}
        description={routeTimingsFields.groupInterval.description}
        invalid={!!errors.contactPoints?.[alertManager]?.groupIntervalValue}
        error={errors.contactPoints?.[alertManager]?.groupIntervalValue?.message}
      >
        <PromDurationInput
          {...register(`contactPoints.${alertManager}.groupIntervalValue`, {
            validate: promDurationValidator,
          })}
          aria-label={routeTimingsFields.groupInterval.ariaLabel}
          className={stylex.props(formStyles.promDurationInput).className}
          placeholder={TIMING_OPTIONS_DEFAULTS.group_interval}
        />
      </Field>
      <Field
        label={routeTimingsFields.repeatInterval.label}
        description={routeTimingsFields.repeatInterval.description}
        invalid={!!errors.contactPoints?.[alertManager]?.repeatIntervalValue}
        error={errors.contactPoints?.[alertManager]?.repeatIntervalValue?.message}
      >
        <PromDurationInput
          {...register(`contactPoints.${alertManager}.repeatIntervalValue`, {
            validate: (value: string) => {
              const groupInterval = getValues(`contactPoints.${alertManager}.repeatIntervalValue`);
              return repeatIntervalValidator(value, groupInterval);
            },
          })}
          aria-label={routeTimingsFields.repeatInterval.ariaLabel}
          className={stylex.props(formStyles.promDurationInput).className}
          placeholder={TIMING_OPTIONS_DEFAULTS.repeat_interval}
        />
      </Field>
    </>
  );
}
