import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import * as stylex from '@stylexjs/stylex';
import { type ReactNode } from 'react';

import { useTheme2 } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { SIDEBAR_CARD_HEIGHT, SIDEBAR_CARD_SPACING } from '../../../constants';
import { draggableItemMarker } from '../markers.stylex';

import { useDropIndicator } from './useDropIndicator';

import './DraggableList.css';

interface DraggableListProps<T> {
  droppableId: string;
  items: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  onDragStart?: () => void;
  onDragEnd: (result: DropResult) => void;
}

export function DraggableList<T>({
  droppableId,
  items,
  keyExtractor,
  renderItem,
  onDragStart,
  onDragEnd,
}: DraggableListProps<T>) {
  const theme = useTheme2();

  const { indicator, containerRef, handleBeforeCapture, handleDragStart, handleDragUpdate, handleDragEnd } =
    useDropIndicator({
      itemHeight: SIDEBAR_CARD_HEIGHT,
      itemSpacing: theme.spacing.gridSize * SIDEBAR_CARD_SPACING,
      onDragStart,
      onDragEnd,
    });

  return (
    <DragDropContext
      onBeforeCapture={handleBeforeCapture}
      onDragStart={handleDragStart}
      onDragUpdate={handleDragUpdate}
      onDragEnd={handleDragEnd}
    >
      <Droppable droppableId={droppableId} direction="vertical">
        {(dropProvided) => (
          <div
            ref={(el) => {
              dropProvided.innerRef(el);
              containerRef.current = el;
            }}
            {...dropProvided.droppableProps}
            className={stylex.props(styles.droppable).className}
          >
            {items.map((item, index) => {
              const key = keyExtractor(item);
              return (
                <Draggable key={key} draggableId={key} index={index}>
                  {(dragProvided, dragSnapshot) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                      className={
                        mergeStylexProps(stylex.props(styles.draggableItem, draggableItemMarker), {
                          className: 'gf-query-editor-draggable-item',
                        }).className
                      }
                      data-is-dragging={dragSnapshot.isDragging || undefined}
                    >
                      {renderItem(item)}
                    </div>
                  )}
                </Draggable>
              );
            })}
            {indicator && (
              <div {...stylex.props(styles.dropIndicator)} style={{ top: indicator.top, height: indicator.height }} />
            )}
            {dropProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

const styles = stylex.create({
  droppable: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  draggableItem: {
    // SIDEBAR_CARD_SPACING in ../../../constants.ts
    marginBottom: { default: spacing['--gf-spacing-x1'], ':last-child': 0 },
  },
  dropIndicator: {
    position: 'absolute',
    // SIDEBAR_CARD_INDENT in ../../../constants.ts
    left: spacing['--gf-spacing-x2'],
    right: spacing['--gf-spacing-x2'],
    backgroundColor: colors['--gf-colors-primary-transparent'],
    pointerEvents: 'none',
    borderRadius: shape['--gf-shape-radius-default'],
    overflow: 'hidden',
    '::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 3,
      backgroundColor: colors['--gf-colors-primary-border'],
    },
  },
});
