import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { variableEditorListRowStyles } from './VariableEditorListRow.stylex';
import { Draggable } from '@hello-pangea/dnd';
import { type ReactElement } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { Button, Icon, IconButton, useTheme2 } from '@grafana/ui';

import { hasOptions } from '../guard';
import { VariableUsagesButton } from '../inspect/VariableUsagesButton';
import { type UsagesToNetwork, type VariableUsageTree } from '../inspect/types';
import { getVariableUsages } from '../inspect/utils';
import { type KeyedVariableIdentifier } from '../state/types';
import { toKeyedVariableIdentifier } from '../utils';

export interface VariableEditorListRowProps {
  index: number;
  variable: TypedVariableModel;
  usageTree: VariableUsageTree[];
  usagesNetwork: UsagesToNetwork[];
  onEdit: (identifier: KeyedVariableIdentifier) => void;
  onDuplicate: (identifier: KeyedVariableIdentifier) => void;
  onDelete: (identifier: KeyedVariableIdentifier) => void;
}

export function VariableEditorListRow({
  index,
  variable,
  usageTree,
  usagesNetwork,
  onEdit: propsOnEdit,
  onDuplicate: propsOnDuplicate,
  onDelete: propsOnDelete,
}: VariableEditorListRowProps): ReactElement {
  const theme = useTheme2();

  const definition = getDefinition(variable);
  const usages = getVariableUsages(variable.id, usageTree);
  const passed = usages > 0 || variable.type === 'adhoc';
  const identifier = toKeyedVariableIdentifier(variable);

  return (
    <Draggable draggableId={JSON.stringify(identifier)} index={index}>
      {(provided, snapshot) => (
        <tr
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            userSelect: snapshot.isDragging ? 'none' : 'auto',
            background: snapshot.isDragging ? theme.colors.background.secondary : undefined,
            ...provided.draggableProps.style,
          }}
        >
          <td role="gridcell" {...stylex.props(variableEditorListRowStyles.column)}>
            <Button
              size="xs"
              fill="text"
              onClick={(event) => {
                event.preventDefault();
                propsOnEdit(identifier);
              }}
              {...stylex.props(variableEditorListRowStyles.nameLink)}
              data-testid={selectors.pages.Dashboard.Settings.Variables.List.tableRowNameFields(variable.name)}
            >
              {variable.name}
            </Button>
          </td>
          <td
            role="gridcell"
            {...stylex.props(variableEditorListRowStyles.definitionColumn)}
            onClick={(event) => {
              event.preventDefault();
              propsOnEdit(identifier);
            }}
            data-testid={selectors.pages.Dashboard.Settings.Variables.List.tableRowDefinitionFields(variable.name)}
          >
            {definition}
          </td>

          <td role="gridcell" {...stylex.props(variableEditorListRowStyles.column)}>
            <div {...stylex.props(variableEditorListRowStyles.icons)}>
              <VariableCheckIndicator passed={passed} />
              <VariableUsagesButton id={variable.id} isAdhoc={variable.type === 'adhoc'} usages={usagesNetwork} />
              <IconButton
                onClick={(event) => {
                  event.preventDefault();
                  reportInteraction('Duplicate variable');
                  propsOnDuplicate(identifier);
                }}
                name="copy"
                tooltip={t('variables.variable-editor-list-row.tooltip-duplicate-variable', 'Duplicate variable')}
                data-testid={selectors.pages.Dashboard.Settings.Variables.List.tableRowDuplicateButtons(variable.name)}
              />
              <IconButton
                onClick={(event) => {
                  event.preventDefault();
                  reportInteraction('Delete variable');
                  propsOnDelete(identifier);
                }}
                name="trash-alt"
                tooltip={t('variables.variable-editor-list-row.tooltip-remove-variable', 'Remove variable')}
                data-testid={selectors.pages.Dashboard.Settings.Variables.List.tableRowRemoveButtons(variable.name)}
              />
              <div {...provided.dragHandleProps} {...stylex.props(variableEditorListRowStyles.dragHandle)}>
                <Icon
                  name="draggabledots"
                  size="lg"
                  title={t(
                    'variables.variable-editor-list-row.drag-handle-label',
                    'Reorder variable {{variableName}}',
                    { variableName: variable.name }
                  )}
                />
              </div>
            </div>
          </td>
        </tr>
      )}
    </Draggable>
  );
}

function getDefinition(model: TypedVariableModel): string {
  let definition = '';
  if (model.type === 'query') {
    if (model.definition) {
      definition = model.definition;
    } else if (typeof model.query === 'string') {
      definition = model.query;
    }
  } else if (hasOptions(model)) {
    definition = model.query;
  }

  return definition;
}

interface VariableCheckIndicatorProps {
  passed: boolean;
}

function VariableCheckIndicator({ passed }: VariableCheckIndicatorProps): ReactElement {

  if (passed) {
    return (
      <Icon
        name="check"
        {...stylex.props(variableEditorListRowStyles.iconPassed)}
        title={t(
          'variables.variable-check-indicator.title-variable-referenced-other-variables-dashboard',
          'This variable is referenced by other variables or dashboard.'
        )}
      />
    );
  }

  return (
    <Icon
      name="exclamation-triangle"
      {...stylex.props(variableEditorListRowStyles.iconFailed)}
      title={t(
        'variables.variable-check-indicator.title-variable-referenced-dashboard',
        'This variable is not referenced by any variable or dashboard.'
      )}
    />
  );
}

