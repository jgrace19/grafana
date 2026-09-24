import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { annotationListStyles } from './AnnotationList.stylex';
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import { useCallback, useMemo } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t, Trans } from '@grafana/i18n';
import { type SceneDataLayerProvider } from '@grafana/scenes';
import {Box, Button, Icon, Stack, Text, Tooltip} from '@grafana/ui';

import { partitionAnnotationsByDisplay } from '../../edit-pane/dashboard/DashboardAnnotationsList';
import { dashboardEditActions } from '../../edit-pane/shared';
import { type DashboardDataLayerSet } from '../../scene/DashboardDataLayerSet';
import { DashboardScene } from '../../scene/DashboardScene';
import { DashboardInteractions } from '../../utils/interactions';
import { getDashboardSceneFor } from '../../utils/utils';

import { annotationEditActions } from './actions';

export function AnnotationList({ dataLayerSet }: { dataLayerSet: DashboardDataLayerSet }) {
  const { annotationLayers } = dataLayerSet.useState();

  const canAdd = dataLayerSet.parent instanceof DashboardScene;

  const onSelectAnnotation = useCallback(
    (layer: SceneDataLayerProvider) => {
      const { editPane } = getDashboardSceneFor(dataLayerSet).state;
      editPane.selectObject(layer);
    },
    [dataLayerSet]
  );

  const onAddAnnotation = useCallback(() => {
    const newAnnotation = dataLayerSet.createDefaultAnnotationLayer();

    annotationEditActions.addAnnotation({
      source: dataLayerSet,
      addedObject: newAnnotation,
    });

    DashboardInteractions.addAnnotationButtonClicked({ source: 'edit_pane' });
  }, [dataLayerSet]);

  const { visible, controlsMenu, hidden } = useMemo(
    () => partitionAnnotationsByDisplay(annotationLayers),
    [annotationLayers]
  );

  const createDragEndHandler = useCallback(
    (
      sourceList: SceneDataLayerProvider[],
      mergeLists: (updatedList: SceneDataLayerProvider[]) => SceneDataLayerProvider[]
    ) => {
      return (result: DropResult) => {
        const currentList = dataLayerSet.state.annotationLayers;

        dashboardEditActions.edit({
          source: dataLayerSet,
          description: t(
            'dashboard-scene.annotation-list.create-drag-end-handler.description.reorder-annotations-list',
            'Reorder annotations list'
          ),
          perform: () => {
            if (!result.destination || result.destination.index === result.source.index) {
              return;
            }

            const updatedList = [...sourceList];
            const [movedLayer] = updatedList.splice(result.source.index, 1);
            updatedList.splice(result.destination.index, 0, movedLayer);

            dataLayerSet.setState({ annotationLayers: mergeLists(updatedList) });
            DashboardInteractions.annotationsReordered({ source: 'edit_pane' });
          },
          undo: () => {
            dataLayerSet.setState({ annotationLayers: currentList });
          },
        });
      };
    },
    [dataLayerSet]
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

  const renderList = (list: SceneDataLayerProvider[], droppableId: string) => (
    <Droppable droppableId={droppableId} direction="vertical">
      {(provided) => (
        <Stack ref={provided.innerRef} {...provided.droppableProps} direction="column" gap={0}>
          {list.map((layer, index) => (
            <Draggable key={layer.state.key} draggableId={`${layer.state.key}`} index={index}>
              {(draggableProvided) => (
                <div
                  key={layer.state.key}
                  {...stylex.props(annotationListStyles.annotationItem)}
                  ref={draggableProvided.innerRef}
                  {...draggableProvided.draggableProps}
                >
                  <div
                    {...stylex.props(annotationListStyles.annotationContent)}
                    aria-label={t('dashboard-scene.annotation-list.render-list.aria-label-annotation', 'Annotation')}
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectAnnotation(layer)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectAnnotation(layer);
                      }
                    }}
                  >
                    <div {...draggableProvided.dragHandleProps} onPointerDown={onPointerDown}>
                      <Tooltip
                        content={t('dashboard.edit-pane.annotations.reorder', 'Drag to reorder')}
                        placement="top"
                      >
                        <Icon name="draggabledots" size="md" {...stylex.props(annotationListStyles.dragHandle)} />
                      </Tooltip>
                    </div>
                    <Text truncate>{layer.state.name}</Text>
                    {layer.state.isHidden && <Icon name="eye-slash" size="sm" {...stylex.props(annotationListStyles.hiddenIcon)} />}
                    {layer.state.placement === 'inControlsMenu' && (
                      <Icon name="sliders-v-alt" size="sm" {...stylex.props(annotationListStyles.hiddenIcon)} />
                    )}
                  </div>
                  <Stack direction="row" gap={1} alignItems="center">
                    <Button variant="primary" size="sm" fill="outline">
                      <Trans i18nKey="dashboard.edit-pane.annotations.select-annotation">Select</Trans>
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
    <Stack direction="column" gap={0}>
      <DragDropContext onDragEnd={onVisibleDragEnd}>
        {renderList(visible, 'annotations-outline-visible')}
      </DragDropContext>
      {controlsMenu.length > 0 && (
        <DragDropContext onDragEnd={onControlsMenuDragEnd}>
          {renderList(controlsMenu, 'annotations-outline-controls-menu')}
        </DragDropContext>
      )}
      {hidden.length > 0 && (
        <DragDropContext onDragEnd={onHiddenDragEnd}>
          {renderList(hidden, 'annotations-outline-hidden')}
        </DragDropContext>
      )}
      {canAdd && (
        <Box paddingBottom={1} paddingTop={1} display={'flex'}>
          <Button
            fullWidth
            icon="plus"
            size="sm"
            variant="secondary"
            onClick={onAddAnnotation}
            data-testid={selectors.components.PanelEditor.ElementEditPane.addAnnotationButton}
          >
            <Trans i18nKey="dashboard.edit-pane.annotations.add-annotation">Add annotation</Trans>
          </Button>
        </Box>
      )}
    </Stack>
  );
}


