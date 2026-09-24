import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { virtualizedListStyles } from './VirtualizedList.stylex';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useRef } from 'react';
import type * as React from 'react';
import type { Observable } from 'rxjs';

import type { DataSourceInstanceSettings, DataSourceRef, GrafanaTheme2 } from '@grafana/data';
import type { FavoriteDatasources } from '@grafana/runtime';

import { useKeyboardNavigatableList } from '../../hooks';

import { DataSourceCardItem } from './DataSourceCardItem';

const VIRTUAL_OVERSCAN_ITEMS = 4;
const ESTIMATED_ITEM_HEIGHT = 48;

export type VirtualizedListProps = {
  sortedDataSources: DataSourceInstanceSettings[];
  enableKeyboardNavigation?: boolean;
  keyboardEvents?: Observable<React.KeyboardEvent>;
  current: DataSourceRef | DataSourceInstanceSettings | string | null | undefined;
  favoriteDataSources: FavoriteDatasources;
  onChange: (ds: DataSourceInstanceSettings) => void;
  pushRecentlyUsedDataSource: (ds: DataSourceInstanceSettings) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
};

export function VirtualizedList({
  sortedDataSources,
  enableKeyboardNavigation,
  keyboardEvents,
  current,
  favoriteDataSources,
  onChange,
  pushRecentlyUsedDataSource,
  scrollRef,
}: VirtualizedListProps) {

  const rowVirtualizer = useVirtualizer({
    count: sortedDataSources.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ESTIMATED_ITEM_HEIGHT,
    overscan: VIRTUAL_OVERSCAN_ITEMS,
  });

  const virtualizerRef = useRef(rowVirtualizer);
  virtualizerRef.current = rowVirtualizer;

  const stableScrollToIndex = useCallback((index: number) => {
    virtualizerRef.current?.scrollToIndex(index, { align: 'auto' });
  }, []);

  const handleSelect = useCallback(
    (index: number) => {
      const ds = sortedDataSources[index];
      if (ds) {
        pushRecentlyUsedDataSource(ds);
        onChange(ds);
      }
    },
    [sortedDataSources, onChange, pushRecentlyUsedDataSource]
  );

  const selectedIndex = useKeyboardNavigatableList({
    keyboardEvents: enableKeyboardNavigation ? keyboardEvents : undefined,
    itemCount: sortedDataSources.length,
    scrollToIndex: stableScrollToIndex,
    onSelect: handleSelect,
  });

  return (
    <div {...stylex.props(virtualizedListStyles.virtualizedContainer)} style={{ height: rowVirtualizer.getTotalSize() }}>
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const ds = sortedDataSources[virtualRow.index];
        return (
          <div
            key={ds.uid}
            {...stylex.props(virtualizedListStyles.virtualizedItem)}
            style={{
              height: virtualRow.size,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <DataSourceCardItem
              ds={ds}
              isSelected={!!enableKeyboardNavigation && virtualRow.index === selectedIndex}
              enableKeyboardNavigation={enableKeyboardNavigation}
              current={current}
              favoriteDataSources={favoriteDataSources}
              onChange={onChange}
              pushRecentlyUsedDataSource={pushRecentlyUsedDataSource}
            />
          </div>
        );
      })}
    </div>
  );
}

