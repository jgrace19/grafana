import * as stylex from '@stylexjs/stylex';
import { type ReactNode } from 'react';

import { Trans } from '@grafana/i18n';
import { Button, Text } from '@grafana/ui';
import { durations, easings, motion } from '@grafana/ui/stylex/constants.stylex';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { DraggableListItem } from './DraggableListItem';
import { DroppableCategory } from './DroppableCategory';
import { itemButtonMarker } from './markers.stylex';

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
      <ul {...stylex.props(styles.list)} data-testid={droppableId}>
        {items.map((item, index) => (
          <DraggableListItem
            key={item.state.key ?? item.state.name}
            draggableId={item.state.key ?? item.state.name}
            index={index}
          >
            <div
              {...stylex.props(styles.itemButton, itemButtonMarker)}
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
              <Button
                variant="primary"
                size="sm"
                fill="outline"
                className={stylex.props(styles.selectButton).className}
              >
                <Trans i18nKey="dashboard-scene.draggable-items-list.select">Select</Trans>
              </Button>
            </div>
          </DraggableListItem>
        ))}
      </ul>
    </DroppableCategory>
  );
}

const styles = stylex.create({
  list: {
    listStyle: 'none',
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
  itemButton: {
    display: 'flex',
    flexDirection: 'row',
    gap: spacing['--gf-spacing-x0-5'],
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    cursor: 'pointer',
    color: { default: null, ':hover': colors['--gf-colors-text-link'] },
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'color' },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: durations.short },
    transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: easings.easeInOut },
  },
  selectButton: {
    visibility: { default: 'hidden', [stylex.when.ancestor(':hover', itemButtonMarker)]: 'visible' },
  },
});
