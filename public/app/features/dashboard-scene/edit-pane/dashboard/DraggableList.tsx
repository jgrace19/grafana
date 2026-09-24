import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { draggableListStyles } from './DraggableList.stylex';
import { type ReactNode } from 'react';

import { Trans } from '@grafana/i18n';
import {Button, Text} from '@grafana/ui';

import { DraggableListItem } from './DraggableListItem';
import { DroppableCategory } from './DroppableCategory';

interface DraggableListProps<T extends { state: { key?: string; name: string } }> {
  items: T[];
  droppableId: string;
  title: string;
  onClickItem: (item: T) => void;
  renderItemLabel: (item: T) => NonNullable<ReactNode>;
}

export function DraggableList<T extends { state: { key?: string; name: string } }>({
  items,
  droppableId,
  title,
  onClickItem,
  renderItemLabel,
}: DraggableListProps<T>) {


  return (
    <DroppableCategory droppableId={droppableId} title={title}>
      <ul {...stylex.props(draggableListStyles.list)} data-testid={droppableId}>
        {items.map((item, index) => (
          <DraggableListItem
            key={item.state.key ?? item.state.name}
            draggableId={item.state.key ?? item.state.name}
            index={index}
          >
            <div
              {...stylex.props(draggableListStyles.itemButton)}
              role="button"
              tabIndex={0}
              onClick={() => onClickItem(item)}
              onKeyDown={(event: React.KeyboardEvent) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onClickItem(item);
                }
              }}
            >
              <Text truncate>{renderItemLabel(item)}</Text>
              <Button variant="primary" size="sm" fill="outline">
                <Trans i18nKey="dashboard-scene.draggable-items-list.select">Select</Trans>
              </Button>
            </div>
          </DraggableListItem>
        ))}
      </ul>
    </DroppableCategory>
  );
}


