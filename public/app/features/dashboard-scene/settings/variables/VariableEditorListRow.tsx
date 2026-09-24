import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { variableEditorListRowStyles } from './VariableEditorListRow.stylex';
import { Draggable } from '@hello-pangea/dnd';
import { type ReactElement, useState } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { type SceneVariable } from '@grafana/scenes';
import {Button, ConfirmModal, Icon, IconButton, Tooltip, useTheme2} from '@grafana/ui';

import { VariableUsagesButton } from '../../variables/VariableUsagesButton';
import { type UsagesToNetwork, type VariableUsageTree, getVariableUsages } from '../../variables/utils';

import { getDefinition } from './utils';

export interface VariableEditorListRowProps {
  index: number;
  variable: SceneVariable;
  usageTree: VariableUsageTree[];
  usagesNetwork: UsagesToNetwork[];
  onEdit: (identifier: string) => void;
  onDuplicate: (identifier: string) => void;
  onDelete: (identifier: string) => void;
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
  const variableState = variable.state;
  const identifier = variableState.name;
  const usages = getVariableUsages(identifier, usageTree);
  const passed = usages > 0 || variableState.type === 'adhoc';
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleDeleteVariableModal = (show: boolean) => () => {
    setShowDeleteModal(show);
  };
  const onDeleteVariable = () => {
    reportInteraction('Delete variable');
    propsOnDelete(identifier);
  };

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
              data-testid={selectors.pages.Dashboard.Settings.Variables.List.tableRowNameFields(variableState.name)}
            >
              {variableState.name}
            </Button>
          </td>
          <td
            role="gridcell"
            {...stylex.props(variableEditorListRowStyles.definitionColumn)}
            onClick={(event) => {
              event.preventDefault();
              propsOnEdit(identifier);
            }}
            data-testid={selectors.pages.Dashboard.Settings.Variables.List.tableRowDefinitionFields(variableState.name)}
          >
            {definition}
          </td>

          <td role="gridcell" {...stylex.props(variableEditorListRowStyles.column)}>
            <div {...stylex.props(variableEditorListRowStyles.icons)}>
              <VariableCheckIndicator passed={passed} />
              <VariableUsagesButton
                id={variableState.name}
                isAdhoc={variableState.type === 'adhoc'}
                usages={usagesNetwork}
              />
              <IconButton
                onClick={(event) => {
                  event.preventDefault();
                  reportInteraction('Duplicate variable');
                  propsOnDuplicate(identifier);
                }}
                name="copy"
                tooltip={t('dashboard-scene.variable-editor-list-row.tooltip-duplicate-variable', 'Duplicate variable')}
                data-testid={selectors.pages.Dashboard.Settings.Variables.List.tableRowDuplicateButtons(
                  variableState.name
                )}
              />
              <IconButton
                onClick={(event) => {
                  event.preventDefault();
                  setShowDeleteModal(true);
                }}
                name="trash-alt"
                tooltip={t('dashboard-scene.variable-editor-list-row.tooltip-remove-variable', 'Remove variable')}
                data-testid={selectors.pages.Dashboard.Settings.Variables.List.tableRowRemoveButtons(
                  variableState.name
                )}
              />
              <ConfirmModal
                isOpen={showDeleteModal}
                title={t('dashboard-scene.variable-editor-list-row.title-delete-variable', 'Delete variable')}
                body={t(
                  'dashboard-scene.variable-editor-list-row.body-delete-variable',
                  'Are you sure you want to delete: {{variable}}?',
                  { variable: variableState.name }
                )}
                confirmText={t(
                  'dashboard-scene.variable-editor-list-row.confirmText-delete-variable',
                  'Delete variable'
                )}
                onConfirm={onDeleteVariable}
                onDismiss={handleDeleteVariableModal(false)}
              />

              <div {...provided.dragHandleProps} {...stylex.props(variableEditorListRowStyles.dragHandle)}>
                <Icon
                  name="draggabledots"
                  size="lg"
                  title={t(
                    'dashboard-scene.variable-editor-list-row.drag-handle-label',
                    'Reorder variable {{variableName}}',
                    { variableName: variableState.name }
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

interface VariableCheckIndicatorProps {
  passed: boolean;
}

function VariableCheckIndicator({ passed }: VariableCheckIndicatorProps): ReactElement {


  if (passed) {
    return (
      <Tooltip
        content={t(
          'dashboard-scene.variable-check-indicator.content-variable-referenced-other-variables-dashboard',
          'This variable is referenced by other variables or dashboard.'
        )}
      >
        <Icon
          name="check"
          {...stylex.props(variableEditorListRowStyles.iconPassed)}
          aria-label={t(
            'dashboard-scene.variable-check-indicator.aria-label-variable-referenced-other-variables-dashboard',
            'This variable is referenced by other variables or dashboard.'
          )}
        />
      </Tooltip>
    );
  }

  return (
    <Tooltip
      content={t(
        'dashboard-scene.variable-check-indicator.content-variable-not-referenced-other-variables-dashboard',
        'This variable is not referenced by other variables or dashboard.'
      )}
    >
      <Icon
        name="exclamation-triangle"
        {...stylex.props(variableEditorListRowStyles.iconFailed)}
        aria-label={t(
          'dashboard-scene.variable-check-indicator.aria-label-variable-referenced-dashboard',
          'This variable is not referenced by any variable or dashboard.'
        )}
      />
    </Tooltip>
  );
}


