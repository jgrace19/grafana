import * as stylex from '@stylexjs/stylex';
import { useEffect } from 'react';
import {
  type Row,
  type HeaderGroup,
  type TablePropGetter,
  type TableBodyPropGetter,
  type TableProps,
  type TableBodyProps,
} from 'react-table';

import { Icon } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { callTreeTableStyles } from './CallTreeTable.stylex';
import { type CallTreeNode } from './utils';

type CallTreeTableProps = {
  width: number;
  height: number;
  compactModeThreshold: number;
  isCompact: boolean;
  setIsCompact: (compact: boolean) => void;
  getFunctionColumnWidth: (availableWidth: number, compactMode: boolean) => number | undefined;
  getTableProps: (propGetter?: TablePropGetter<CallTreeNode>) => TableProps;
  getTableBodyProps: (propGetter?: TableBodyPropGetter<CallTreeNode>) => TableBodyProps;
  headerGroups: Array<HeaderGroup<CallTreeNode>>;
  rows: Array<Row<CallTreeNode>>;
  prepareRow: (row: Row<CallTreeNode>) => void;
  currentSearchMatchId?: string;
  searchMatchRowRef: (node: HTMLTableRowElement | null) => void;
  scrollContainerRef: { current: HTMLDivElement | null };
  focusedNodeId?: string;
  callersNodeLabel?: string;
};

export function CallTreeTable({
  width,
  height,
  compactModeThreshold,
  isCompact,
  setIsCompact,
  getFunctionColumnWidth,
  getTableProps,
  getTableBodyProps,
  headerGroups,
  rows,
  prepareRow,
  currentSearchMatchId,
  searchMatchRowRef,
  scrollContainerRef,
  focusedNodeId,
  callersNodeLabel,
}: CallTreeTableProps) {
  const SCROLLBAR_WIDTH = 16;
  const availableWidth = width - SCROLLBAR_WIDTH;
  const shouldBeCompact = availableWidth > 0 && availableWidth < compactModeThreshold;

  useEffect(() => {
    if (availableWidth <= 0) {
      return;
    }
    if (shouldBeCompact !== isCompact) {
      setIsCompact(shouldBeCompact);
    }
  }, [availableWidth, shouldBeCompact, isCompact, setIsCompact]);

  const functionColumnWidth = getFunctionColumnWidth(availableWidth, isCompact);

  if (width < 3 || height < 3) {
    return null;
  }

  const fixedTableProps = getTableProps();
  const scrollTableProps = getTableProps();
  const bodyProps = getTableBodyProps();

  return (
    <div style={{ width, height, display: 'flex', flexDirection: 'column' }}>
      <table
        {...fixedTableProps}
        {...mergeStylexClassName(stylex.props(callTreeTableStyles.table), fixedTableProps.className)}
        style={{ flexShrink: 0, ...(fixedTableProps.style as object) }}
      >
        <thead {...stylex.props(callTreeTableStyles.thead)}>
          {headerGroups.map((headerGroup) => {
            const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
            return (
              <tr key={key} {...headerGroupProps}>
                {headerGroup.headers.map((column) => {
                  const { key: headerKey, ...headerProps } = column.getHeaderProps(column.getSortByToggleProps());
                  const columnWidth = column.id === 'label' ? functionColumnWidth : column.width;
                  return (
                    <th
                      key={headerKey}
                      {...headerProps}
                      {...mergeStylexClassName(stylex.props(callTreeTableStyles.th), headerProps.className)}
                      style={{
                        ...(columnWidth !== undefined && { width: columnWidth }),
                        textAlign: column.id === 'self' || column.id === 'total' ? 'right' : undefined,
                        ...(column.minWidth !== undefined && { minWidth: column.minWidth }),
                      }}
                    >
                      {column.render('Header')}
                      {column.isSorted && (
                        <Icon
                          name={column.isSortedDesc ? 'arrow-down' : 'arrow-up'}
                          size="lg"
                          className={stylex.props(callTreeTableStyles.sortIcon).className}
                        />
                      )}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
      </table>
      <div
        ref={scrollContainerRef}
        style={{ flex: 1, overflowY: 'scroll', overflowX: 'auto' }}
        {...stylex.props(callTreeTableStyles.scrollContainer)}
      >
        <table
          {...scrollTableProps}
          {...mergeStylexClassName(stylex.props(callTreeTableStyles.table), scrollTableProps.className)}
        >
          <tbody
            {...bodyProps}
            {...mergeStylexClassName(stylex.props(callTreeTableStyles.tbody), bodyProps.className)}
          >
            {rows.map((row, rowIndex) => {
              prepareRow(row);
              const { key, ...rowProps } = row.getRowProps();
              const isFocusedRow = row.original.id === focusedNodeId;
              const isCallersTargetRow = callersNodeLabel && row.original.label === callersNodeLabel;
              const isSearchMatchRow = currentSearchMatchId && row.original.id === currentSearchMatchId;

              return (
                <tr
                  key={key}
                  {...rowProps}
                  ref={isSearchMatchRow ? searchMatchRowRef : null}
                  {...mergeStylexClassName(
                    stylex.props(
                      callTreeTableStyles.tr,
                      (isFocusedRow ||
                        (focusedNodeId?.startsWith('label:') &&
                          focusedNodeId.substring(6) === row.original.label)) &&
                        callTreeTableStyles.focusedRow,
                      isCallersTargetRow && callTreeTableStyles.callersTargetRow,
                      isSearchMatchRow && callTreeTableStyles.searchMatchRow
                    ),
                    rowProps.className
                  )}
                >
                  {row.cells.map((cell) => {
                    const { key: cellKey, ...cellProps } = cell.getCellProps();
                    const isValueColumn = cell.column.id === 'self' || cell.column.id === 'total';
                    const isActionsColumn = cell.column.id === 'actions';
                    const columnWidth = cell.column.id === 'label' ? functionColumnWidth : cell.column.width;
                    return (
                      <td
                        key={cellKey}
                        {...cellProps}
                        {...mergeStylexClassName(
                          stylex.props(
                            callTreeTableStyles.td,
                            isActionsColumn && callTreeTableStyles.actionsColumnCell,
                            isValueColumn && callTreeTableStyles.valueColumnCell
                          ),
                          cellProps.className
                        )}
                        style={{
                          ...(columnWidth !== undefined && { width: columnWidth }),
                          ...(cell.column.minWidth !== undefined && { minWidth: cell.column.minWidth }),
                        }}
                      >
                        {cell.render('Cell', { rowIndex })}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

