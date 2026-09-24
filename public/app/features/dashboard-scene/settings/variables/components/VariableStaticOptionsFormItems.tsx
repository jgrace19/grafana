import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { variableStaticOptionsFormItemsStyles } from './VariableStaticOptionsFormItems.stylex';
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd';

import { Trans } from '@grafana/i18n';

import {
  type VariableStaticOptionsFormItem,
  VariableStaticOptionsFormItemEditor,
} from './VariableStaticOptionsFormItemEditor';

interface VariableStaticOptionsFormProps {
  items: VariableStaticOptionsFormItem[];
  onChange: (items: VariableStaticOptionsFormItem[]) => void;
}

export function VariableStaticOptionsFormItems({ items, onChange }: VariableStaticOptionsFormProps) {


  const handleReorder = (result: DropResult) => {
    if (!result || !result.destination) {
      return;
    }

    const startIdx = result.source.index;
    const endIdx = result.destination.index;

    if (startIdx === endIdx) {
      return;
    }

    const newItems = [...items];
    const [removedItem] = newItems.splice(startIdx, 1);
    newItems.splice(endIdx, 0, removedItem);
    onChange(newItems);
  };

  const handleChange = (item: VariableStaticOptionsFormItem) => {
    const idx = items.findIndex((currentItem) => currentItem.id === item.id);

    if (idx === -1) {
      return;
    }

    const newOptions = [...items];
    newOptions[idx] = item;
    onChange(newOptions);
  };

  const handleRemove = (item: VariableStaticOptionsFormItem) => {
    const newOptions = items.filter((currentItem) => currentItem.id !== item.id);
    onChange(newOptions);
  };

  return (
    <table {...stylex.props(variableStaticOptionsFormItemsStyles.table)}>
      <thead>
        <tr>
          <th {...stylex.props(variableStaticOptionsFormItemsStyles.headerIconColumn)} />
          <th {...stylex.props(variableStaticOptionsFormItemsStyles.headerInputColumn)}>
            <Trans i18nKey="variables.static-options.value-header">Value</Trans>
          </th>
          <th {...stylex.props(variableStaticOptionsFormItemsStyles.headerInputColumn)}>
            <Trans i18nKey="variables.static-options.label-header">Display text</Trans>
          </th>
          <th {...stylex.props(variableStaticOptionsFormItemsStyles.headerIconColumn)} />
        </tr>
      </thead>
      <DragDropContext onDragEnd={handleReorder}>
        <Droppable droppableId="static-options-list" direction="vertical">
          {(droppableProvided) => (
            <tbody ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
              {items.map((item, idx) => (
                <VariableStaticOptionsFormItemEditor
                  item={item}
                  index={idx}
                  onChange={handleChange}
                  onRemove={handleRemove}
                  key={item.id}
                />
              ))}
              {droppableProvided.placeholder}
            </tbody>
          )}
        </Droppable>
      </DragDropContext>
    </table>
  );
}

