import { DragDropContext, Droppable, type BeforeCapture, type DropResult } from '@hello-pangea/dnd';
import * as stylex from '@stylexjs/stylex';
import { useCallback } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { Trans } from '@grafana/i18n';
import { MultiValueVariable, type SceneComponentProps, sceneGraph, useSceneObjectState } from '@grafana/scenes';
import { Button } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { isRepeatCloneOrChildOf } from '../../utils/clone';
import { useDashboardState, getLayoutOrchestratorFor } from '../../utils/utils';
import { useSoloPanelContext } from '../SoloPanelContext';
import { layoutControlsStyles } from '../layouts-shared/styles';
import { useClipboardState } from '../layouts-shared/useClipboardState';
import { DASHBOARD_DROP_TARGET_KEY_ATTR } from '../types/DashboardDropTarget';

import { type RowItem } from './RowItem';
import { RowItemRepeater } from './RowItemRepeater';
import { type RowsLayoutManager } from './RowsLayoutManager';

import '../layouts-shared/canvasControls.global.css';

export function RowLayoutManagerRenderer({ model }: SceneComponentProps<RowsLayoutManager>) {
  const { rows, key } = model.useState();
  const { isEditing } = useDashboardState(model);
  const { hasCopiedRow } = useClipboardState();
  const soloPanelContext = useSoloPanelContext();
  const orchestrator = getLayoutOrchestratorFor(model);

  // Only act as a drop target when empty (no rows)
  const showAsDropTarget = rows.length === 0;

  const handleBeforeCapture = useCallback(
    (before: BeforeCapture) => {
      const row = rows.find((r) => r.state.key === before.draggableId);
      if (row && orchestrator) {
        orchestrator.startRowDrag(row);
      }
    },
    [rows, orchestrator]
  );

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      // Stop tracking row drag in orchestrator
      orchestrator?.stopRowDrag();

      if (!result.destination) {
        return;
      }

      if (result.destination.index === result.source.index) {
        return;
      }

      model.moveRow(result.draggableId, result.source.index, result.destination.index);
    },
    [model, orchestrator]
  );

  if (soloPanelContext) {
    return rows.map((row) => <RowWrapper row={row} manager={model} key={row.state.key!} />);
  }

  const isClone = isRepeatCloneOrChildOf(model);

  return (
    <DragDropContext
      onBeforeCapture={handleBeforeCapture}
      onBeforeDragStart={(start) => model.forceSelectRow(start.draggableId)}
      onDragEnd={handleDragEnd}
    >
      <Droppable droppableId={key!} direction="vertical">
        {(dropProvided) => (
          <div
            {...mergeStylexProps(stylex.props(styles.wrapper), { className: 'gf-rows-layout' })}
            ref={dropProvided.innerRef}
            {...dropProvided.droppableProps}
            {...(showAsDropTarget ? { [DASHBOARD_DROP_TARGET_KEY_ATTR]: key } : {})}
          >
            {rows.map((row) => (
              <RowWrapper row={row} manager={model} key={row.state.key!} />
            ))}
            {dropProvided.placeholder}
            {isEditing && !isClone && (
              <div
                {...mergeStylexProps(stylex.props(layoutControlsStyles.controls), {
                  className: 'dashboard-canvas-controls',
                })}
              >
                <Button
                  icon="plus"
                  variant="secondary"
                  size="sm"
                  onClick={() => model.addNewRow()}
                  onPointerUp={(evt) => evt.stopPropagation()}
                  data-testid={selectors.components.CanvasGridAddActions.addRow}
                >
                  <Trans i18nKey="dashboard.canvas-actions.new-row">New row</Trans>
                </Button>
                {hasCopiedRow && (
                  <Button
                    icon="clipboard-alt"
                    variant="secondary"
                    size="sm"
                    onClick={() => model.pasteRow()}
                    onPointerUp={(evt) => evt.stopPropagation()}
                    data-testid={selectors.components.CanvasGridAddActions.pasteRow}
                  >
                    <Trans i18nKey="dashboard.canvas-actions.paste-row">Paste row</Trans>
                  </Button>
                )}
                <Button
                  icon="layers-slash"
                  variant="secondary"
                  size="sm"
                  onClick={() => model.ungroupRows()}
                  data-testid={selectors.components.CanvasGridAddActions.ungroupRows}
                >
                  <Trans i18nKey="dashboard.canvas-actions.ungroup-rows">Ungroup rows</Trans>
                </Button>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

function RowWrapper({ row, manager }: { row: RowItem; manager: RowsLayoutManager }) {
  const { repeatByVariable } = useSceneObjectState(row, { shouldActivateOrKeepAlive: true });

  if (repeatByVariable) {
    const variable = sceneGraph.lookupVariable(repeatByVariable, manager);

    if (variable instanceof MultiValueVariable) {
      return <RowItemRepeater row={row} key={row.state.key!} manager={manager} variable={variable} />;
    }
  }

  return <row.Component model={row} key={row.state.key!} />;
}

// Hovering anywhere in the layout shows its own add-row controls (canvasControls.global.css).
const styles = stylex.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['--gf-spacing-x1'],
    flexGrow: 1,
    width: '100%',
  },
});
