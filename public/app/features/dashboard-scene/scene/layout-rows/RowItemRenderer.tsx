import { Draggable } from '@hello-pangea/dnd';
import { useBooleanFlagValue } from '@openfeature/react-sdk';
import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { useCallback, useState } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { type SceneComponentProps } from '@grafana/scenes';
import { Icon, Tooltip, useElementSelection, usePointerDistance } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { motion } from '@grafana/ui/stylex/constants.stylex';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { useIsConditionallyHidden } from '../../conditional-rendering/hooks/useIsConditionallyHidden';
import { isRepeatCloneOrChildOf } from '../../utils/clone';
import { useDashboardState, useInterpolatedTitle } from '../../utils/utils';
import { DashboardScene } from '../DashboardScene';
import { useSoloPanelContext } from '../SoloPanelContext';
import { SectionVariableControls } from '../VariableControls';
import { DASHBOARD_DROP_TARGET_KEY_ATTR } from '../types/DashboardDropTarget';
import { isDashboardLayoutGrid } from '../types/DashboardLayoutGrid';

import { type RowItem } from './RowItem';
import { rowHeaderMarker } from './markers.stylex';

import '../layouts-shared/canvasControls.global.css';

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
  const isHeaderRendered = !isHeaderHidden || isEditing;

  if (isHidden) {
    return null;
  }

  if (soloPanelContext) {
    return <layout.Component model={layout} />;
  }

  const titleElement = (
    <span
      {...stylex.props(
        styles.rowTitle,
        isHeaderHidden && styles.rowTitleHidden,
        !isTopLevel && styles.rowTitleNested,
        isCollapsed && styles.rowTitleCollapsed
      )}
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
          {...mergeStylexProps(
            stylex.props(
              styles.wrapper,
              dragSnapshot.isDragging && styles.dragging,
              isCollapsed && styles.wrapperCollapsed,
              shouldGrow && styles.wrapperGrow
            ),
            {
              className: clsx(
                'gf-row-item',
                'dashboard-row-wrapper',
                conditionalRenderingClass,
                !isSelected && !isSourceSelected && selectableHighlight && 'dashboard-selectable-element',
                (isSelected || isSourceSelected) && 'dashboard-selected-element',
                isDropTarget && 'dashboard-drop-target'
              ),
            }
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
          {isHeaderRendered && (
            <div
              {...mergeStylexProps(
                stylex.props(styles.rowHeader, isCollapsed && styles.rowHeaderCollapsed, rowHeaderMarker),
                { className: 'dashboard-row-header' }
              )}
              onMouseEnter={isSelectable ? onHeaderEnter : undefined}
              onMouseLeave={isSelectable ? onHeaderLeave : undefined}
              {...dragProvided.dragHandleProps}
            >
              <button
                onClick={(evt) => {
                  model.onCollapseToggle();
                  onClearSelection?.();
                }}
                {...stylex.props(styles.rowTitleButton)}
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
              {isDraggable && (
                <Icon name="draggabledots" className="dashboard-row-header-drag-handle" xstyle={styles.dragHandle} />
              )}
            </div>
          )}
          {!isCollapsed && (
            <div {...stylex.props(isHeaderRendered && styles.content)}>
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

// The `.dashboard-canvas-controls` hover rules live in layouts-shared/canvasControls.global.css.
const styles = stylex.create({
  rowHeader: {
    display: 'flex',
    gap: spacing['--gf-spacing-x1'],
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x0-5'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing['--gf-spacing-x1'],
  },
  rowHeaderCollapsed: {
    marginBottom: spacing['--gf-spacing-x0'],
  },
  dragHandle: {
    opacity: { default: 0, [stylex.when.ancestor(':hover', rowHeaderMarker)]: 1 },
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'opacity' },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: '0.25s' },
  },
  // Includes clearButtonStyles.
  rowTitleButton: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: colors['--gf-colors-text-primary'],
    borderStyle: 'none',
    padding: 0,
    minWidth: 0,
    gap: spacing['--gf-spacing-x1'],
  },
  rowTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x2'],
    fontFamily: typography['--gf-typography-h5-font-family'],
    fontSize: typography['--gf-typography-h5-font-size'],
    lineHeight: typography['--gf-typography-h5-line-height'],
    letterSpacing: typography['--gf-typography-h5-letter-spacing'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    flexGrow: 1,
    minWidth: 0,
  },
  rowTitleHidden: {
    textDecoration: 'line-through',
    opacity: { default: 0.6, ':hover': 1 },
  },
  rowTitleNested: {
    fontSize: typography['--gf-typography-body-font-size'],
    fontWeight: typography['--gf-typography-font-weight-regular'],
  },
  rowTitleCollapsed: {
    color: colors['--gf-colors-text-secondary'],
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    // Without this min height, the custom grid (SceneGridLayout) wont render
    // should be 1px more than row header + padding + margin
    // consist of lineHeight + paddingBlock + margin + 0.125 = 39px
    minHeight: `calc(${spacing['--gf-spacing-grid-size']} * 4.875)`,
  },
  // The row content, when it follows the header.
  content: {
    marginLeft: spacing['--gf-spacing-x3'],
    position: 'relative',
    width: 'auto',
    '::before': {
      content: '""',
      position: 'absolute',
      top: '-8px',
      bottom: 0,
      left: '-16px',
      width: '1px',
      backgroundColor: colors['--gf-colors-border-weak'],
    },
  },
  dragging: {
    cursor: 'move',
    backgroundColor: colors['--gf-colors-background-canvas'],
  },
  wrapperGrow: {
    flexGrow: 1,
  },
  wrapperCollapsed: {
    flexGrow: 0,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
    minHeight: 'unset',
  },
});
