import * as stylex from '@stylexjs/stylex';
import { useFormContext } from 'react-hook-form';

import { Trans, t } from '@grafana/i18n';
import { Field, FieldSet, Input, TextArea } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { useCorrelationsFormContext } from './correlationsFormContext';
import { type FormDTO } from './types';
import { getInputId } from './utils';

export const ConfigureCorrelationBasicInfoForm = () => {
  const { register, formState } = useFormContext<FormDTO>();
  const { correlation, readOnly } = useCorrelationsFormContext();

  return (
    <>
      <FieldSet label={t('correlations.basic-info-form.title', 'Define correlation label (Step 1 of 3)')}>
        <Trans i18nKey="correlations.basic-info-form.sub-text">
          <p>Define text that will describe the correlation.</p>
        </Trans>
        <input type="hidden" {...register('type')} />
        <Field
          label={t('correlations.basic-info-form.label-label', 'Label')}
          description={t(
            'correlations.basic-info-form.label-description',
            'This name will be used as the label for the correlation. This will show as button text, a menu item, or hover text on a link.'
          )}
          className={stylex.props(styles.label).className}
          invalid={!!formState.errors.label}
          error={formState.errors.label?.message}
        >
          <Input
            id={getInputId('label', correlation)}
            {...register('label', {
              required: {
                value: true,
                message: t('correlations.basic-info-form.label-required', 'This field is required.'),
              },
            })}
            readOnly={readOnly}
            placeholder={t('correlations.basic-info-form.label-placeholder', 'e.g. Tempo traces')}
          />
        </Field>

        <Field
          label={t('correlations.basic-info-form.description-label', 'Description')}
          description={t(
            'correlations.basic-info-form.description-description',
            'Optional description with more information about the link'
          )}
          // the Field component automatically adds margin to itself, so we are forced to workaround it by overriding  its styles
          className={stylex.props(styles.description).className}
        >
          <TextArea id={getInputId('description', correlation)} {...register('description')} readOnly={readOnly} />
        </Field>
      </FieldSet>
    </>
  );
};

const styles = stylex.create({
  label: {
    maxWidth: `calc(${spacing['--gf-spacing-grid-size']} * 80)`,
  },
  description: {
    maxWidth: `calc(${spacing['--gf-spacing-grid-size']} * 80)`,
  },
});
