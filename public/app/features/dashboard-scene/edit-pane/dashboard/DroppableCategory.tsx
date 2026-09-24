import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { droppableCategoryStyles } from './DroppableCategory.stylex';
import { Droppable } from '@hello-pangea/dnd';
import { type ReactNode } from 'react';

import { OptionsPaneCategory } from 'app/features/dashboard/components/PanelEditor/OptionsPaneCategory';

interface DroppableCategoryProps {
  droppableId: string;
  title: string;
  children: ReactNode;
}

export function DroppableCategory({ droppableId, title, children }: DroppableCategoryProps) {


  return (
    <Droppable droppableId={droppableId} direction="vertical">
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          <OptionsPaneCategory id={droppableId} {...stylex.props(droppableCategoryStyles.category)} title={title}>
            {children}
            {provided.placeholder}
          </OptionsPaneCategory>
        </div>
      )}
    </Droppable>
  );
}


