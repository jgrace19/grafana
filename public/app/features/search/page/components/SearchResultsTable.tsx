import * as stylex from '@stylexjs/stylex';
import { useEffect, useMemo, useRef, useCallback, useState, type CSSProperties } from 'react';
import * as React from 'react';
import { useTable, type Column, type TableOptions, type Cell } from 'react-table';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { type Observable } from 'rxjs';

import { type Field } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { usePanelPluginMetasMap } from '@grafana/runtime/internal';
import { TableCellHeight } from '@grafana/schema';
import { useTheme2 } from '@grafana/ui';
import { mergeStylexProps, useTableStyles, TableCell } from '@grafana/ui/internal';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { useCustomFlexLayout } from 'app/features/browse-dashboards/components/customFlexTableLayout';

import { useSearchKeyboardNavigation } from '../../hooks/useSearchKeyboardSelection';
import { type QueryResponse } from '../../service/types';
import { type SelectionChecker, type SelectionToggle } from '../selection';

import { generateColumns } from './columns';
import './SearchResultsTable.css';

export type SearchResultsProps = {
  response: QueryResponse;
  width: number;
  height: number;
  selection?: SelectionChecker;
  selectionToggle?: SelectionToggle;
  clearSelection: () => void;
  onTagSelected: (tag: string) => void;
  onDatasourceChange?: (datasource?: string) => void;
  onClickItem?: (event: React.MouseEvent<HTMLElement>) => void;
  keyboardEvents: Observable<React.KeyboardEvent>;
  trackingSource?: string;
};

export type TableColumn = Column & {
  field?: Field;
};

const ROW_HEIGHT = 36; // pixels
const EMPTY_PANEL_PLUGIN_METAS = {};

export const SearchResultsTable = React.memo(
  ({
    response,
    width,
    height,
    selection,
    selectionToggle,
    clearSelection,
    onTagSelected,
    onDatasourceChange,
    onClickItem,
    keyboardEvents,
    trackingSource,
  }: SearchResultsProps) => {
    const tableStyles = useTableStyles(useTheme2(), TableCellHeight.Sm);
    const infiniteLoaderRef = useRef<InfiniteLoader>(null);
    const [listEl, setListEl] = useState<FixedSizeList | null>(null);
    const highlightIndex = useSearchKeyboardNavigation(keyboardEvents, 0, response);
    const { value: panelPluginMetas = EMPTY_PANEL_PLUGIN_METAS } = usePanelPluginMetasMap();

    const memoizedData = useMemo(() => {
      if (!response?.view?.dataFrame.fields.length) {
        return [];
      }

      // as we only use this to fake the length of our data set for react-table we need to make sure we always return an array
      // filled with values at each index otherwise we'll end up trying to call accessRow for null|undefined value in
      // https://github.com/tannerlinsley/react-table/blob/7be2fc9d8b5e223fc998af88865ae86a88792fdb/src/hooks/useTable.js#L585
      return Array(response.totalRows).fill(0);
    }, [response]);

    // Scroll to the top and clear loader cache when the query results change
    useEffect(() => {
      if (infiniteLoaderRef.current) {
        infiniteLoaderRef.current.resetloadMoreItemsCache();
      }
      if (listEl) {
        listEl.scrollTo(0);
      }
    }, [memoizedData, listEl]);

    // React-table column definitions
    const memoizedColumns = useMemo(() => {
      return generateColumns(
        response,
        width,
        selection,
        selectionToggle,
        clearSelection,
        onTagSelected,
        onDatasourceChange,
        response.view?.length >= response.totalRows,
        panelPluginMetas
      );
    }, [
      response,
      width,
      selection,
      selectionToggle,
      clearSelection,
      onTagSelected,
      onDatasourceChange,
      panelPluginMetas,
    ]);

    const options: TableOptions<{}> = useMemo(
      () => ({
        columns: memoizedColumns,
        data: memoizedData,
      }),
      [memoizedColumns, memoizedData]
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(options, useCustomFlexLayout);

    const handleLoadMore = useCallback(
      async (startIndex: number, endIndex: number) => {
        await response.loadMoreItems(startIndex, endIndex);

        // After we load more items, select them if the "select all" checkbox
        // is selected
        const isAllSelected = selection?.('*', '*');
        if (!selectionToggle || !selection || !isAllSelected) {
          return;
        }

        for (let index = startIndex; index < response.view.length; index++) {
          const item = response.view.get(index);
          const itemIsSelected = selection(item.kind, item.uid);
          if (!itemIsSelected) {
            selectionToggle(item.kind, item.uid);
          }
        }
      },
      [response, selection, selectionToggle]
    );

    const RenderRow = useCallback(
      ({ index: rowIndex, style }: { index: number; style: CSSProperties }) => {
        const row = rows[rowIndex];
        prepareRow(row);

        const url = response.view.fields.url?.values[rowIndex];
        const { className } = mergeStylexProps(
          stylex.props(styles.rowContainer, rowIndex === highlightIndex.y && styles.selectedRow),
          { className: 'gf-search-results-row' }
        );
        const { key, ...rowProps } = row.getRowProps({ style });

        return (
          <div key={key} {...rowProps} className={className}>
            {row.cells.map((cell: Cell, index: number) => {
              const href = onClickItem ? url : undefined;

              let userProps = {
                href,
                onClick: onClickItem,
              };

              if (cell.column.id === 'column-name' && href) {
                const item = response.view.get(rowIndex);
                const itemKind = item.kind;
                const parent = item.location || 'general';
                const parentType = parent === 'general' ? 'general' : 'folder';

                userProps.onClick = (evt: React.MouseEvent<HTMLElement>) => {
                  try {
                    reportInteraction('grafana_browse_dashboards_page_click_list_item', {
                      itemKind: itemKind,
                      parent: parentType,
                      source: trackingSource,
                    });
                  } catch (e) {
                    // ignore analytics errors
                  }
                  if (onClickItem) {
                    onClickItem(evt);
                  }
                };
              }

              return (
                <TableCell
                  key={index}
                  tableStyles={tableStyles}
                  cell={cell}
                  columnIndex={index}
                  columnCount={row.cells.length}
                  userProps={userProps}
                  frame={response.view.dataFrame}
                />
              );
            })}
          </div>
        );
      },
      [rows, prepareRow, highlightIndex, tableStyles, onClickItem, response.view, trackingSource]
    );

    if (!rows.length) {
      return (
        <div {...stylex.props(styles.noData)}>
          <Trans i18nKey="search.search-results-table.no-data">No values</Trans>
        </div>
      );
    }

    return (
      <div
        {...getTableProps()}
        aria-label={t('search.search-results-table.aria-label-search-results-table', 'Search results table')}
        role="table"
      >
        {headerGroups.map((headerGroup) => {
          const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps({
            style: { width },
          });

          return (
            <div key={key} {...headerGroupProps} className={stylex.props(styles.headerRow).className}>
              {headerGroup.headers.map((column) => {
                const { key, ...headerProps } = column.getHeaderProps();
                return (
                  <div
                    key={key}
                    {...headerProps}
                    role="columnheader"
                    className={stylex.props(styles.headerCell).className}
                  >
                    {column.render('Header')}
                  </div>
                );
              })}
            </div>
          );
        })}

        <div {...getTableBodyProps()}>
          <InfiniteLoader
            ref={infiniteLoaderRef}
            isItemLoaded={response.isItemLoaded}
            itemCount={rows.length}
            loadMoreItems={handleLoadMore}
          >
            {({ onItemsRendered, ref }) => (
              <FixedSizeList
                ref={(innerRef) => {
                  ref(innerRef);
                  setListEl(innerRef);
                }}
                onItemsRendered={onItemsRendered}
                height={height - ROW_HEIGHT}
                itemCount={rows.length}
                itemSize={tableStyles.rowHeight}
                width={width}
                style={{ overflow: 'hidden auto' }}
              >
                {RenderRow}
              </FixedSizeList>
            )}
          </InfiniteLoader>
        </div>
      </div>
    );
  }
);
SearchResultsTable.displayName = 'SearchResultsTable';

const styles = stylex.create({
  noData: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  headerCell: {
    alignItems: 'center',
    display: 'flex',
    padding: spacing['--gf-spacing-x1'],
  },
  headerRow: {
    backgroundColor: colors['--gf-colors-background-secondary'],
    display: 'flex',
    gap: spacing['--gf-spacing-x1'],
    height: `${ROW_HEIGHT}px`,
  },
  selectedRow: {
    backgroundColor: colors['--gf-colors-action-hover'],
    boxShadow: `inset 3px 0px ${colors['--gf-colors-primary-border']}`,
  },
  rowContainer: {
    display: 'flex',
    gap: spacing['--gf-spacing-x1'],
    height: `${ROW_HEIGHT}px`,
    backgroundColor: { default: null, ':hover': colors['--gf-colors-action-hover'] },
  },
});
