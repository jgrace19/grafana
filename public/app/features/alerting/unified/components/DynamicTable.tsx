// eslint-disable-next-line no-restricted-imports -- stylex: Pagination has no xstyle or style prop
import { css, cx } from '@emotion/css';
import * as stylex from '@stylexjs/stylex';
import { type ReactNode, useState } from 'react';
import * as React from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { IconButton, Pagination } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { usePagination } from '../hooks/usePagination';

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
  const hasPrefixCell = !!renderPrefixHeader;
  const sizes = getColumnSizes(cols, isExpandable, hasPrefixCell);

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

  const cellStyles = (alignColumn?: string) => [
    styles.cell,
    alignColumn ? styles.justifyContent(alignColumn) : styles.justifyContentInitial,
  ];
  const rowStyles = [styles.row, styles.gridTemplateColumns(sizes.join(' '))];

  return (
    <>
      <div {...stylex.props(styles.container)} data-testid={dataTestId ?? 'dynamic-table'}>
        <div {...stylex.props(rowStyles)} data-testid="header">
          {renderPrefixHeader && renderPrefixHeader()}
          {isExpandable && <div {...stylex.props(cellStyles())} />}
          {cols.map((col) => (
            <div {...stylex.props(cellStyles(col.alignColumn))} key={col.id}>
              {col.label}
            </div>
          ))}
        </div>

        {pageItems.map((item, index) => {
          const isItemExpanded = isExpanded ? isExpanded(item) : expandedIds.includes(item.id);
          return (
            <div
              {...stylex.props(rowStyles)}
              key={`${item.id}-${index}`}
              data-testid={testIdGenerator?.(item, index) ?? 'row'}
            >
              {renderPrefixCell && renderPrefixCell(item, index, items)}
              {isExpandable && (
                <div {...stylex.props(cellStyles(), styles.expandCell)}>
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
                  {...mergeStylexProps(stylex.props(cellStyles(col.alignColumn), styles.bodyCell), {
                    className: col.className,
                  })}
                  data-column={col.label}
                  key={`${item.id}-${col.id}`}
                >
                  {col.renderCell(item, index)}
                </div>
              ))}
              {isItemExpanded && renderExpandedContent && (
                <div
                  {...stylex.props(
                    styles.expandedContentRow,
                    styles.expandedContentColumns(hasPrefixCell ? '3' : '2', String(sizes.length + 1))
                  )}
                  data-testid={selectors.components.AlertRules.expandedContent}
                >
                  {renderExpandedContent(item, index, items)}
                </div>
              )}
            </div>
          );
        })}
        {footerRow && <div {...stylex.props(rowStyles, styles.footerRow)}>{footerRow}</div>}
      </div>
      {pagination && (
        <Pagination
          className={cx(pendingEmotionStyles.pagination, paginationStyles)}
          currentPage={page}
          numberOfPages={numberOfPages}
          onNavigate={onPageChange}
          hideWhenSinglePage
        />
      )}
    </>
  );
};

function getColumnSizes<T>(cols: Array<DynamicTableColumnProps<T>>, isExpandable: boolean, hasPrefixCell: boolean) {
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

  return sizes;
}

// stylex: Pagination has no xstyle or style prop, and only an unlayered class beats its float.
const pendingEmotionStyles = {
  pagination: css({
    float: 'none',
    display: 'flex',
    justifyContent: 'flex-start',
    margin: `${spacing['--gf-spacing-x2']} 0`,
  }),
};

const styles = stylex.create({
  container: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    borderRadius: shape['--gf-shape-radius-default'],
    color: colors['--gf-colors-text-secondary'],
  },
  // On small screens DynamicTableWithGuidelines hides its prefix cell (the first child of every row) itself.
  row: {
    display: {
      default: 'grid',
      ':first-child': {
        default: null,
        [bp.smDown]: 'none',
      },
    },
    gridTemplateRows: '1fr auto',
    gridTemplateAreas: {
      default: null,
      [bp.smDown]: 'left right',
    },
    backgroundColor: {
      default: null,
      ':nth-child(2n + 1)': colors['--gf-colors-background-secondary'],
      ':nth-child(2n)': colors['--gf-colors-background-primary'],
    },
    paddingTop: { default: null, [bp.smDown]: 0 },
    paddingRight: { default: null, [bp.smDown]: spacing['--gf-spacing-x0-5'] },
    paddingBottom: { default: null, [bp.smDown]: 0 },
    paddingLeft: { default: null, [bp.smDown]: spacing['--gf-spacing-x0-5'] },
  },
  gridTemplateColumns: (columns: string) => ({
    gridTemplateColumns: {
      default: columns,
      [bp.smDown]: 'auto 1fr',
    },
  }),
  // Keeps `row`'s small-screen padding, which this namespace would otherwise replace.
  footerRow: {
    display: 'flex',
    paddingTop: { default: spacing['--gf-spacing-x1'], [bp.smDown]: 0 },
    paddingRight: { default: spacing['--gf-spacing-x1'], [bp.smDown]: spacing['--gf-spacing-x0-5'] },
    paddingBottom: { default: spacing['--gf-spacing-x1'], [bp.smDown]: 0 },
    paddingLeft: { default: spacing['--gf-spacing-x1'], [bp.smDown]: spacing['--gf-spacing-x0-5'] },
  },
  cell: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: { default: spacing['--gf-spacing-x1'], [bp.smDown]: 0 },
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: { default: spacing['--gf-spacing-x1'], [bp.smDown]: 0 },
    gridTemplateColumns: { default: null, [bp.smDown]: '1fr' },
  },
  justifyContentInitial: {
    justifyContent: 'initial',
  },
  justifyContent: (justifyContent: string) => ({
    justifyContent,
  }),
  bodyCell: {
    overflow: 'hidden',
    gridColumnEnd: { default: null, [bp.smDown]: 'right' },
    gridColumnStart: { default: null, [bp.smDown]: 'right' },
    '::before': {
      content: { default: null, [bp.smDown]: 'attr(data-column)' },
      display: { default: null, [bp.smDown]: 'block' },
      color: { default: null, [bp.smDown]: colors['--gf-colors-text-primary'] },
    },
  },
  expandCell: {
    justifyContent: 'center',
    alignItems: { default: 'center', [bp.smDown]: 'start' },
    gridArea: { default: null, [bp.smDown]: 'left' },
  },
  expandedContentRow: {
    gridRow: { default: 2, [bp.smDown]: 'auto' },
    paddingTop: { default: 0, [bp.smDown]: spacing['--gf-spacing-x1'] },
    paddingRight: { default: spacing['--gf-spacing-x3'], [bp.smDown]: 0 },
    paddingBottom: 0,
    paddingLeft: { default: spacing['--gf-spacing-x1'], [bp.smDown]: 0 },
    position: 'relative',
    borderTopWidth: { default: null, [bp.smDown]: '1px' },
    borderTopStyle: { default: null, [bp.smDown]: 'solid' },
    borderTopColor: { default: null, [bp.smDown]: colors['--gf-colors-border-strong'] },
  },
  expandedContentColumns: (columnStart: string, columnEnd: string) => ({
    gridColumnStart: { default: columnStart, [bp.smDown]: '2' },
    gridColumnEnd: columnEnd,
  }),
});
