import * as stylex from '@stylexjs/stylex';
import { type DeepMap, type FieldError, useFormContext } from 'react-hook-form';

import { Trans, t } from '@grafana/i18n';
import { Button } from '@grafana/ui';
import { useControlledFieldArray } from 'app/features/alerting/unified/hooks/useControlledFieldArray';
import {
  type NotificationChannelOption,
  type NotificationChannelSecureFields,
  type OptionMeta,
} from 'app/features/alerting/unified/types/alerting';

import { ActionIcon } from '../../../rules/ActionIcon';
import { CollapsibleSection } from '../CollapsibleSection';

import { OptionField } from './OptionField';
import { getReceiverFormFieldStyles } from './styles';

interface Props {
  defaultValues?: any[];
  option: NotificationChannelOption;
  pathPrefix: string;
  errors?: Array<DeepMap<any, FieldError>>;
  readOnly?: boolean;
  secureFields: NotificationChannelSecureFields;
  getOptionMeta?: (option: NotificationChannelOption) => OptionMeta;
}

export const SubformArrayField = ({
  option,
  pathPrefix,
  errors,
  defaultValues,
  readOnly = false,
  secureFields,
  getOptionMeta,
}: Props) => {
  const path = `${pathPrefix}${option.propertyName}`;
  const formAPI = useFormContext();
  const { fields, append, remove } = useControlledFieldArray({ name: path, formAPI, defaults: defaultValues });

  return (
    <div {...stylex.props(formStyles.wrapper)}>
      <CollapsibleSection
        {...stylex.props(formStyles.collapsibleSection)}
        // eslint-disable-next-line @grafana/i18n/no-untranslated-strings
        label={`${option.label} (${fields.length})`}
        description={option.description}
      >
        {(fields ?? defaultValues ?? []).map((field, itemIndex) => {
          return (
            <div key={itemIndex} {...stylex.props(formStyles.wrapper)}>
              {!readOnly && (
                <ActionIcon
                  data-testid={`${path}.${itemIndex}.delete-button`}
                  icon="trash-alt"
                  tooltip={t('alerting.subform-array-field.tooltip-delete', 'delete')}
                  onClick={() => remove(itemIndex)}
                  {...stylex.props(formStyles.deleteIcon)}
                />
              )}
              {option.subformOptions?.map((option) => (
                <OptionField
                  readOnly={readOnly}
                  getOptionMeta={getOptionMeta}
                  secureFields={secureFields}
                  defaultValue={field?.[option.propertyName]}
                  key={option.propertyName}
                  option={option}
                  pathPrefix={`${path}.${itemIndex}.`}
                  error={errors?.[itemIndex]?.[option.propertyName]}
                />
              ))}
            </div>
          );
        })}
        {!readOnly && (
          <Button
            data-testid={`${path}.add-button`}
            {...stylex.props(formStyles.addButton)}
            type="button"
            variant="secondary"
            icon="plus"
            size="sm"
            onClick={() => append({ __id: String(Math.random()) })}
          >
            <Trans i18nKey="alerting.subform-array-field.add">Add</Trans>
          </Button>
        )}
      </CollapsibleSection>
    </div>
  );
};
