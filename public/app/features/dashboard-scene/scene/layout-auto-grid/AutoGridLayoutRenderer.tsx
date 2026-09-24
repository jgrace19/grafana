import * as stylex from '@stylexjs/stylex';
import { useMemo } from 'react';
import { useMedia } from 'react-use';

import { selectors } from '@grafana/e2e-selectors';
import { type SceneComponentProps, sceneGraph } from '@grafana/scenes';
import { useTheme2 } from '@grafana/ui';

import { isRepeatCloneOrChildOf } from '../../utils/clone';
import { getTestIdForLayout } from '../../utils/test-utils';
import { useDashboardState } from '../../utils/utils';
import { useSoloPanelContext } from '../SoloPanelContext';
import { CanvasGridAddActions } from '../layouts-shared/CanvasGridAddActions';
import { DASHBOARD_DROP_TARGET_KEY_ATTR } from '../types/DashboardDropTarget';

import { type AutoGridLayout, type AutoGridLayoutState } from './AutoGridLayout';
import { AutoGridLayoutManager } from './AutoGridLayoutManager';
import { autoGridLayoutRendererStyles } from './AutoGridLayoutRenderer.stylex';

function useGridContainerStyle(state: AutoGridLayoutState) {
  const theme = useTheme2();
  const isMdDown = useMedia('(max-width: 768.95px)');

  return useMemo(() => {
    const base: React.CSSProperties = {
      display: 'grid',
      gridTemplateColumns: state.templateColumns,
      gridTemplateRows: state.templateRows || 'unset',
      gridAutoRows: state.autoRows || 'unset',
      rowGap: theme.spacing(state.rowGap ?? 1),
      columnGap: theme.spacing(state.columnGap ?? 1),
      justifyItems: state.justifyItems || 'unset',
      alignItems: state.alignItems || 'unset',
      justifyContent: state.justifyContent || 'unset',
    };

    if (state.md && isMdDown) {
      Object.assign(base, {
        gridTemplateRows: state.md.templateRows,
        gridTemplateColumns: state.md.templateColumns,
        rowGap: state.md.rowGap ? theme.spacing(state.md.rowGap ?? 1) : base.rowGap,
        columnGap: state.md.columnGap ? theme.spacing(state.md.columnGap ?? 1) : base.columnGap,
        justifyItems: state.md.justifyItems ?? base.justifyItems,
        alignItems: state.md.alignItems ?? base.alignItems,
        justifyContent: state.md.justifyContent ?? base.justifyContent,
      });
    }

    return base;
  }, [state, theme, isMdDown]);
}

export function AutoGridLayoutRenderer({ model }: SceneComponentProps<AutoGridLayout>) {
  const layoutState = model.useState();
  const { children, isHidden } = layoutState;
  const gridStyle = useGridContainerStyle(layoutState);

  const {
    layoutOrchestrator,
    isEditing,
    meta: { isEmbedded },
  } = useDashboardState(model);
  const layoutManager = sceneGraph.getAncestor(model, AutoGridLayoutManager);
  const { fillScreen, dropPosition } = layoutManager.useState();
  const soloPanelContext = useSoloPanelContext();

  if (isHidden || !layoutOrchestrator) {
    return null;
  }

  const showCanvasActions = !isEmbedded && !isRepeatCloneOrChildOf(model) && isEditing;

  if (soloPanelContext) {
    return children.map((item) => <item.Component key={item.state.key} model={item} />);
  }

  const renderChildren = () => {
    if (dropPosition === null || dropPosition === undefined) {
      return children.map((item) => <item.Component key={item.state.key} model={item} />);
    }

    const result: React.ReactNode[] = [];
    const insertPosition = Math.min(dropPosition, children.length);

    for (let i = 0; i <= children.length; i++) {
      if (i === insertPosition) {
        result.push(<DropPlaceholder key="drop-placeholder" />);
      }
      if (i < children.length) {
        const item = children[i];
        result.push(<item.Component key={item.state.key} model={item} />);
      }
    }

    return result;
  };

  return (
    <div
      data-testid={selectors.components.LayoutContainer(getTestIdForLayout(model))}
      {...stylex.props(
        autoGridLayoutRendererStyles.container,
        fillScreen && autoGridLayoutRendererStyles.containerFillScreen,
        isEditing && autoGridLayoutRendererStyles.containerEditing
      )}
      style={gridStyle}
      ref={model.containerRef}
      {...{ [DASHBOARD_DROP_TARGET_KEY_ATTR]: layoutManager.state.key }}
    >
      {renderChildren()}
      {showCanvasActions && <CanvasGridAddActions layoutManager={layoutManager} />}
    </div>
  );
}

function DropPlaceholder() {
  return <div {...stylex.props(autoGridLayoutRendererStyles.dropPlaceholder)} />;
}
