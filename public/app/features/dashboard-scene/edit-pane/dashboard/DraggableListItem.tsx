import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { draggableListItemStyles } from './DraggableListItem.stylex';
import { Draggable } from '@hello-pangea/dnd';
import { type ReactNode } from 'react';

import { t } from '@grafana/i18n';
import {Tooltip, Icon} from '@grafana/ui';

interface DraggableListItemProps {
  draggableId: string;
  index: number;
  children: ReactNode;
}

export function DraggableListItem({ draggableId, index, children }: DraggableListItemProps) {


  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided) => (
        <li ref={provided.innerRef} {...provided.draggableProps} {...stylex.props(draggableListItemStyles.listItem)}>
          <div {...provided.dragHandleProps} {...stylex.props(draggableListItemStyles.dragHandle)}>
            <Tooltip content={t('dashboard-scene.draggable-item.drag-to-reorder', 'Drag to reorder')} placement="top">
              <Icon name="draggabledots" size="md" />
            </Tooltip>
          </div>
          {children}
        </li>
      )}
    </Draggable>
  );
}


