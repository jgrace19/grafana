import * as stylex from '@stylexjs/stylex';
import { uniqueId } from 'lodash';
import { Fragment, type ReactNode, useCallback, useEffect, useMemo } from 'react';
import {
  type HeaderGroup,
  type PluginHook,
  type Row,
  type SortingRule,
  type TableOptions,
  useExpanded,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';

import { type IconName, isTruthy } from '@grafana/data';
import { t } from '@grafana/i18n';

import { useTheme2 } from '../../themes/ThemeContext';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { Icon } from '../Icon/Icon';
import { Pagination } from '../Pagination/Pagination';
import { Tooltip } from '../Tooltip/Tooltip';
import { type PopoverContent } from '../Tooltip/types';

import { type Column } from './types';
import { EXPANDER_CELL_ID, getColumns } from './utils';

export type InteractiveTableHeaderTooltip = {
  content: PopoverContent;
  iconName?: IconName;
};

export type FetchDataArgs<Data> = { sortBy: Array<SortingRule<Data>> };
export type FetchDataFunc<Data> = ({ sortBy }: FetchDataArgs<Data>) => void;

interface BaseProps<TableData extends object> {
  className?: string;
  /**
   * Table's columns definition. Must be memoized.
   */
  columns: Array<Column<TableData>>;
  /**
   * The data to display in the table. Must be memoized.
   */
  data: TableData[];
  /**
   * Must return a unique id for each row
   */
  getRowId: TableOptions<TableData>['getRowId'];
  /**
   * Optional tooltips for the table headers. The key must match the column id.
   */
  headerTooltips?: Record<string, InteractiveTableHeaderTooltip>;
  /**
   * Number of rows per page. A value of zero disables pagination. Defaults to 0.
   * A React hooks error will be thrown if pageSize goes from greater than 0 to 0 or vice versa. If enabling pagination,
   * make sure pageSize remains a non-zero value.
   */
  pageSize?: number;
  /**
   * A custom function to fetch data when the table is sorted. If not provided, the table will be sorted client-side.
   * It's important for this function to have a stable identity, e.g. being wrapped into useCallback to prevent unnecessary
   * re-renders of the table.
   */
  fetchData?: FetchDataFunc<TableData>;
  /**
   * Optional way to set how the table is sorted from the beginning. Must be memoized.
   */
  initialSortBy?: Array<SortingRule<TableData>>;
  /**
   * Disable the ability to remove sorting on columns (none -> asc -> desc -> asc)
   */
  disableSortRemove?: boolean;
  /**
   * Will automatically reset to the first page if the `data` prop is changed
   */
  autoResetPage?: boolean;
}

interface WithExpandableRow<TableData extends object> extends BaseProps<TableData> {
  /**
   * Render function for the expanded row. if not provided, the tables rows will not be expandable.
   */
  renderExpandedRow: (row: TableData) => ReactNode;
  /**
   * Whether to show the "Expand all" button. Depends on renderExpandedRow to be provided. Defaults to false.
   */
  showExpandAll?: boolean;
}

interface WithoutExpandableRow<TableData extends object> extends BaseProps<TableData> {
  renderExpandedRow?: never;
  showExpandAll?: never;
}

type Props<TableData extends object> = WithExpandableRow<TableData> | WithoutExpandableRow<TableData>;

/**
 * The InteractiveTable is used to display and select data efficiently. It allows for the display and modification of detailed information.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/layout-interactivetable--docs
 */
export function InteractiveTable<TableData extends object>({
  autoResetPage,
  className,
  columns,
  data,
  getRowId,
  headerTooltips,
  pageSize = 0,
  renderExpandedRow,
  showExpandAll = false,
  fetchData,
  initialSortBy = [],
  disableSortRemove,
}: Props<TableData>) {
  const theme = useTheme2();
  const rowHoverBg = theme.colors.emphasize(theme.colors.background.primary, 0.03);
  const tableColumns = useMemo(() => {
    return getColumns<TableData>(columns, showExpandAll);
  }, [columns, showExpandAll]);
  const id = useUniqueId();
  const getRowHTMLID = useCallback(
    (row: Row<TableData>) => {
      return `${id}-${row.id}`.replace(/\s/g, '');
    },
    [id]
  );

  const tableHooks: Array<PluginHook<TableData>> = [useSortBy, useExpanded];

  const multiplePages = data.length > pageSize;
  const paginationEnabled = pageSize > 0;

  if (paginationEnabled) {
    tableHooks.push(usePagination);
  }

  const tableInstance = useTable<TableData>(
    {
      columns: tableColumns,
      data,
      autoResetExpanded: false,
      autoResetPage: !!autoResetPage, // If undefined, we want to treat this as false to prevent page reset by default
      autoResetSortBy: false,
      disableMultiSort: true,
      // If fetchData is provided, we disable client-side sorting
      manualSortBy: Boolean(fetchData),
      disableSortRemove,
      getRowId,
      initialState: {
        hiddenColumns: [
          !renderExpandedRow && EXPANDER_CELL_ID,
          ...tableColumns
            .filter((col) => !(col.visible ? col.visible(data) : true))
            .map((c) => c.id)
            .filter(isTruthy),
        ].filter(isTruthy),
        sortBy: initialSortBy,
      },
    },
    ...tableHooks
  );

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow } = tableInstance;

  const { sortBy } = tableInstance.state;
  useEffect(() => {
    if (fetchData) {
      fetchData({ sortBy });
    }
  }, [sortBy, fetchData]);

  useEffect(() => {
    if (paginationEnabled) {
      tableInstance.setPageSize(pageSize);
    }
  }, [paginationEnabled, pageSize, tableInstance.setPageSize, tableInstance]);

  return (
    <div {...stylex.props(styles.container)}>
      <table {...getTableProps()} {...mergeStylexProps(stylex.props(styles.table), { className })}>
        <thead>
          {headerGroups.map((headerGroup) => {
            const { key, ...headerRowProps } = headerGroup.getHeaderGroupProps();

            return (
              <tr key={key} {...headerRowProps}>
                {headerGroup.headers.map((column) => {
                  const { key, ...headerCellProps } = column.getHeaderProps();

                  const headerTooltip = headerTooltips?.[column.id];

                  return (
                    <th
                      key={key}
                      {...headerCellProps}
                      {...stylex.props(
                        styles.header,
                        column.widthStyle,
                        column.width === 0 && styles.disableGrow,
                        column.canSort && styles.sortableHeader
                      )}
                      {...(column.isSorted && { 'aria-sort': column.isSortedDesc ? 'descending' : 'ascending' })}
                    >
                      <ColumnHeader column={column} headerTooltip={headerTooltip} />
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>

        <tbody {...getTableBodyProps()}>
          {(paginationEnabled ? tableInstance.page : tableInstance.rows).map((row) => {
            prepareRow(row);

            const { key, ...otherRowProps } = row.getRowProps();
            const rowId = getRowHTMLID(row);
            // @ts-expect-error react-table doesn't ship with useExpanded types, and we can't use declaration merging without affecting the table viz
            const isExpanded = row.isExpanded;

            return (
              <Fragment key={key}>
                <tr
                  {...otherRowProps}
                  {...stylex.props(styles.row, styles.rowHover(rowHoverBg), isExpanded && styles.expandedRow)}
                >
                  {row.cells.map((cell) => {
                    const { key, ...otherCellProps } = cell.getCellProps();

                    return (
                      <td key={key} {...otherCellProps} {...stylex.props(styles.cell, cell.column.widthStyle)}>
                        {cell.render('Cell', { __rowID: rowId })}
                      </td>
                    );
                  })}
                </tr>
                {isExpanded && renderExpandedRow && (
                  <tr {...otherRowProps} id={rowId}>
                    <td {...stylex.props(styles.expandedContentCell)} colSpan={row.cells.length}>
                      {renderExpandedRow(row.original)}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
      {paginationEnabled && multiplePages && (
        <span>
          <Pagination
            currentPage={tableInstance.state.pageIndex + 1}
            numberOfPages={tableInstance.pageOptions.length}
            onNavigate={(toPage) => tableInstance.gotoPage(toPage - 1)}
          />
        </span>
      )}
    </div>
  );
}

const useUniqueId = () => {
  return useMemo(() => uniqueId('InteractiveTable'), []);
};

function ColumnHeader<T extends object>({
  column: { canSort, render, isSorted, isSortedDesc, getSortByToggleProps, Header, id },
  headerTooltip,
}: {
  column: HeaderGroup<T>;
  headerTooltip?: InteractiveTableHeaderTooltip;
}) {
  const { onClick } = getSortByToggleProps();

  const children = (
    <>
      {render('Header')}
      {headerTooltip && (
        <Tooltip theme="info-alt" content={headerTooltip.content} placement="top-end">
          <Icon
            xstyle={columnHeaderStyles.headerTooltipIcon}
            name={headerTooltip.iconName || 'info-circle'}
            data-testid={'header-tooltip-icon'}
          />
        </Tooltip>
      )}
      {isSorted && (
        <span aria-hidden="true" {...stylex.props(columnHeaderStyles.sortIcon)}>
          <Icon name={isSortedDesc ? 'angle-down' : 'angle-up'} />
        </span>
      )}
    </>
  );

  if (canSort) {
    return (
      <button
        aria-label={t('grafana-ui.interactive-table.aria-label-sort-column', 'Sort column {{columnName}}', {
          columnName: typeof Header === 'string' ? Header : id,
        })}
        type="button"
        onClick={onClick}
        {...stylex.props(columnHeaderStyles.sortButton)}
      >
        {children}
      </button>
    );
  }

  return children;
}

const styles = stylex.create({
  container: {
    display: 'flex',
    gap: spacing['--gf-spacing-x2'],
    flexDirection: 'column',
    width: '100%',
    overflowX: 'auto',
  },
  cell: {
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
    minWidth: spacing['--gf-spacing-x3'],
  },
  table: {
    borderRadius: shape['--gf-shape-radius-default'],
    width: '100%',
  },
  disableGrow: {
    width: 0,
  },
  // The sort button's half of `'&, & > button'` is `columnHeaderStyles.sortButton`.
  header: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
    minWidth: spacing['--gf-spacing-x3'],
    position: 'relative',
    whiteSpace: 'nowrap',
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
  },
  row: {
    borderBottomWidth: { default: '1px', ':last-child': 0 },
    borderBottomStyle: { default: 'solid', ':last-child': 'none' },
    borderBottomColor: { default: colors['--gf-colors-border-weak'], ':last-child': 'currentcolor' },
  },
  rowHover: (backgroundColor: string) => ({
    backgroundColor: { default: null, ':hover': backgroundColor },
  }),
  // `borderBottom: 'none'`; the row's `:last-child` reset still applied on top of it.
  expandedRow: {
    borderBottomWidth: { default: 'medium', ':last-child': 0 },
    borderBottomStyle: 'none',
    borderBottomColor: 'currentcolor',
  },
  expandedContentCell: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
    position: 'relative',
    paddingTop: spacing['--gf-spacing-x2'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x2'],
    paddingLeft: spacing['--gf-spacing-x5'],
    '::before': {
      content: '""',
      position: 'absolute',
      width: '1px',
      top: 0,
      left: '16px',
      bottom: spacing['--gf-spacing-x2'],
      backgroundColor: colors['--gf-colors-border-medium'],
    },
  },
  sortableHeader: {
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
});

const columnHeaderStyles = stylex.create({
  sortIcon: {
    position: 'absolute',
    top: spacing['--gf-spacing-x1'],
  },
  headerTooltipIcon: {
    marginLeft: spacing['--gf-spacing-x0-5'],
  },
  sortButton: {
    position: 'relative',
    whiteSpace: 'nowrap',
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x2-5'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    borderStyle: 'none',
    borderWidth: 'medium',
    borderColor: 'currentcolor',
    textAlign: 'left',
    fontWeight: typography['--gf-typography-font-weight-medium'],
    '::after': {
      content: '"\\00a0"',
    },
  },
});
