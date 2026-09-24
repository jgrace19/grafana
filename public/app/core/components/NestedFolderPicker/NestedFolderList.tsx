import * as stylex from '@stylexjs/stylex';
import { useCallback, useId, useMemo, useRef } from 'react';
import * as React from 'react';
import Skeleton from 'react-loading-skeleton';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

import { Trans } from '@grafana/i18n';
import { Avatar, IconButton, Text } from '@grafana/ui';
import { colors, components, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { Indent } from 'app/core/components/Indent/Indent';
import { childrenByParentUIDSelector, rootItemsSelector } from 'app/features/browse-dashboards/state/hooks';
import { type DashboardsTreeItem } from 'app/features/browse-dashboards/types';
import { type DashboardViewItem } from 'app/features/search/types';
import { useSelector } from 'app/types/store';

import { FolderParent } from './FolderParent';
import { FolderRepo } from './FolderRepo';

const ROW_HEIGHT = 40;
const CHEVRON_SIZE = 'md';

export const getDOMId = (idPrefix: string, id: string) => `${idPrefix}-${id || 'root'}`;

export interface NestedFolderListProps {
  items: DashboardsTreeItem[];
  focusedItemIndex: number;
  foldersAreOpenable: boolean;
  idPrefix: string;
  selectedFolder: string | undefined;
  onFolderExpand: (uid: string, newOpenState: boolean) => void;
  onFolderSelect: (item: DashboardViewItem) => void;
  isItemLoaded: (itemIndex: number) => boolean;
  requestLoadMore: (folderUid: string | undefined) => void;
  emptyFolders: Set<string>;
  teamFolderOwnersByUid?: Record<string, { name: string; avatarUrl?: string }>;
}

export function NestedFolderList({
  items,
  focusedItemIndex,
  foldersAreOpenable,
  idPrefix,
  selectedFolder,
  onFolderExpand,
  onFolderSelect,
  isItemLoaded,
  requestLoadMore,
  emptyFolders,
  teamFolderOwnersByUid,
}: NestedFolderListProps) {
  const infiniteLoaderRef = useRef<InfiniteLoader>(null);

  const virtualData = useMemo(
    (): VirtualData => ({
      items,
      focusedItemIndex,
      foldersAreOpenable,
      selectedFolder,
      onFolderExpand,
      onFolderSelect,
      idPrefix,
      emptyFolders,
      teamFolderOwnersByUid,
    }),
    [
      items,
      focusedItemIndex,
      foldersAreOpenable,
      selectedFolder,
      onFolderExpand,
      onFolderSelect,
      idPrefix,
      emptyFolders,
      teamFolderOwnersByUid,
    ]
  );

  const handleIsItemLoaded = useCallback(
    (itemIndex: number) => {
      return isItemLoaded(itemIndex);
    },
    [isItemLoaded]
  );

  const handleLoadMore = useCallback(
    (startIndex: number, endIndex: number) => {
      const { parentUID } = items[startIndex];
      requestLoadMore(parentUID);
    },
    [requestLoadMore, items]
  );

  return (
    <div {...stylex.props(styles.table)} role="tree">
      {items.length > 0 ? (
        <InfiniteLoader
          ref={infiniteLoaderRef}
          itemCount={items.length}
          isItemLoaded={handleIsItemLoaded}
          loadMoreItems={handleLoadMore}
        >
          {({ onItemsRendered, ref }) => (
            <List
              ref={ref}
              height={ROW_HEIGHT * Math.min(6.5, items.length)}
              width="100%"
              itemData={virtualData}
              itemSize={ROW_HEIGHT}
              itemCount={items.length}
              onItemsRendered={onItemsRendered}
            >
              {Row}
            </List>
          )}
        </InfiniteLoader>
      ) : (
        <div {...stylex.props(styles.emptyMessage)}>
          <Trans i18nKey="browse-dashboards.folder-picker.empty-message">No folders found</Trans>
        </div>
      )}
    </div>
  );
}

interface VirtualData extends Omit<NestedFolderListProps, 'isItemLoaded' | 'requestLoadMore'> {}

interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: VirtualData;
}

const SKELETON_WIDTHS = [100, 200, 130, 160, 150];

function Row({ index, style: virtualStyles, data }: RowProps) {
  const {
    items,
    focusedItemIndex,
    foldersAreOpenable,
    selectedFolder,
    onFolderExpand,
    onFolderSelect,
    idPrefix,
    emptyFolders,
    teamFolderOwnersByUid,
  } = data;
  const { item, isOpen, level, parentUID, disabled } = items[index];
  const rowRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const rootCollection = useSelector(rootItemsSelector);
  const childrenCollections = useSelector(childrenByParentUIDSelector);
  const children = (item.uid ? childrenCollections[item.uid] : rootCollection)?.items ?? [];
  let siblings: DashboardViewItem[] = [];
  // only look for siblings if we're not at the root
  if (item.uid) {
    siblings = (parentUID ? childrenCollections[parentUID] : rootCollection)?.items ?? [];
  }

  const handleExpand = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault();
      ev.stopPropagation();
      if (item.uid) {
        onFolderExpand(item.uid, !isOpen);
      }
    },
    [item.uid, isOpen, onFolderExpand]
  );

  const handleSelect = useCallback(() => {
    if (item.kind === 'folder' && !disabled) {
      onFolderSelect(item);
    }
  }, [item, onFolderSelect, disabled]);

  if (item.kind === 'ui' && item.uiKind === 'pagination-placeholder') {
    return (
      <span {...stylex.props(styles.row)} style={virtualStyles}>
        <Indent level={level} spacing={2} />
        <Skeleton width={SKELETON_WIDTHS[index % SKELETON_WIDTHS.length]} />
      </span>
    );
  }

  if (item.kind !== 'folder') {
    const itemKind = item.kind;
    const itemUID = item.uid;
    return process.env.NODE_ENV !== 'production' ? (
      <span {...stylex.props(styles.row)} style={virtualStyles}>
        <Trans i18nKey="browse-dashboards.folder-picker.non-folder-item">
          Non-folder {{ itemKind }} {{ itemUID }}
        </Trans>
      </span>
    ) : null;
  }

  // We don't have a direct value of whether things are coming from user searching but this seems to be a good
  // approximation as when searching all items will be at top level, while things that are actually in the top level
  // when just looking at a folders tree should not have parent.
  const isSearchItem = level === 0 && item.parentUID !== undefined;
  const teamOwner = teamFolderOwnersByUid?.[item.uid];

  return (
    // don't need a key handler here, it's handled at the input level in NestedFolderPicker
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      ref={rowRef}
      {...stylex.props(
        styles.row,
        index === focusedItemIndex && styles.rowFocused,
        item.uid === selectedFolder && styles.rowSelected
      )}
      style={virtualStyles}
      tabIndex={-1}
      onClick={handleSelect}
      aria-expanded={isOpen}
      aria-selected={item.uid === selectedFolder}
      aria-labelledby={labelId}
      aria-level={level + 1} // aria-level is 1-indexed
      role="treeitem"
      aria-disabled={disabled}
      aria-owns={children.length > 0 ? children.map((child) => getDOMId(idPrefix, child.uid)).join(' ') : undefined}
      aria-setsize={children.length}
      aria-posinset={siblings.findIndex((i) => i.uid === item.uid) + 1}
      id={getDOMId(idPrefix, item.uid)}
    >
      <div {...stylex.props(styles.rowBody)}>
        <Indent level={level} spacing={2} />

        {foldersAreOpenable && !emptyFolders.has(item.uid) ? (
          <IconButton
            size={CHEVRON_SIZE}
            // by using onMouseDown here instead of onClick we can stop focus moving
            // to the button when the user clicks it (via preventDefault + stopPropagation)
            onMouseDown={handleExpand}
            // Additionally, prevent the click event from bubbling to the row, which would select the folder
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
            }}
            // tabIndex not needed here because we handle keyboard navigation at the input level
            tabIndex={-1}
            aria-label={isOpen ? `Collapse folder ${item.title}` : `Expand folder ${item.title}`}
            name={isOpen ? 'angle-down' : 'angle-right'}
          />
        ) : (
          <span {...stylex.props(styles.folderButtonSpacer)} />
        )}

        <label {...stylex.props(styles.label)} id={labelId}>
          <Text truncate>{item.title}</Text>
          <FolderRepo folder={item} />
        </label>
        {teamOwner && (
          <div {...stylex.props(styles.teamOwner)}>
            {teamOwner.avatarUrl && <Avatar src={teamOwner.avatarUrl} alt={teamOwner.name} />}
            <Text truncate color="secondary" variant="bodySmall">
              {teamOwner.name}
            </Text>
          </div>
        )}
        {isSearchItem && <FolderParent item={items[index]} />}
      </div>
    </div>
  );
}

const styles = stylex.create({
  table: {
    backgroundColor: components['--gf-components-input-background'],
  },
  emptyMessage: {
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
    textAlign: 'center',
    width: '100%',
  },
  folderButtonSpacer: {
    paddingLeft: spacing['--gf-spacing-x2-5'],
  },
  row: {
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    borderTopStyle: { default: null, ':not(:first-child)': 'solid' },
    borderTopWidth: { default: null, ':not(:first-child)': '1px' },
    borderTopColor: { default: null, ':not(:first-child)': colors['--gf-colors-border-weak'] },
  },
  rowFocused: {
    backgroundColor: colors['--gf-colors-background-secondary'],
  },
  rowSelected: {
    '::before': {
      display: 'block',
      content: '""',
      position: 'absolute',
      left: 0,
      bottom: 0,
      top: 0,
      width: 4,
      borderRadius: shape['--gf-shape-radius-default'],
      backgroundImage: colors['--gf-colors-gradients-brand-vertical'],
    },
  },
  rowBody: {
    height: ROW_HEIGHT,
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    flexGrow: 1,
    gap: spacing['--gf-spacing-x0-5'],
    overflow: 'hidden',
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x1'],
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    lineHeight: `${ROW_HEIGHT}px`,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textDecoration: { default: null, ':hover': 'underline' },
    cursor: { default: null, ':hover': 'pointer' },
  },
  teamOwner: {
    display: 'flex',
    marginLeft: spacing['--gf-spacing-x1'],
    alignItems: 'center',
    gap: spacing['--gf-spacing-x0-5'],
    minWidth: 0,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 'auto',
    pointerEvents: 'none', // avoid interfering with folder selection
  },
});
