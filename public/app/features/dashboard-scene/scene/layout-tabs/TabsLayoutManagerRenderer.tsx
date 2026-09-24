import { DragDropContext, Droppable, type DropResult, type DragStart } from '@hello-pangea/dnd';
import * as stylex from '@stylexjs/stylex';
import { useEffect, useMemo } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { Trans } from '@grafana/i18n';
import { MultiValueVariable, type SceneComponentProps, sceneGraph, useSceneObjectState } from '@grafana/scenes';
import { Button, TabsBar } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { isRepeatCloneOrChildOf } from '../../utils/clone';
import { getDashboardSceneFor, getLayoutOrchestratorFor } from '../../utils/utils';
import { useSoloPanelContext } from '../SoloPanelContext';
import { layoutControlsStyles } from '../layouts-shared/styles';
import { useClipboardState } from '../layouts-shared/useClipboardState';
import { DASHBOARD_DROP_TARGET_KEY_ATTR } from '../types/DashboardDropTarget';

import { TabItem } from './TabItem';
import { TabItemLayoutRenderer } from './TabItemRenderer';
import { TabItemRepeater } from './TabItemRepeater';
import { type TabsLayoutManager } from './TabsLayoutManager';

import '../layouts-shared/canvasControls.global.css';

export function TabsLayoutManagerRenderer({ model }: SceneComponentProps<TabsLayoutManager>) {
  const { tabs, key, placeholder, isDropTarget } = model.useState();
  const currentTab = model.getCurrentTab();
  const dashboard = getDashboardSceneFor(model);
  const orchestrator = getLayoutOrchestratorFor(model);
  const { isEditing } = dashboard.useState();
  const { hasCopiedTab } = useClipboardState();
  const isNestedInTab = useMemo(() => model.parent instanceof TabItem, [model.parent]);
  const soloPanelContext = useSoloPanelContext();

  useEffect(() => {
    if (currentTab && currentTab.getSlug() !== model.state.currentTabSlug) {
      model.setState({ currentTabSlug: currentTab.getSlug() });
    }
  }, [currentTab, model]);

  if (soloPanelContext) {
    return tabs.map((tab) => <TabWrapper tab={tab} manager={model} key={tab.state.key!} />);
  }

  const isClone = isRepeatCloneOrChildOf(model);

  const onBeforeDragStart = (start: DragStart) => {
    const sourceTabsManagerId = start.source.droppableId;
    const draggedTabId = start.draggableId;
    orchestrator?.startTabDrag(sourceTabsManagerId, draggedTabId);
  };

  const onDragEnd = (result: DropResult) => {
    const targetIndex = result.destination?.index;
    orchestrator?.stopTabDrag(targetIndex);
  };

  let placeholderComponent: React.ReactNode | null = null;

  const children: React.ReactNode[] = tabs.map((tab) => <TabWrapper tab={tab} manager={model} key={tab.state.key!} />);

  if (isDropTarget && placeholder) {
    placeholderComponent = (
      <div key="placeholder" style={{ width: placeholder.width, height: placeholder.height }}></div>
    );
    children.splice(placeholder.index, 0, placeholderComponent);
  }

  return (
    <div {...stylex.props(styles.tabLayoutContainer, isNestedInTab && styles.nestedTabsMargin)}>
      <TabsBar className="gf-tabs-bar">
        <DragDropContext onBeforeDragStart={onBeforeDragStart} onDragEnd={onDragEnd}>
          <div {...stylex.props(styles.tabsRow)} {...{ [DASHBOARD_DROP_TARGET_KEY_ATTR]: key }}>
            <Droppable droppableId={key!} direction="horizontal">
              {(dropProvided) => (
                <div
                  {...stylex.props(styles.tabsContainer)}
                  ref={dropProvided.innerRef}
                  {...dropProvided.droppableProps}
                >
                  {children}

                  {dropProvided.placeholder}
                </div>
              )}
            </Droppable>
            {isEditing && !isClone && (
              <div
                {...mergeStylexProps(stylex.props(styles.tabControls, layoutControlsStyles.controls), {
                  className: 'dashboard-canvas-controls',
                })}
              >
                <Button
                  icon="plus"
                  variant="secondary"
                  size="sm"
                  onClick={() => model.addNewTab()}
                  onPointerUp={(evt) => evt.stopPropagation()}
                  data-testid={selectors.components.CanvasGridAddActions.addTab}
                >
                  <Trans i18nKey="dashboard.canvas-actions.new-tab">New tab</Trans>
                </Button>
                {hasCopiedTab && (
                  <Button
                    icon="clipboard-alt"
                    variant="secondary"
                    size="sm"
                    onClick={() => model.pasteTab()}
                    onPointerUp={(evt) => evt.stopPropagation()}
                    data-testid={selectors.components.CanvasGridAddActions.pasteTab}
                  >
                    <Trans i18nKey="dashboard.canvas-actions.paste-tab">Paste tab</Trans>
                  </Button>
                )}
                <Button
                  icon="layers-slash"
                  variant="secondary"
                  size="sm"
                  onClick={() => model.ungroupTabs()}
                  data-testid={selectors.components.CanvasGridAddActions.ungroup}
                >
                  <Trans i18nKey="dashboard.canvas-actions.ungroup-tabs">Ungroup tabs</Trans>
                </Button>
              </div>
            )}
          </div>
        </DragDropContext>
      </TabsBar>

      {currentTab && <TabItemLayoutRenderer tab={currentTab} isEditing={isEditing} />}
    </div>
  );
}

function TabWrapper({ tab, manager }: { tab: TabItem; manager: TabsLayoutManager }) {
  const { repeatByVariable } = useSceneObjectState(tab, { shouldActivateOrKeepAlive: true });

  if (repeatByVariable) {
    const variable = sceneGraph.lookupVariable(repeatByVariable, manager);

    if (variable instanceof MultiValueVariable) {
      return <TabItemRepeater tab={tab} key={tab.state.key!} manager={manager} variable={variable} />;
    }
  }
  return <tab.Component model={tab} key={tab.state.key!} />;
}

// Hovering the tabs bar shows its add-tab controls (canvasControls.global.css).
const styles = stylex.create({
  tabLayoutContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    flexShrink: '1',
    flexBasis: 'auto',
  },
  tabsRow: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
  },
  tabsContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    overflowX: 'auto',
    overflowY: 'hidden',
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 0.125)`,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 0.125)`,
    paddingTop: '1px',
  },
  tabControls: {
    marginLeft: spacing['--gf-spacing-x1'],
  },
  nestedTabsMargin: {
    marginLeft: spacing['--gf-spacing-x2'],
  },
});
