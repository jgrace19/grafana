import { type ReactNode, useState } from 'react';
import * as React from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { IconButton, Pagination } from '@grafana/ui';

import { usePagination } from '../hooks/usePagination';
import * as stylex from '@stylexjs/stylex';
import { paginationStyles } from '../styles/pagination.stylex';

interface DynamicTablePagination {
  itemsPerPage: number;
}

export interface DynamicTableColumnProps<T = unknown> {
  id: string | number;
  /** Column header to display */
  label: string;
  alignColumn?: 'end' | string;

  renderCell: (item: DynamicTableItemProps<T>, index: number) => ReactNode;
  size?: number | string;
  className?: string;
}

export interface DynamicTableItemProps<T = unknown> {
  id: string | number;
  data: T;
  renderExpandedContent?: () => ReactNode;
}

export interface DynamicTableProps<T = unknown> {
  cols: Array<DynamicTableColumnProps<T>>;
  items: Array<DynamicTableItemProps<T>>;
  dataTestId?: string;

  isExpandable?: boolean;
  pagination?: DynamicTablePagination;
  paginationStyles?: string;

  // provide these to manually control expanded status
  onCollapse?: (item: DynamicTableItemProps<T>) => void;
  onExpand?: (item: DynamicTableItemProps<T>) => void;
  isExpanded?: (item: DynamicTableItemProps<T>) => boolean;
  renderExpandedContent?: (
    item: DynamicTableItemProps<T>,
    index: number,
    items: Array<DynamicTableItemProps<T>>
  ) => ReactNode;
  testIdGenerator?: (item: DynamicTableItemProps<T>, index: number) => string;
  renderPrefixHeader?: () => ReactNode;
  renderPrefixCell?: (
    item: DynamicTableItemProps<T>,
    index: number,
    items: Array<DynamicTableItemProps<T>>
  ) => ReactNode;

  footerRow?: React.ReactNode;
}

export const DynamicTable = <T extends object>({
  cols,
  items,
  isExpandable = false,
  onCollapse,
  onExpand,
  isExpanded,
  renderExpandedContent,
  testIdGenerator,
  pagination,
  paginationStyles,
  // render a cell BEFORE expand icon for header/ each row.
  // currently use by RuleList to render guidelines
  renderPrefixCell,
  renderPrefixHeader,
  footerRow,
  dataTestId,
}: DynamicTableProps<T>) => {

  if ((onCollapse || onExpand || isExpanded) && !(onCollapse && onExpand && isExpanded)) {
    throw new Error('either all of onCollapse, onExpand, isExpanded must be provided, or none');
  }
  if ((isExpandable || renderExpandedContent) && !(isExpandable && renderExpandedContent)) {
    throw new Error('either both isExpanded and renderExpandedContent must be provided, or neither');
  }
  const styles =(getStyles(cols, isExpandable, !!renderPrefixHeader));

  const [expandedIds, setExpandedIds] = useState<Array<DynamicTableItemProps['id']>>([]);

  const toggleExpanded = (item: DynamicTableItemProps<T>) => {
    if (isExpanded && onCollapse && onExpand) {
      isExpanded(item) ? onCollapse(item) : onExpand(item);
    } else {
      setExpandedIds(
        expandedIds.includes(item.id) ? expandedIds.filter((itemId) => itemId !== item.id) : [...expandedIds, item.id]
      );
    }
  };

  const itemsPerPage = pagination?.itemsPerPage ?? items.length;
  const { page, numberOfPages, onPageChange, pageItems } = usePagination(items, 1, itemsPerPage);

  return (
    <>
      <div {...stylex.props(formStyles.container)} data-testid={dataTestId ?? 'dynamic-table'}>
        <div {...stylex.props(formStyles.row)} data-testid="header">
          {renderPrefixHeader && renderPrefixHeader()}
          {isExpandable && <div className={stylex.props(formStyles.cell)()} />}
          {cols.map((col) => (
            <div className={stylex.props(formStyles.cell)(col.alignColumn)} key={col.id}>
              {col.label}
            </div>
          ))}
        </div>

        {pageItems.map((item, index) => {
          const isItemExpanded = isExpanded ? isExpanded(item) : expandedIds.includes(item.id);
          return (
            <div
              {...stylex.props(formStyles.row)}
              key={`${item.id}-${index}`}
              data-testid={testIdGenerator?.(item, index) ?? 'row'}
            >
              {renderPrefixCell && renderPrefixCell(item, index, items)}
              {isExpandable && (
                <div className={cx(stylex.props(formStyles.cell)(), stylex.props(formStyles.expandCell))}>
                  <IconButton
                    tooltip={
                      isItemExpanded
                        ? t('alerting.dynamic-table.tooltip-collapse-row', 'Collapse row')
                        : t('alerting.dynamic-table.tooltip-expand-row', 'Expand row')
                    }
                    data-testid={selectors.components.AlertRules.toggle}
                    name={isItemExpanded ? 'angle-down' : 'angle-right'}
                    onClick={() => toggleExpanded(item)}
                  />
                </div>
              )}
              {cols.map((col) => (
                <div
                  className={cx(stylex.props(formStyles.cell)(col.alignColumn), stylex.props(formStyles.bodyCell), col.className)}
                  data-column={col.label}
                  key={`${item.id}-${col.id}`}
                >
                  {col.renderCell(item, index)}
                </div>
              ))}
              {isItemExpanded && renderExpandedContent && (
                <div
                  {...stylex.props(formStyles.expandedContentRow)}
                  data-testid={selectors.components.AlertRules.expandedContent}
                >
                  {renderExpandedContent(item, index, items)}
                </div>
              )}
            </div>
          );
        })}
        {footerRow && <div {...mergeStylexClassName(stylex.props(formStyles.row), stylex.props(formStyles.footerRow))}>{footerRow}</div>}
      </div>
      {pagination && (
        <Pagination
          className={cx(paginationStyles, paginationStyles)}
          currentPage={page}
          numberOfPages={numberOfPages}
          onNavigate={onPageChange}
          hideWhenSinglePage
        />
      )}
    </>
  );
};

const getStyles = <T extends unknown>(
  cols: Array<DynamicTableColumnProps<T>>,
  isExpandable: boolean,
  hasPrefixCell: boolean
) => {
  const sizes = cols.map((col) => {
    if (!col.size) {
      return 'auto';
    }

    if (typeof col.size === 'number') {
      return `${col.size}fr`;
    }

    return col.size;
  });

  if (isExpandable) {
    sizes.unshift('calc(1em + 16px)');
  }

  if (hasPrefixCell) {
    sizes.unshift('0');
  }

  return (theme: GrafanaTheme2) => ({
    container: css({
      border: `1px solid ${theme.colors.border.weak}`,
      borderRadius: theme.shape.radius.default,
      color: theme.colors.text.secondary,
    }),
    row: css({
      display: 'grid',
      gridTemplateColumns: sizes.join(' '),
      gridTemplateRows: '1fr auto',

      '&:nth-child(2n + 1)': {
        backgroundColor: theme.colors.background.secondary,
      },

      '&:nth-child(2n)': {
        backgroundColor: theme.colors.background.primary,
      },

      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: 'auto 1fr',
        gridTemplateAreas: 'left right',
        padding: `0 ${theme.spacing(0.5)}`,

        '&:first-child': {
          display: 'none',
        },

        '& > *:first-child': {
          display: hasPrefixCell ? 'none' : undefined,
        },
      },
    }),
    footerRow: css({
      display: 'flex',
      padding: theme.spacing(1),
    }),
    cell: (alignColumn?: string) =>
      css({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(1),
        justifyContent: alignColumn || 'initial',

        [theme.breakpoints.down('sm')]: {
          padding: `${theme.spacing(1)} 0`,
          gridTemplateColumns: '1fr',
        },
      }),
    bodyCell: css({
      overflow: 'hidden',

      [theme.breakpoints.down('sm')]: {
        gridColumnEnd: 'right',
        gridColumnStart: 'right',

        '&::before': {
          content: 'attr(data-column)',
          display: 'block',
          color: theme.colors.text.primary,
        },
      },
    }),
    expandCell: css({
      justifyContent: 'center',

      [theme.breakpoints.down('sm')]: {
        alignItems: 'start',
        gridArea: 'left',
      },
    }),
    expandedContentRow: css({
      gridColumnEnd: sizes.length + 1,
      gridColumnStart: hasPrefixCell ? 3 : 2,
      gridRow: 2,
      padding: `0 ${theme.spacing(3)} 0 ${theme.spacing(1)}`,
      position: 'relative',

      [theme.breakpoints.down('sm')]: {
        gridColumnStart: 2,
        borderTop: `1px solid ${theme.colors.border.strong}`,
        gridRow: 'auto',
        padding: `${theme.spacing(1)} 0 0 0`,
      },
    }),
  });
};
