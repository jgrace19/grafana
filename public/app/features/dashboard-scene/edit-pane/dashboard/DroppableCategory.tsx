import { Droppable } from '@hello-pangea/dnd';
import { type ReactNode } from 'react';

import { OptionsPaneCategory } from 'app/features/dashboard/components/PanelEditor/OptionsPaneCategory';

import './DroppableCategory.css';

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
          <OptionsPaneCategory id={droppableId} className="gf-droppable-category" title={title}>
            {children}
            {provided.placeholder}
          </OptionsPaneCategory>
        </div>
      )}
    </Droppable>
  );
}
