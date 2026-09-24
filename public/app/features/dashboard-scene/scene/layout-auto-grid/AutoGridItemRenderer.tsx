import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { autoGridItemRendererStyles } from './AutoGridItemRenderer.stylex';
import { memo, useMemo } from 'react';

import { LazyLoader, sceneGraph, type SceneComponentProps, type VizPanel } from '@grafana/scenes';
import {useElementSelection} from '@grafana/ui';

import { type ConditionalRenderingGroup } from '../../conditional-rendering/group/ConditionalRenderingGroup';
import { useIsConditionallyHidden } from '../../conditional-rendering/hooks/useIsConditionallyHidden';
import { useDashboardState } from '../../utils/utils';
import { SoloPanelContextValueWithSearchStringFilter } from '../PanelSearchLayout';
import { useSoloPanelContext, renderMatchingSoloPanels } from '../SoloPanelContext';
import { getIsLazy } from '../layouts-shared/utils';
import { AUTO_GRID_ITEM_DROP_TARGET_ATTR } from '../types/DashboardDropTarget';

import { type AutoGridItem } from './AutoGridItem';
import { AutoGridLayoutManager } from './AutoGridLayoutManager';
import { DRAGGED_ITEM_HEIGHT, DRAGGED_ITEM_LEFT, DRAGGED_ITEM_TOP, DRAGGED_ITEM_WIDTH } from './const';

export function AutoGridItemRenderer({ model }: SceneComponentProps<AutoGridItem>) {
  const { body, repeatedPanels = [], key } = model.useState();
  const { draggingKey } = model.getParentGrid().useState();
  const { isEditing, preload } = useDashboardState(model);

  const soloPanelContext = useSoloPanelContext();
  const isLazy = useMemo(() => getIsLazy(preload), [preload]);

  // Check if this grid is a drop target for external drags
  const layoutManager = sceneGraph.getAncestor(model, AutoGridLayoutManager);
  const { isDropTarget } = layoutManager.useState();

  const Wrapper = useMemo(
    () =>
      // eslint-disable-next-line react/display-name
      memo(
        ({
          item,
          conditionalRendering,
          addDndContainer,
          isDragged,
          showDropTarget,
          isRepeat = false,
          isSelected = false,
        }: {
          item: VizPanel;
          conditionalRendering?: ConditionalRenderingGroup;
          addDndContainer: boolean;
          isDragged: boolean;
          showDropTarget: boolean;
          isRepeat?: boolean;
          isSelected?: boolean;
        }) => {
          const [isConditionallyHidden, conditionalRenderingClass, conditionalRenderingOverlay, renderHidden] =
            useIsConditionallyHidden(conditionalRendering);

          return isConditionallyHidden && !isEditing && !renderHidden ? null : (
            <div
              {...(addDndContainer
                ? { ref: model.containerRef, [AUTO_GRID_ITEM_DROP_TARGET_ATTR]: showDropTarget ? key : undefined }
                : {})}
              className={cx(isConditionallyHidden && !isEditing && autoGridItemRendererStyles.hidden)}
            >
              {isDragged && <div {...stylex.props(autoGridItemRendererStyles.draggedPlaceholder)} />}
              {
                // The lazy loader causes issues when used with conditional rendering
                isLazy && (!isConditionallyHidden || !renderHidden) ? (
                  <LazyLoader
                    key={item.state.key!}
                    className={cx(
                      conditionalRenderingClass,
                      autoGridItemRendererStyles.wrapper,
                      isDragged && !isRepeat && autoGridItemRendererStyles.draggedWrapper,
                      isDragged && isRepeat && autoGridItemRendererStyles.draggedRepeatWrapper,
                      isSelected && 'dashboard-selected-element'
                    )}
                  >
                    <item.Component model={item} />
                    {conditionalRenderingOverlay}
                  </LazyLoader>
                ) : (
                  <div
                    className={cx(
                      conditionalRenderingClass,
                      autoGridItemRendererStyles.wrapper,
                      isDragged && !isRepeat && autoGridItemRendererStyles.draggedWrapper,
                      isDragged && isRepeat && autoGridItemRendererStyles.draggedRepeatWrapper,
                      isSelected && 'dashboard-selected-element'
                    )}
                  >
                    <item.Component model={item} />
                    {conditionalRenderingOverlay}
                  </div>
                )
              }
            </div>
          );
        }
      ),
    [model, isLazy, key, styles, isEditing]
  );

  const { isSelected: isSourceSelected } = useElementSelection(body.state.key);

  if (soloPanelContext) {
    // Use lazy loading only for panel search layout (SoloPanelContextValueWithSearchStringFilter)
    // as it renders multiple panels in a grid. Skip lazy loading for viewPanel URL param
    // (SoloPanelContextWithPathIdFilter) since single panels should render immediately.
    const useLazyForSoloPanel = isLazy && soloPanelContext instanceof SoloPanelContextValueWithSearchStringFilter;
    return renderMatchingSoloPanels(soloPanelContext, [body, ...repeatedPanels], useLazyForSoloPanel);
  }

  const isDragging = !!draggingKey;
  const isDragged = draggingKey === key;
  // Show drop target attribute for both internal drags and external drags (when this grid is a drop target)
  const showDropTarget = isDragging || !!isDropTarget;

  return (
    <>
      <Wrapper
        item={body}
        conditionalRendering={model.state.conditionalRendering}
        addDndContainer={true}
        key={body.state.key!}
        isDragged={isDragged}
        showDropTarget={showDropTarget}
      />
      {repeatedPanels.map((item, idx) => (
        <Wrapper
          item={item}
          conditionalRendering={model.state.repeatedConditionalRendering?.[idx]}
          addDndContainer={false}
          key={item.state.key!}
          isDragged={isDragged}
          showDropTarget={showDropTarget}
          isRepeat={true}
          isSelected={isSourceSelected}
        />
      ))}
    </>
  );
}

