import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import * as stylex from '@stylexjs/stylex';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { type SceneObject } from '@grafana/scenes';
import { ScrollContainer, Sidebar } from '@grafana/ui';
import { shape, spacing } from '@grafana/ui/stylex/tokens.stylex';
import addPanelImg from 'img/dashboards/add-panel.png';

import { useClipboardState } from '../../scene/layouts-shared/useClipboardState';
import { getDashboardSceneFor } from '../../utils/utils';

import { AddAnnotationQuery } from './AddAnnotationQuery';
import { AddButton } from './AddButton';
import { AddFilters } from './AddFilters';
import { AddLink } from './AddLink';
import { AddNewSection } from './AddNewSection';
import { AddRow } from './AddRow';
import { AddTab } from './AddTab';
import { AddVariable } from './AddVariable';

interface AddNewEditPaneProps {
  dashboard: SceneObject;
  selectedElement: SceneObject | undefined;
  onAddPanel: () => void;
  onPastePanel: () => void;
}

export function AddNewEditPane({ onAddPanel, onPastePanel, dashboard, selectedElement }: AddNewEditPaneProps) {
  const { hasCopiedPanel } = useClipboardState();
  const dashboardScene = getDashboardSceneFor(dashboard);
  const orchestrator = dashboardScene.state.layoutOrchestrator;

  const onStartDragging = (result: { draggableId: string }) => {
    const mode = result.draggableId === 'paste-panel-drag' ? 'paste' : 'newPanel';
    orchestrator.startDraggingNewPanel(mode);
  };

  return (
    <div {...stylex.props(styles.wrapper)}>
      <Sidebar.PaneHeader title={t('dashboard.add.pane-header', 'Add')} />
      <ScrollContainer showScrollIndicators={true}>
        <AddNewSection
          title={t('dashboard.add.new-panel.title', 'Panel')}
          description={t('dashboard.add.new-panel.description', 'Drag or click to add a panel')}
        >
          <DragDropContext onDragStart={onStartDragging} onDragEnd={() => {}}>
            <Droppable droppableId="side-drop-id" isDropDisabled>
              {(dropProvided) => (
                <div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
                  <Draggable draggableId="new-panel-drag" index={0}>
                    {(dragProvided) => {
                      return (
                        <div
                          role="button"
                          data-testid={selectors.components.Sidebar.newPanelButton}
                          tabIndex={0}
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          className={stylex.props(styles.imageContainer).className}
                          onClick={onAddPanel}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onAddPanel();
                            }
                          }}
                          aria-label={t('dashboard.add.new-panel.title', 'Panel')}
                        >
                          <img
                            alt={t('dashboard.add.new-panel.button', 'Add new panel button')}
                            src={addPanelImg}
                            draggable={false}
                          />
                        </div>
                      );
                    }}
                  </Draggable>
                  {hasCopiedPanel && (
                    <Draggable
                      draggableId="paste-panel-drag"
                      index={1}
                      isDragDisabled={!hasCopiedPanel}
                      disableInteractiveElementBlocking={true}
                    >
                      {(dragProvided, _) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                        >
                          <AddButton
                            className={stylex.props(styles.pasteButton).className}
                            icon="clipboard-alt"
                            tabIndex={0}
                            onClick={onPastePanel}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onPastePanel();
                              }
                            }}
                            aria-label={t('dashboard.canvas-actions.add.paste.title', 'Paste panel')}
                            label={t('dashboard.canvas-actions.add.paste.title', 'Paste panel')}
                            tooltip={t(
                              'dashboard.canvas-actions.add.paste.description',
                              'Click or drag to paste panel'
                            )}
                          ></AddButton>
                        </div>
                      )}
                    </Draggable>
                  )}
                  {dropProvided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </AddNewSection>
        <AddNewSection title={t('dashboard-scene.add-new-edit-pane.group-layouts', 'Group layouts')}>
          <AddRow dashboardScene={dashboardScene} selectedElement={selectedElement} />
          <AddTab dashboardScene={dashboardScene} selectedElement={selectedElement} />
        </AddNewSection>
        <AddNewSection title={t('dashboard-scene.dashboard-side-pane-new.dashboard-controls', 'Dashboard controls')}>
          {config.featureToggles.dashboardUnifiedDrilldownControls && <AddFilters dashboardScene={dashboardScene} />}
          <AddVariable dashboardScene={dashboardScene} selectedElement={selectedElement} />
          <AddAnnotationQuery dashboardScene={dashboardScene} />
          <AddLink dashboardScene={dashboardScene} />
        </AddNewSection>
      </ScrollContainer>
    </div>
  );
}

const styles = stylex.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    height: '100%',
  },
  imageContainer: {
    cursor: 'pointer',
    opacity: { default: 0.8, ':hover': 1 },
    overflow: 'hidden',
    borderRadius: shape['--gf-shape-radius-sm'],
    width: '100%',
  },
  pasteButton: {
    width: '100%',
    marginTop: spacing['--gf-spacing-x2'],
  },
});
