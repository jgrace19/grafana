import * as stylex from '@stylexjs/stylex';

import { Trans, t } from '@grafana/i18n';
import { Button, Input } from '@grafana/ui';

import { ActionIcon } from '../../../rules/ActionIcon';

interface Props {
  value?: string[];
  readOnly?: boolean;
  onChange: (value: string[]) => void;
}

export const StringArrayInput = ({ value, onChange, readOnly = false }: Props) => {

  const deleteItem = (index: number) => {
    if (!value) {
      return;
    }
    const newValue = value.slice();
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const updateValue = (itemValue: string, index: number) => {
    if (!value) {
      return;
    }
    onChange(value.map((v, i) => (i === index ? itemValue : v)));
  };

  return (
    <div>
      {!!value?.length &&
        value.map((v, index) => (
          <div key={index} {...stylex.props(stringArrayInputStyles.row)}>
            <Input readOnly={readOnly} value={v} onChange={(e) => updateValue(e.currentTarget.value, index)} />
            {!readOnly && (
              <ActionIcon
                {...stylex.props(stringArrayInputStyles.deleteIcon)}
                icon="trash-alt"
                tooltip={t('alerting.string-array-input.tooltip-delete', 'delete')}
                onClick={() => deleteItem(index)}
              />
            )}
          </div>
        ))}
      {!readOnly && (
        <Button
          {...stylex.props(stringArrayInputStyles.addButton)}
          type="button"
          variant="secondary"
          icon="plus"
          size="sm"
          onClick={() => onChange([...(value ?? []), ''])}
        >
          <Trans i18nKey="alerting.string-array-input.add">Add</Trans>
        </Button>
      )}
    </div>
  );
};

