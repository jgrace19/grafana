import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import * as stylex from '@stylexjs/stylex';
import { useCallback, useId, useMemo } from 'react';

import { VariableHide } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { t, Trans } from '@grafana/i18n';
import { type SceneObject, type SceneVariable, type SceneVariableSet } from '@grafana/scenes';
import { Box, Button, Icon, Stack, Text, Tooltip } from '@grafana/ui';
import { easings, motion } from '@grafana/ui/stylex/constants.stylex';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { OptionsPaneCategoryDescriptor } from 'app/features/dashboard/components/PanelEditor/OptionsPaneCategoryDescriptor';
import { OptionsPaneItemDescriptor } from 'app/features/dashboard/components/PanelEditor/OptionsPaneItemDescriptor';

import { partitionVariablesByDisplay } from '../../edit-pane/dashboard/DashboardVariablesList';
import { dashboardEditActions } from '../../edit-pane/shared';
import { DashboardScene } from '../../scene/DashboardScene';
import {
  type EditableDashboardElement,
  type EditableDashboardElementInfo,
  isEditableDashboardElement,
} from '../../scene/types/EditableDashboardElement';
import { DashboardInteractions } from '../../utils/interactions';
import { getDashboardSceneFor } from '../../utils/utils';
import { filterSectionRepeatLocalVariables } from '../../variables/utils';

import { openAddVariablePane } from './VariableTypeSelectionPane';
import { variableItemMarker } from './markers.stylex';
import { isEditableVariableType } from './utils';

function useEditPaneOptions(this: VariableSetEditableElement, set: SceneVariableSet): OptionsPaneCategoryDescriptor[] {
  const variableListId = useId();
  const options = useMemo(() => {
    return new OptionsPaneCategoryDescriptor({ title: '', id: 'variables' }).addItem(
      new OptionsPaneItemDescriptor({
        title: '',
        id: variableListId,
        skipField: true,
        render: () => <VariableList set={set} />,
      })
    );
  }, [set, variableListId]);

  return [options];
}

export class VariableSetEditableElement implements EditableDashboardElement {
  public readonly isEditableDashboardElement = true;
  public readonly typeName = 'Variable';

  public constructor(private set: SceneVariableSet) {}

  public getEditableElementInfo(): EditableDashboardElementInfo {
    return {
      typeName: t('dashboard.edit-pane.elements.variable-set', 'Variables'),
      icon: 'x',
      instanceName: t('dashboard.edit-pane.elements.variable-set', 'Variables'),
    };
  }

  public getOutlineChildren() {
    const { visible, controlsMenu, hidden } = partitionVariablesByDisplay(
      filterSectionRepeatLocalVariables(this.set.state.variables, this.set)
        // filter out system and snapshot variables
        .filter((variable) => isEditableVariableType(variable.state.type))
    );
    return [...visible, ...controlsMenu, ...hidden];
  }

  public scrollIntoView() {
    let current: SceneObject | undefined = this.set.parent;
    while (current) {
      if (isEditableDashboardElement(current) && current.scrollIntoView) {
        current.scrollIntoView();
        return;
      }
      current = current.parent;
    }
  }

  public useEditPaneOptions = useEditPaneOptions.bind(this, this.set);
}

export function VariableList({ set }: { set: SceneVariableSet }) {
  const { variables } = set.useState();

  const canAdd = set.parent instanceof DashboardScene;
  const onAddVariable = useCallback(() => {
    openAddVariablePane(getDashboardSceneFor(set));
    DashboardInteractions.addVariableButtonClicked({ source: 'edit_pane' });
  }, [set]);

  const onEditVariable = useCallback(
    (variable: SceneVariable) => {
      const { editPane } = getDashboardSceneFor(set).state;
      editPane.selectObject(variable);
    },
    [set]
  );

  const { editableVariables, nonEditableVariables } = useMemo(() => {
    const editableVariables: SceneVariable[] = [];
    const nonEditableVariables: SceneVariable[] = [];
    filterSectionRepeatLocalVariables(variables, set).forEach((variable) => {
      if (isEditableVariableType(variable.state.type)) {
        editableVariables.push(variable);
      } else {
        nonEditableVariables.push(variable);
      }
    });
    return {
      editableVariables,
      nonEditableVariables,
    };
  }, [variables, set]);

  const { visible, controlsMenu, hidden } = partitionVariablesByDisplay(editableVariables);

  const createDragEndHandler = useCallback(
    (sourceList: SceneVariable[], mergeLists: (updatedList: SceneVariable[]) => SceneVariable[]) => {
      return (result: DropResult) => {
        const currentList = set.state.variables;

        dashboardEditActions.edit({
          source: set,
          description: t(
            'dashboard-scene.variable-list.create-drag-end-handler.description.reorder-variables-list',
            'Reorder variables list'
          ),
          perform: () => {
            if (!result.destination || result.destination.index === result.source.index) {
              return;
            }

            DashboardInteractions.variablesReordered({ source: 'edit_pane' });

            const updatedList = [...sourceList];
            const [movedVariable] = updatedList.splice(result.source.index, 1);
            updatedList.splice(result.destination.index, 0, movedVariable);

            set.setState({
              variables: [...nonEditableVariables, ...mergeLists(updatedList)],
            });
          },
          undo: () => {
            set.setState({ variables: currentList });
          },
        });
      };
    },
    [nonEditableVariables, set]
  );

  const onVisibleDragEnd = useMemo(
    () => createDragEndHandler(visible, (updatedList) => [...updatedList, ...controlsMenu, ...hidden]),
    [createDragEndHandler, controlsMenu, hidden, visible]
  );

  const onControlsMenuDragEnd = useMemo(
    () => createDragEndHandler(controlsMenu, (updatedList) => [...visible, ...updatedList, ...hidden]),
    [createDragEndHandler, controlsMenu, hidden, visible]
  );

  const onHiddenDragEnd = useMemo(
    () => createDragEndHandler(hidden, (updatedList) => [...visible, ...controlsMenu, ...updatedList]),
    [createDragEndHandler, controlsMenu, hidden, visible]
  );

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    event.stopPropagation();
  }, []);

  const renderList = (list: SceneVariable[], droppableId: string) => (
    <Droppable droppableId={droppableId} direction="vertical">
      {(provided) => (
        <Stack ref={provided.innerRef} {...provided.droppableProps} direction="column" gap={0}>
          {list.map((variable, index) => (
            <Draggable
              key={variable.state.key ?? variable.state.name}
              draggableId={`${variable.state.key ?? variable.state.name}`}
              index={index}
            >
              {(draggableProvided) => (
                // TODO fix keyboard a11y here
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events
                <div
                  {...stylex.props(styles.variableItem, variableItemMarker)}
                  key={variable.state.name}
                  onClick={() => onEditVariable(variable)}
                  ref={draggableProvided.innerRef}
                  {...draggableProvided.draggableProps}
                >
                  <div {...stylex.props(styles.variableContent)}>
                    <div {...draggableProvided.dragHandleProps} onPointerDown={onPointerDown}>
                      <Tooltip content={t('dashboard.edit-pane.variables.reorder', 'Drag to reorder')} placement="top">
                        <Icon name="draggabledots" size="md" xstyle={styles.dragHandle} />
                      </Tooltip>
                    </div>
                    <Text>${variable.state.name}</Text>
                    {variable.state.hide === VariableHide.hideVariable && (
                      <Icon name="eye-slash" size="sm" xstyle={styles.hiddenIcon} />
                    )}
                    {variable.state.hide === VariableHide.inControlsMenu && (
                      <Icon name="sliders-v-alt" size="sm" xstyle={styles.hiddenIcon} />
                    )}
                  </div>
                  <Stack direction="row" gap={1} alignItems="center">
                    <Button
                      variant="primary"
                      size="sm"
                      fill="outline"
                      className={stylex.props(styles.selectButton).className}
                    >
                      <Trans i18nKey="dashboard.edit-pane.variables.select-variable">Select</Trans>
                    </Button>
                  </Stack>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </Stack>
      )}
    </Droppable>
  );

  return (
    <Stack direction="column" gap={1}>
      <DragDropContext onDragEnd={onVisibleDragEnd}>{renderList(visible, 'variables-outline-visible')}</DragDropContext>
      {controlsMenu.length > 0 && (
        <DragDropContext onDragEnd={onControlsMenuDragEnd}>
          {renderList(controlsMenu, 'variables-outline-controls')}
        </DragDropContext>
      )}
      {hidden.length > 0 && (
        <DragDropContext onDragEnd={onHiddenDragEnd}>{renderList(hidden, 'variables-outline-hidden')}</DragDropContext>
      )}
      {canAdd && (
        <Box paddingBottom={1} paddingTop={1} display={'flex'}>
          <Button
            fullWidth
            icon="plus"
            size="sm"
            variant="secondary"
            onClick={onAddVariable}
            data-testid={selectors.components.PanelEditor.ElementEditPane.addVariableButton}
          >
            <Trans i18nKey="dashboard.edit-pane.variables.add-variable">Add variable</Trans>
          </Button>
        </Box>
      )}
    </Stack>
  );
}

const styles = stylex.create({
  variableItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing['--gf-spacing-x1'],
    padding: spacing['--gf-spacing-x0-5'],
    borderRadius: shape['--gf-shape-radius-default'],
    cursor: 'pointer',
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'color' },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: '250ms' },
    transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: easings.easeInOut },
    transitionDelay: { default: null, [motion.noPreferenceOrReduce]: '0ms' },
    color: { default: null, ':hover': colors['--gf-colors-text-link'] },
  },
  // Button doesn't set visibility itself, so a StyleX class can't conflict with it.
  selectButton: {
    visibility: { default: 'hidden', [stylex.when.ancestor(':hover', variableItemMarker)]: 'visible' },
  },
  variableContent: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x0-5'],
  },
  dragHandle: {
    display: 'flex',
    alignItems: 'center',
    cursor: { default: 'grab', ':active': 'grabbing' },
    color: colors['--gf-colors-text-secondary'],
  },
  hiddenIcon: {
    color: colors['--gf-colors-text-secondary'],
    marginLeft: spacing['--gf-spacing-x1'],
  },
});
