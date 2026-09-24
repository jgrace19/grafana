import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { tabItemRendererStyles } from './TabItemRenderer.stylex';
import { Draggable, type DraggableStateSnapshot } from '@hello-pangea/dnd';
import { useBooleanFlagValue } from '@openfeature/react-sdk';
import { useLocation } from 'react-router';

import { t } from '@grafana/i18n';
import { locationService } from '@grafana/runtime';
import { type SceneComponentProps } from '@grafana/scenes';
import { Box, Icon, Tab, TabContent, Tooltip, useElementSelection, usePointerDistance } from '@grafana/ui';

import { useIsConditionallyHidden } from '../../conditional-rendering/hooks/useIsConditionallyHidden';
import { isRepeatCloneOrChildOf } from '../../utils/clone';
import { getDashboardSceneFor, interpolateSectionTitle, useDashboardState } from '../../utils/utils';
import { useSoloPanelContext } from '../SoloPanelContext';
import { SectionVariableControls } from '../VariableControls';
import { DASHBOARD_DROP_TARGET_KEY_ATTR } from '../types/DashboardDropTarget';

import { type TabItem } from './TabItem';

export function TabItemRenderer({ model }: SceneComponentProps<TabItem>) {
  const { title, isDropTarget, layout, key, repeatSourceKey } = model.useState();
  const parentLayout = model.getParentLayout();
  const { currentTabSlug, isDropTarget: isParentDropTarget } = parentLayout.useState();
  const titleInterpolated = interpolateSectionTitle(model, title);

  const { isSelected, onSelect, isSelectable, onClear: onClearSelection } = useElementSelection(key);
  const { isSelected: isSourceSelected } = useElementSelection(repeatSourceKey);
  const { isEditing } = useDashboardState(model);
  const mySlug = model.getSlug();
  const urlKey = parentLayout.getUrlKey();
  const isActive = mySlug === currentTabSlug;
  const myIndex = parentLayout.getTabsIncludingRepeats().findIndex((tab) => tab === model);
  const location = useLocation();
  const href = textUtil.sanitize(locationUtil.getUrlForPartial(location, { [urlKey]: mySlug }));
  const pointerDistance = usePointerDistance();
  const [isConditionallyHidden] = useIsConditionallyHidden(model.state.conditionalRendering);
  const isClone = isRepeatCloneOrChildOf(model);
  const soloPanelContext = useSoloPanelContext();

  const isDraggable = !isClone && isEditing;

  if (isConditionallyHidden && !isEditing && !isActive) {
    return null;
  }

  if (soloPanelContext) {
    return <layout.Component model={layout} />;
  }

  let titleCollisionProps = {};

  if (!model.hasUniqueTitle()) {
    titleCollisionProps = {
      icon: 'exclamation-triangle',
      tooltip: t('dashboard.tabs-layout.tab-warning.title-not-unique', 'This title is not unique'),
    };
  }

  return (
    <Draggable key={key!} draggableId={key!} index={myIndex} isDragDisabled={!isDraggable}>
      {(dragProvided, dragSnapshot) => (
        <div
          ref={(ref) => {
            dragProvided.innerRef(ref);
          }}
          {...stylex.props(dragSnapshot.isDragging && tabItemRendererStyles.dragging)}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
          style={getDraggableStyle(dragProvided.draggableProps.style, dragSnapshot)}
        >
          <Tab
            ref={model.containerRef}
            truncate
            className={cx(
              isConditionallyHidden && tabItemRendererStyles.hidden,
              // !isParentDropTarget prevents highlighting tabs during drag (we use a placeholder instead)
              isSelectable && !isSelected && !isSourceSelected && !isParentDropTarget && 'dashboard-selectable-element',
              (isSelected || isSourceSelected) && !isParentDropTarget && 'dashboard-selected-element',
              (isSelected || isSourceSelected) && tabItemRendererStyles.selectedTab,
              isDropTarget && 'dashboard-drop-target'
            )}
            active={isActive}
            title={titleInterpolated}
            suffix={isConditionallyHidden ? IsHiddenSuffix : undefined}
            href={href}
            aria-selected={isActive}
            onChangeTab={(evt) => {
              evt.preventDefault();

              const dashboard = getDashboardSceneFor(model);
              dashboard.rememberScrollPos();

              // When switching tabs, React unmounts old content and mounts new content.
              // This causes the browser to adjust scroll position if we're at the bottom of the page.
              // We use MutationObserver to detect when React has committed the DOM changes,
              // then restore scroll after the browser has completed its layout adjustments.
              const observer = new MutationObserver(() => {
                observer.disconnect();
                requestAnimationFrame(() => {
                  dashboard.restoreScrollPos();
                });
              });
              observer.observe(document.body, { childList: true, subtree: true });

              locationService.partial({ [urlKey]: mySlug });
            }}
            onPointerDown={(evt) => {
              evt.stopPropagation();
              pointerDistance.set(evt);
            }}
            onPointerUp={(evt) => {
              evt.stopPropagation();

              if (!isSelectable || pointerDistance.check(evt)) {
                return;
              }

              if (!isActive) {
                onClearSelection?.();
                return;
              }

              onSelect?.(evt);
            }}
            label={titleInterpolated}
            data-tab-activation-key={key}
            {...titleCollisionProps}
          />
        </div>
      )}
    </Draggable>
  );
}

function IsHiddenSuffix() {
  return (
    <Box paddingLeft={1} display={'inline'}>
      <Tooltip content={t('dashboard.conditional-rendering.overlay.tooltip', 'Element is hidden by show/hide rules.')}>
        <Icon name="eye-slash" />
      </Tooltip>
    </Box>
  );
}

interface TabItemLayoutRendererProps {
  tab: TabItem;
  isEditing?: boolean;
}

export function TabItemLayoutRenderer({ tab, isEditing }: TabItemLayoutRendererProps) {
  const { layout, key } = tab.useState();
  const [_, conditionalRenderingClass, conditionalRenderingOverlay] = useIsConditionallyHidden(
    tab.state.conditionalRendering
  );
  const sectionVariablesEnabled = useBooleanFlagValue('dashboardSectionVariables', false);
  const tabVariablesSet = tab.state.$variables;

  return (
    <TabContent
      {...mergeStylexClassName(stylex.props(tabItemRendererStyles.tabContentContainer, isEditing && conditionalRenderingClass), undefined)}
      {...{ [DASHBOARD_DROP_TARGET_KEY_ATTR]: key }}
    >
      {sectionVariablesEnabled && tabVariablesSet && <SectionVariableControls variableSet={tabVariablesSet} />}
      <layout.Component model={layout} />
      {isEditing && conditionalRenderingOverlay}
    </TabContent>
  );
}


/**
 * Disabling animation as per docs in https://github.com/hello-pangea/dnd/blob/main/docs/guides/drop-animation.md?#skipping-the-drop-animation
 *
 * > If you do have use case where it makes sense to remove the drop animation you will need to add a transition-duration
 * > property of **almost** 0s. This will skip the drop animation. Do not make the transition-duration actually 0s.
 * > It should be set at a near 0s value such as 0.001s. The reason for this is that if you set transition-duration to 0s
 * > then a onTransitionEnd event will not fire - and we use that to know when the drop animation is finished.
 *
 * We want to disable the drop to cover the case:
 * - A tab is dragged to a different tab manager
 * - DashboardLaoytOrchestrator takes care of handling the drag
 * - hello-pangea/dnd takes core only of dragging within the same tab manager, but doesn't know the tab was dropped
 *   into a different manager and creates a "snap back" animation of the tab going back to its original position
 */
function getDraggableStyle(style: React.CSSProperties | undefined, snapshot: DraggableStateSnapshot) {
  if (!style || !snapshot.isDropAnimating || !snapshot.dropAnimation) {
    return style;
  }

  return {
    ...style,
    transitionDuration: '0.01s',
  };
}
