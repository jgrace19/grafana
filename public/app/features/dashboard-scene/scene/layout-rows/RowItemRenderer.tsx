import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { rowItemRendererStyles } from './RowItemRenderer.stylex';
import { Draggable } from '@hello-pangea/dnd';
import { useBooleanFlagValue } from '@openfeature/react-sdk';
import { useCallback, useState } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { type SceneComponentProps } from '@grafana/scenes';
import { clearButtonStyles, Icon, Tooltip, useElementSelection, usePointerDistance } from '@grafana/ui';

import { useIsConditionallyHidden } from '../../conditional-rendering/hooks/useIsConditionallyHidden';
import { isRepeatCloneOrChildOf } from '../../utils/clone';
import { useDashboardState, useInterpolatedTitle } from '../../utils/utils';
import { DashboardScene } from '../DashboardScene';
import { useSoloPanelContext } from '../SoloPanelContext';
import { SectionVariableControls } from '../VariableControls';
import { DASHBOARD_DROP_TARGET_KEY_ATTR } from '../types/DashboardDropTarget';
import { isDashboardLayoutGrid } from '../types/DashboardLayoutGrid';

import { type RowItem } from './RowItem';

export function RowItemRenderer({ model }: SceneComponentProps<RowItem>) {
  const {
    layout,
    collapse,
    fillScreen,
    hideHeader: isHeaderHidden,
    isDropTarget,
    key,
    repeatSourceKey,
  } = model.useState();
  const isCollapsed = collapse && !isHeaderHidden; // never allow a row without a header to be collapsed
  const isClone = isRepeatCloneOrChildOf(model);
  const { isEditing } = useDashboardState(model);
  const [isConditionallyHidden, conditionalRenderingClass, conditionalRenderingOverlay] = useIsConditionallyHidden(
    model.state.conditionalRendering
  );
  const { isSelected, onSelect, isSelectable, onClear: onClearSelection } = useElementSelection(key);
  const { isSelected: isSourceSelected } = useElementSelection(repeatSourceKey);
  const title = useInterpolatedTitle(model);
  const { rows } = model.getParentLayout().useState();
  const clearStyles = (clearButtonStyles);
  const isTopLevel = model.parent?.parent instanceof DashboardScene;
  const pointerDistance = usePointerDistance();
  const soloPanelContext = useSoloPanelContext();
  const sectionVariablesEnabled = useBooleanFlagValue('dashboardSectionVariables', false);
  const rowVariablesSet = model.state.$variables;

  const myIndex = rows.findIndex((row) => row === model);

  const shouldGrow = !isCollapsed && fillScreen;
  const isHidden = isConditionallyHidden && !isEditing;

  // Highlight the full row when hovering over header
  const [selectableHighlight, setSelectableHighlight] = useState(false);
  const onHeaderEnter = useCallback(() => setSelectableHighlight(true), []);
  const onHeaderLeave = useCallback(() => setSelectableHighlight(false), []);

  const isDraggable = !isClone && isEditing;

  if (isHidden) {
    return null;
  }

  if (soloPanelContext) {
    return <layout.Component model={layout} />;
  }

  const titleElement = (
    <span
      {...mergeStylexClassName(stylex.props(rowItemRendererStyles.rowTitle,
        isHeaderHidden && rowItemRendererStyles.rowTitleHidden,
        !isTopLevel && rowItemRendererStyles.rowTitleNested,
        isCollapsed && rowItemRendererStyles.rowTitleCollapsed
      ), undefined)}
      data-testid={selectors.components.DashboardRow.title(title)}
    >
      {!model.hasUniqueTitle() && (
        <Tooltip content={t('dashboard.rows-layout.row-warning.title-not-unique', 'This title is not unique')}>
          <Icon name="exclamation-triangle" />
        </Tooltip>
      )}
      {title}
      {isHeaderHidden && (
        <Tooltip content={t('dashboard.rows-layout.header-hidden-tooltip', 'Row header only visible in edit mode')}>
          <Icon name="eye-slash" />
        </Tooltip>
      )}
    </span>
  );

  return (
    <Draggable key={key!} draggableId={key!} index={myIndex} isDragDisabled={!isDraggable}>
      {(dragProvided, dragSnapshot) => (
        <div
          ref={(ref) => {
            dragProvided.innerRef(ref);
            model.containerRef.current = ref;
          }}
          {...{ [DASHBOARD_DROP_TARGET_KEY_ATTR]: isDashboardLayoutGrid(layout) ? model.state.key : undefined }}
          className={cx(
            rowItemRendererStyles.wrapper,
            'dashboard-row-wrapper',
            !isCollapsed && rowItemRendererStyles.wrapperNotCollapsed,
            dragSnapshot.isDragging && rowItemRendererStyles.dragging,
            isCollapsed && rowItemRendererStyles.wrapperCollapsed,
            shouldGrow && rowItemRendererStyles.wrapperGrow,
            conditionalRenderingClass,
            !isSelected && !isSourceSelected && selectableHighlight && 'dashboard-selectable-element',
            (isSelected || isSourceSelected) && 'dashboard-selected-element',
            isDropTarget && 'dashboard-drop-target'
          )}
          onPointerDown={(evt) => {
            evt.stopPropagation();
            pointerDistance.set(evt);
          }}
          onPointerUp={(evt) => {
            // If we selected and are clicking a button inside row header then don't de-select row
            if (evt.target instanceof Element && evt.target.closest('button')) {
              // Stop propagation otherwise dashboaed level onPointerDown will de-select row
              evt.stopPropagation();
              return;
            }

            if (pointerDistance.check(evt)) {
              return;
            }

            setTimeout(() => onSelect?.(evt));
          }}
          data-testid={selectors.components.DashboardRow.wrapper(title!)}
          {...dragProvided.draggableProps}
        >
          {(!isHeaderHidden || isEditing) && (
            <div
              {...mergeStylexClassName(stylex.props(rowItemRendererStyles.rowHeader, 'dashboard-row-header'), undefined)}
              onMouseEnter={isSelectable ? onHeaderEnter : undefined}
              onMouseLeave={isSelectable ? onHeaderLeave : undefined}
              {...dragProvided.dragHandleProps}
            >
              <button
                onClick={(evt) => {
                  model.onCollapseToggle();
                  onClearSelection?.();
                }}
                {...mergeStylexClassName(stylex.props(rowItemRendererStyles.rowTitleButton, clearStyles, ), undefined)}
                aria-label={
                  isCollapsed
                    ? t('dashboard.rows-layout.row.expand', 'Expand row {{title}}', { title })
                    : t('dashboard.rows-layout.row.collapse', 'Collapse row {{title}}', { title })
                }
                data-testid={selectors.components.DashboardRow.toggle(title)}
              >
                <Icon name={isCollapsed ? 'angle-right' : 'angle-down'} />
                {!isEditing && titleElement}
              </button>
              {isEditing && titleElement}
              {isDraggable && <Icon name="draggabledots" className="dashboard-row-header-drag-handle" />}
            </div>
          )}
          {!isCollapsed && (
            <div>
              {sectionVariablesEnabled && rowVariablesSet && <SectionVariableControls variableSet={rowVariablesSet} />}
              <layout.Component model={layout} />
            </div>
          )}
          {conditionalRenderingOverlay}
        </div>
      )}
    </Draggable>
  );
}

