import * as stylex from '@stylexjs/stylex';
import { Controller, useFormContext } from 'react-hook-form';

import { t } from '@grafana/i18n';
import { Field } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import MuteTimingsSelector from 'app/features/alerting/unified/components/alertmanager-entities/MuteTimingsSelector';
import { type BaseAlertmanagerArgs } from 'app/features/alerting/unified/types/hooks';
import { type RuleFormValues } from 'app/features/alerting/unified/types/rule-form';
import { mapMultiSelectValueToStrings } from 'app/features/alerting/unified/utils/amroutes';

/** Provides a form field for use in simplified routing, for selecting appropriate mute timings */
export function MuteTimingFields({ alertmanager }: BaseAlertmanagerArgs) {
  const {
    control,
    formState: { errors },
  } = useFormContext<RuleFormValues>();

  return (
    <Field
      label={t('alerting.mute-timing-fields.am-mute-timing-select-label-mute-timings', 'Mute timings')}
      data-testid="am-mute-timing-select"
      description={t(
        'alerting.mute-timing-fields.am-mute-timing-select-description-mute-timings',
        'Select a mute timing to define when not to send notifications for this alert rule'
      )}
      className={stylex.props(styles.muteTimingField).className}
      invalid={!!errors.contactPoints?.[alertmanager]?.muteTimeIntervals}
      noMargin
    >
      <Controller
        render={({ field: { onChange, ref, ...field } }) => (
          <MuteTimingsSelector
            alertmanager={alertmanager}
            selectProps={{
              ...field,
              onChange: (value) => onChange(mapMultiSelectValueToStrings(value)),
            }}
          />
        )}
        control={control}
        name={`contactPoints.${alertmanager}.muteTimeIntervals`}
      />
    </Field>
  );
}
const styles = stylex.create({
  muteTimingField: {
    marginTop: spacing['--gf-spacing-x1'],
  },
});
