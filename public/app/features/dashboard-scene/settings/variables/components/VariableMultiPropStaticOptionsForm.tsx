import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { variableMultiPropStaticOptionsFormStyles } from './VariableMultiPropStaticOptionsForm.stylex';
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { type VariableValueOption, type VariableValueOptionProperties } from '@grafana/scenes';
import { Icon, IconButton, Input, Stack } from '@grafana/ui';

import { VariableStaticOptionsFormAddButton } from './VariableStaticOptionsFormAddButton';

type Option = VariableValueOption & {
  id: string;
  properties: VariableValueOptionProperties;
};

export type VariableMultiPropStaticOptionsFormProps = {
  options: VariableValueOption[];
  properties: string[];
  onChange: (options: VariableValueOption[]) => void;
  allowEmptyValue?: boolean;
  isInModal?: boolean;
};

const useVariableMultiPropStaticOptionsForm = ({
  options,
  properties,
  onChange,
}: VariableMultiPropStaticOptionsFormProps) => {
  const [internalOptions, setInternalOptions] = useState<Option[]>(() =>
    options.map((o) => ({ id: uuidv4(), ...o, properties: { ...o.properties, value: o.value, text: o.label } }))
  );

  // track id of newly added option for auto-focus
  const autoFocusIdRef = useRef<string | null>(null);
  useEffect(() => {
    autoFocusIdRef.current = null;
  });

  const updateOptions = (newOptions: Option[]) => {
    setInternalOptions(newOptions);
    onChange(newOptions.map((o) => ({ label: o.label, value: o.value, properties: o.properties })));
  };

  const onAddNewOption = () => {
    const newId = uuidv4();
    autoFocusIdRef.current = newId;

    const newOption = {
      id: newId,
      label: '',
      value: '',
      properties: properties.reduce((acc, p) => ({ ...acc, [p]: '' }), {}),
    };
    updateOptions([...internalOptions, newOption]);
  };

  const onRemoveOption = (o: Option) => {
    const newOptions = internalOptions.filter(({ id }) => o.id !== id);
    updateOptions(newOptions);
  };

  const onOptionsReordered = (result: DropResult) => {
    if (!result || !result.destination) {
      return;
    }

    const startIdx = result.source.index;
    const endIdx = result.destination.index;
    if (startIdx === endIdx) {
      return;
    }

    const newOptions = [...internalOptions];
    const [removedItem] = newOptions.splice(startIdx, 1);
    newOptions.splice(endIdx, 0, removedItem);
    updateOptions(newOptions);
  };

  const onValueChange = (o: Option, key: string, value: string) => {
    const newOptions = internalOptions.map((option) => {
      if (option.id === o.id) {
        const newProperties = { ...option.properties, [key]: value };
        return {
          ...option,
          label: newProperties.text,
          value: newProperties.value,
          properties: newProperties,
        };
      } else {
        return option;
      }
    });
    updateOptions(newOptions);
  };

  return {
    properties,
    options: internalOptions,
    autoFocusId: autoFocusIdRef.current,
    onAddNewOption,
    onRemoveOption,
    onOptionsReordered,
    onValueChange,
  };
};

export const VariableMultiPropStaticOptionsForm = (props: VariableMultiPropStaticOptionsFormProps) => {
  const { properties, options, autoFocusId, onAddNewOption, onRemoveOption, onOptionsReordered, onValueChange } =
    useVariableMultiPropStaticOptionsForm(props);

  return (
    <div {...stylex.props(variableMultiPropStaticOptionsFormStyles.wrapper)}>
      <div
        {...stylex.props(variableMultiPropStaticOptionsFormStyles.grid)}
        role="grid"
        aria-label={t(
          'dashboard-scene.variable-multi-prop-static-options-form.aria-label-static-options',
          'Static options'
        )}
      >
        <div {...stylex.props(variableMultiPropStaticOptionsFormStyles.headerRow)} role="row">
          <div {...stylex.props(variableMultiPropStaticOptionsFormStyles.headerCell)} role="columnheader" />
          {properties.map((p) => (
            <div key={p} {...stylex.props(variableMultiPropStaticOptionsFormStyles.headerCell)} role="columnheader">
              {p}
            </div>
          ))}
        </div>
        <DragDropContext onDragEnd={onOptionsReordered}>
          <Droppable droppableId="static-options-list" direction="vertical">
            {(droppableProvided) => (
              <div
                {...stylex.props(variableMultiPropStaticOptionsFormStyles.body)}
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
                role="rowgroup"
              >
                {options.map((o, i) => (
                  <OptionRow
                    key={o.id}
                    index={i}
                    option={o}
                    properties={properties}
                    autoFocusFirstInput={o.id === autoFocusId}
                    onRemoveOption={onRemoveOption}
                    onValueChange={onValueChange}
                    onAddNewOption={i === options.length - 1 ? onAddNewOption : undefined}
                  />
                ))}
                {droppableProvided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <div {...stylex.props(variableMultiPropStaticOptionsFormStyles.addNewOptionButton)}>
        <VariableStaticOptionsFormAddButton onAdd={onAddNewOption} />
      </div>
    </div>
  );
};

type OptionRowProps = {
  index: number;
  option: Option;
  properties: string[];
  autoFocusFirstInput?: boolean;
  onRemoveOption: (option: Option) => void;
  onValueChange: (option: Option, key: string, value: string) => void;
  onAddNewOption?: () => void;
};

function OptionRow({
  index,
  option,
  properties,
  autoFocusFirstInput,
  onAddNewOption,
  onRemoveOption,
  onValueChange,
}: OptionRowProps) {

  const onKeyDown = onAddNewOption
    ? (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          onAddNewOption();
        }
      }
    : undefined;

  return (
    <Draggable draggableId={option.id} index={index}>
      {(draggableProvided) => (
        <div
          {...stylex.props(variableMultiPropStaticOptionsFormStyles.row)}
          ref={draggableProvided.innerRef}
          {...draggableProvided.draggableProps}
          data-testid={selectors.pages.Dashboard.Settings.Variables.Edit.StaticOptionsEditor.row}
          role="row"
          style={{ ...draggableProvided.draggableProps.style }}
        >
          <div {...stylex.props(variableMultiPropStaticOptionsFormStyles.cell)} role="gridcell">
            <Stack direction="row" alignItems="center" {...draggableProvided.dragHandleProps}>
              <Icon
                title={t('dashboard-scene.option-row.title-drag-and-drop-to-reorder', 'Drag and drop to reorder')}
                name="draggabledots"
                size="lg"
                {...stylex.props(variableMultiPropStaticOptionsFormStyles.dragIcon)}
              />
            </Stack>
          </div>
          {properties.map((p, i) => (
            <div key={`r1-${p}`} {...stylex.props(variableMultiPropStaticOptionsFormStyles.cell)} role="gridcell">
              <Input
                autoFocus={autoFocusFirstInput && !i}
                tabIndex={0}
                placeholder={p}
                value={option.properties[p] ?? ''}
                onChange={(e) => {
                  if (option.properties[p] !== e.currentTarget.value) {
                    onValueChange(option, p, e.currentTarget.value);
                  }
                }}
                onKeyDown={i === properties.length - 1 ? onKeyDown : undefined}
              />
            </div>
          ))}
          <div {...stylex.props(variableMultiPropStaticOptionsFormStyles.cell)} role="gridcell">
            <IconButton
              name="trash-alt"
              variant="destructive"
              onClick={() => onRemoveOption(option)}
              aria-label={t('dashboard-scene.option-row.aria-label-remove-option', 'Remove option')}
              tooltip={t('dashboard-scene.option-row.tooltip-remove-option', 'Remove option')}
              tooltipPlacement="top"
            />
          </div>
        </div>
      )}
    </Draggable>
  );
}

