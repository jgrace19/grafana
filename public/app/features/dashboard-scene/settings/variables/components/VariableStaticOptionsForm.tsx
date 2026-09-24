import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { variableStaticOptionsFormStyles } from './VariableStaticOptionsForm.stylex';
import { useEffect, useState, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { type VariableValueOption } from '@grafana/scenes';

import { VariableStaticOptionsFormAddButton } from './VariableStaticOptionsFormAddButton';
import { type VariableStaticOptionsFormItem } from './VariableStaticOptionsFormItemEditor';
import { VariableStaticOptionsFormItems } from './VariableStaticOptionsFormItems';

interface VariableStaticOptionsFormProps {
  options: VariableValueOption[];
  onChange: (options: VariableValueOption[]) => void;
  allowEmptyValue?: boolean;
  isInModal?: boolean;
}

export interface VariableStaticOptionsFormRef {
  addItem: () => void;
}

export const VariableStaticOptionsForm = forwardRef<VariableStaticOptionsFormRef, VariableStaticOptionsFormProps>(
  function ({ options, onChange, allowEmptyValue, isInModal = false }: VariableStaticOptionsFormProps, ref) {


    // Whenever the form is updated, we want to ignore the next update from the parent component.
    // This is because the parent component will update the options, and we don't want to update the items again.
    // This is a hack to prevent the form from updating twice and losing items and IDs.
    // Alternatively, we could maintain a list of emitted items and compare the new options to it, but this is less performant.
    const ignoreNextUpdate = useRef<boolean>(false);

    const mapOption = useCallback(
      (option: VariableValueOption) => ({
        label: option.label,
        value: String(option.value),
        id: uuidv4(),
      }),
      []
    );

    const [items, setItems] = useState<VariableStaticOptionsFormItem[]>(
      options.length ? options.map(mapOption) : [createEmptyItem()]
    );

    useEffect(() => {
      if (!ignoreNextUpdate.current) {
        setItems(
          options.length
            ? options.map((option) => ({
                label: option.label,
                value: String(option.value),
                id: uuidv4(),
              }))
            : [createEmptyItem()]
        );
      }

      ignoreNextUpdate.current = false;
    }, [options]);

    const updateItems = useCallback(
      (items: VariableStaticOptionsFormItem[]) => {
        setItems(items);
        ignoreNextUpdate.current = true;
        onChange(
          items.reduce<VariableValueOption[]>((acc, item) => {
            const value = item.value.trim();

            if (!allowEmptyValue && !value) {
              return acc;
            }

            const label = item.label.trim();

            if (!label && !value) {
              return acc;
            }

            acc.push({
              label: label ? label : value,
              value,
            });

            return acc;
          }, [])
        );
      },
      [allowEmptyValue, onChange]
    );

    const handleAdd = useCallback(() => setItems([...items, createEmptyItem()]), [items]);

    useImperativeHandle(ref, () => ({ addItem: handleAdd }), [handleAdd]);

    return (
      <div
        {...stylex.props(
          variableStaticOptionsFormStyles.container,
          isInModal && variableStaticOptionsFormStyles.containerModal
        )}
      >
        <VariableStaticOptionsFormItems items={items} onChange={updateItems} />
        {!isInModal && (
          <div>
            <VariableStaticOptionsFormAddButton onAdd={handleAdd} />
          </div>
        )}
      </div>
    );
  }
);

VariableStaticOptionsForm.displayName = 'VariableStaticOptionsForm';

function createEmptyItem(): VariableStaticOptionsFormItem {
  return {
    label: '',
    value: '',
    id: uuidv4(),
  };
}
