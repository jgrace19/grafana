import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { draggableListStyles } from './DraggableList.stylex';
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import { type ReactNode } from 'react';

import {useTheme2} from '@grafana/ui';

import { SIDEBAR_CARD_HEIGHT, SIDEBAR_CARD_INDENT, SIDEBAR_CARD_SPACING } from '../../../constants';

import { useDropIndicator } from './useDropIndicator';

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
            {...stylex.props(draggableListStyles.droppable)}
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
                      {...stylex.props(draggableListStyles.draggableItem)}
                      data-is-dragging={dragSnapshot.isDragging || undefined}
                    >
                      {renderItem(item)}
                    </div>
                  )}
                </Draggable>
              );
            })}
            {indicator && (
              <div {...stylex.props(draggableListStyles.dropIndicator)} style={{ top: indicator.top, height: indicator.height }} />
            )}
            {dropProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}


