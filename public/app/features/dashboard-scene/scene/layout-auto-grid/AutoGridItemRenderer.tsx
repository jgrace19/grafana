import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { memo, useMemo } from 'react';

import { LazyLoader, sceneGraph, type SceneComponentProps, type VizPanel } from '@grafana/scenes';
import { useElementSelection } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { type ConditionalRenderingGroup } from '../../conditional-rendering/group/ConditionalRenderingGroup';
import { useIsConditionallyHidden } from '../../conditional-rendering/hooks/useIsConditionallyHidden';
import { useDashboardState } from '../../utils/utils';
import { SoloPanelContextValueWithSearchStringFilter } from '../PanelSearchLayout';
import { useSoloPanelContext, renderMatchingSoloPanels } from '../SoloPanelContext';
import { getIsLazy } from '../layouts-shared/utils';
import { AUTO_GRID_ITEM_DROP_TARGET_ATTR } from '../types/DashboardDropTarget';

import { type AutoGridItem } from './AutoGridItem';
import { AutoGridLayoutManager } from './AutoGridLayoutManager';

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
              {...stylex.props(isConditionallyHidden && !isEditing && styles.hidden)}
            >
              {isDragged && <div {...stylex.props(styles.draggedPlaceholder)} />}
              {
                // The lazy loader causes issues when used with conditional rendering
                isLazy && (!isConditionallyHidden || !renderHidden) ? (
                  <LazyLoader
                    key={item.state.key!}
                    {...mergeStylexProps(
                      stylex.props(
                        styles.wrapper,
                        isDragged && !isRepeat && styles.draggedWrapper,
                        isDragged && isRepeat && styles.draggedRepeatWrapper
                      ),
                      { className: clsx(conditionalRenderingClass, isSelected && 'dashboard-selected-element') }
                    )}
                  >
                    <item.Component model={item} />
                    {conditionalRenderingOverlay}
                  </LazyLoader>
                ) : (
                  <div
                    {...mergeStylexProps(
                      stylex.props(
                        styles.wrapper,
                        isDragged && !isRepeat && styles.draggedWrapper,
                        isDragged && isRepeat && styles.draggedRepeatWrapper
                      ),
                      { className: clsx(conditionalRenderingClass, isSelected && 'dashboard-selected-element') }
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
    [model, isLazy, key, isEditing]
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

// StyleX ranks above the layered `.dashboard-visible-hidden-element { position: relative }` global rule, so the dragged
// wrapper keeps its absolute position without a compound selector. The custom properties are the DRAGGED_ITEM_* names
// from ./const, which stylex.create can't import.
const styles = stylex.create({
  wrapper: { width: '100%', height: '100%', position: 'relative' },
  draggedWrapper: {
    position: 'absolute',
    zIndex: 1000,
    top: 'var(--responsive-grid-dragged-item-top)',
    left: 'var(--responsive-grid-dragged-item-left)',
    width: 'var(--responsive-grid-dragged-item-width)',
    height: 'var(--responsive-grid-dragged-item-height)',
    opacity: 0.8,
  },
  draggedRepeatWrapper: {
    visibility: 'hidden',
  },
  draggedPlaceholder: {
    width: '100%',
    height: '100%',
    boxShadow: `0 0 ${spacing['--gf-spacing-x0-5']} ${colors['--gf-colors-primary-border']}`,
    backgroundColor: colors['--gf-colors-primary-transparent'],
    zIndex: -1,
  },
  hidden: {
    display: 'none',
  },
});
