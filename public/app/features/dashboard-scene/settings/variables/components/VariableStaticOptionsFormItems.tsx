import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd';
import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';

import {
  type VariableStaticOptionsFormItem,
  VariableStaticOptionsFormItemEditor,
} from './VariableStaticOptionsFormItemEditor';

import './VariableStaticOptionsFormItems.css';

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
    <table className="gf-variable-static-options-table">
      <thead>
        <tr>
          <th {...stylex.props(styles.headerIconColumn)} />
          <th {...stylex.props(styles.headerInputColumn)}>
            <Trans i18nKey="variables.static-options.value-header">Value</Trans>
          </th>
          <th {...stylex.props(styles.headerInputColumn)}>
            <Trans i18nKey="variables.static-options.label-header">Display text</Trans>
          </th>
          <th {...stylex.props(styles.headerIconColumn)} />
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

// The table rules in VariableStaticOptionsFormItems.css also style the rows VariableStaticOptionsFormItemEditor renders,
// and outrank these header widths, as before.
const styles = stylex.create({
  headerIconColumn: {
    width: '1%',
  },
  headerInputColumn: {
    width: '49%',
  },
});
