import { Draggable } from '@hello-pangea/dnd';
import * as stylex from '@stylexjs/stylex';
import { type ChangeEventHandler } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { Icon, IconButton, Input, Stack } from '@grafana/ui';

import './VariableStaticOptionsFormItemEditor.css';

export interface VariableStaticOptionsFormItem {
  id: string;
  label: string;
  value: string;
}

interface VariableStaticOptionsFormItemEditorProps {
  item: VariableStaticOptionsFormItem;
  index: number;
  onChange: (item: VariableStaticOptionsFormItem) => void;
  onRemove: (item: VariableStaticOptionsFormItem) => void;
}

export function VariableStaticOptionsFormItemEditor({
  item,
  index,
  onChange,
  onRemove,
}: VariableStaticOptionsFormItemEditorProps) {
  const handleValueChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    if (item.value !== evt.currentTarget.value) {
      onChange({ ...item, value: evt.currentTarget.value });
    }
  };

  const handleLabelChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    if (item.label !== evt.currentTarget.value) {
      onChange({ ...item, label: evt.currentTarget.value });
    }
  };

  const handleRemove = () => onRemove(item);

  return (
    <Draggable draggableId={item.id} index={index}>
      {(draggableProvided) => (
        <tr
          ref={draggableProvided.innerRef}
          data-testid={selectors.pages.Dashboard.Settings.Variables.Edit.StaticOptionsEditor.row}
          {...draggableProvided.draggableProps}
        >
          <td>
            <Stack
              direction="row"
              alignItems="center"
              data-testid={selectors.pages.Dashboard.Settings.Variables.Edit.StaticOptionsEditor.moveButton}
              {...draggableProvided.dragHandleProps}
            >
              <Icon
                title={t('variables.static-options.drag-and-drop', 'Drag and drop to reorder')}
                name="draggabledots"
                size="lg"
                className="gf-variable-static-option-drag-icon"
                xstyle={styles.dragIcon}
              />
            </Stack>
          </td>
          <td>
            <Input
              value={item.value}
              placeholder={t('variables.static-options.value-placeholder', 'Value')}
              onChange={handleValueChange}
              data-testid={selectors.pages.Dashboard.Settings.Variables.Edit.StaticOptionsEditor.valueInput}
            />
          </td>
          <td>
            <Input
              value={item.label}
              placeholder={t('variables.static-options.label-placeholder', 'Defaults to value')}
              onChange={handleLabelChange}
              data-testid={selectors.pages.Dashboard.Settings.Variables.Edit.StaticOptionsEditor.labelInput}
            />
          </td>
          <td>
            <Stack direction="row" alignItems="center">
              <IconButton
                name="trash-alt"
                aria-label={t('variables.static-options.remove-option-button-label', 'Remove option')}
                onClick={handleRemove}
                data-testid={selectors.pages.Dashboard.Settings.Variables.Edit.StaticOptionsEditor.deleteButton}
              />
            </Stack>
          </td>
        </tr>
      )}
    </Draggable>
  );
}

// The row focus ring drawn from the drag handle lives in VariableStaticOptionsFormItemEditor.css.
const styles = stylex.create({
  dragIcon: {
    cursor: 'grab',
  },
});
