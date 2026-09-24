import { type ReactNode, useMemo, useState } from 'react';
import * as React from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { IconButton, Pagination } from '@grafana/ui';

import { mergeStylexClassName } from '@grafana/ui/unstable';
import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';

import { usePagination } from '../hooks/usePagination';
import { paginationStyles } from '../styles/pagination.stylex';
import { dynamicTableStyles } from './DynamicTable.stylex';

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
  const gridTemplateColumns = useMemo(() => {
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
    if (renderPrefixHeader) {
      sizes.unshift('0');
    }
    return sizes.join(' ');
  }, [cols, isExpandable, renderPrefixHeader]);

  const expandedContentColumnStart = renderPrefixHeader ? 3 : 2;
  const expandedContentColumnEnd = gridTemplateColumns.split(' ').length + 1;

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
      <div {...stylex.props(dynamicTableStyles.container)} data-testid={dataTestId ?? 'dynamic-table'}>
        <div {...stylex.props(dynamicTableStyles.row)} style={{ gridTemplateColumns }} data-testid="header">
          {renderPrefixHeader && renderPrefixHeader()}
          {isExpandable && <div {...stylex.props(dynamicTableStyles.cell)} />}
          {cols.map((col) => (
            <div
              {...stylex.props(dynamicTableStyles.cell)}
              style={{ justifyContent: col.alignColumn || 'initial' }}
              key={col.id}
            >
              {col.label}
            </div>
          ))}
        </div>

        {pageItems.map((item, index) => {
          const isItemExpanded = isExpanded ? isExpanded(item) : expandedIds.includes(item.id);
          return (
            <div
              {...mergeStylexClassName(
                stylex.props(dynamicTableStyles.row, index % 2 === 0 ? dynamicTableStyles.rowOdd : dynamicTableStyles.rowEven),
                undefined
              )}
              style={{ gridTemplateColumns }}
              key={`${item.id}-${index}`}
              data-testid={testIdGenerator?.(item, index) ?? 'row'}
            >
              {renderPrefixCell && renderPrefixCell(item, index, items)}
              {isExpandable && (
                <div {...mergeStylexClassName(stylex.props(dynamicTableStyles.cell, dynamicTableStyles.expandCell), undefined)}>
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
                  {...mergeStylexClassName(
                    stylex.props(dynamicTableStyles.cell, dynamicTableStyles.bodyCell),
                    col.className
                  )}
                  style={{ justifyContent: col.alignColumn || 'initial' }}
                  data-column={col.label}
                  key={`${item.id}-${col.id}`}
                >
                  {col.renderCell(item, index)}
                </div>
              ))}
              {isItemExpanded && renderExpandedContent && (
                <div
                  {...stylex.props(dynamicTableStyles.expandedContentRow)}
                  style={{
                    gridColumnStart: expandedContentColumnStart,
                    gridColumnEnd: expandedContentColumnEnd,
                  }}
                  data-testid={selectors.components.AlertRules.expandedContent}
                >
                  {renderExpandedContent(item, index, items)}
                </div>
              )}
            </div>
          );
        })}
        {footerRow && (
          <div {...mergeStylexClassName(stylex.props(dynamicTableStyles.row, dynamicTableStyles.footerRow), undefined)}>
            {footerRow}
          </div>
        )}
      </div>
      {pagination && (
        <Pagination
          {...stylex.props(paginationStyles.root)}
          currentPage={page}
          numberOfPages={numberOfPages}
          onNavigate={onPageChange}
          hideWhenSinglePage
        />
      )}
    </>
  );
};

