import * as stylex from '@stylexjs/stylex';
import React, { useEffect, useRef } from 'react';
import { type Column, type SortDirection } from 'react-data-grid';

import { type Field } from '@grafana/data';

import { mergeStylexProps } from '../../../../themes/stylex/mergeStylexProps';
import { colors, spacing, typography } from '../../../../themes/stylex/tokens.stylex';
import { getFieldTypeIcon } from '../../../../types/icon';
import { Icon } from '../../../Icon/Icon';
import { Stack } from '../../../Layout/Stack/Stack';
import { Filter } from '../Filter/Filter';
import { type FilterType, type TableRow, type TableSummaryRow } from '../types';
import { getDisplayName } from '../utils';

interface HeaderCellProps {
  column: Column<TableRow, TableSummaryRow>;
  rows: TableRow[];
  field: Field;
  direction?: SortDirection;
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  showTypeIcons?: boolean;
  selectFirstCell: () => void;
  disableKeyboardEvents?: boolean;
  parentIndex?: number;
  crossFilterRows: Record<string, TableRow[]>;
  crossFilterTailRows: TableRow[];
}

export const HeaderCell: React.FC<HeaderCellProps> = ({
  column,
  direction,
  disableKeyboardEvents,
  field,
  filter,
  rows,
  selectFirstCell,
  setFilter,
  showTypeIcons,
  parentIndex,
  crossFilterRows,
  crossFilterTailRows,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const headerCellWrap = field.config.custom?.wrapHeaderText ?? false;
  const displayName = getDisplayName(field);
  const filterable = field.config.custom?.filterable ?? false;

  // we have to remove/reset the filter if the column is not filterable
  useEffect(() => {
    if (!filterable && filter[displayName]) {
      setFilter((filter: FilterType) => {
        const newFilter = { ...filter };
        delete newFilter[displayName];
        return newFilter;
      });
    }
  }, [filterable, displayName, filter, setFilter]);

  /* eslint-disable jsx-a11y/no-static-element-interactions */
  return (
    <Stack
      ref={ref}
      direction="row"
      gap={0.5}
      alignItems="center"
      onKeyDown={
        disableKeyboardEvents
          ? undefined
          : (ev) => {
              // unfortunately, react-data-grid's default keyboard behavior is not compatible with what we need
              // to do to make filter and sort keyboard accessible, so we have to stop the propagation of events here,
              // and add a way to "hook back in" to their behavior once you've reached the last tabbable element in the last header cell.
              ev.stopPropagation();

              if (!(ev.key === 'Tab' && !ev.shiftKey)) {
                return;
              }

              const tableTabbedElement = ev.target;
              if (!(tableTabbedElement instanceof HTMLElement)) {
                return;
              }

              const headerContent = ref.current;
              const headerCell = ref.current?.parentNode;
              const row = headerCell?.parentNode;
              const isLastElementInHeader =
                headerContent?.lastElementChild?.contains(tableTabbedElement) && headerCell === row?.lastElementChild;

              if (isLastElementInHeader) {
                selectFirstCell();
              }
            }
      }
    >
      {/* eslint-enable jsx-a11y/no-static-element-interactions */}
      {showTypeIcons && (
        <Icon xstyle={styles.headerCellIcon} name={getFieldTypeIcon(field)} title={field?.type} size="sm" />
      )}
      <button
        tabIndex={0}
        {...mergeStylexProps(
          stylex.props(styles.headerCellLabel, headerCellWrap ? styles.labelWrap : styles.labelNoWrap),
          { className: 'gf-table-ng-header-label' }
        )}
        title={displayName}
      >
        {displayName}
        {direction && (
          <Icon xstyle={styles.headerCellIcon} size="lg" name={direction === 'ASC' ? 'arrow-up' : 'arrow-down'} />
        )}
      </button>

      {filterable && (
        <Filter
          name={column.key}
          rows={rows}
          filter={filter}
          setFilter={setFilter}
          field={field}
          iconXstyle={styles.headerCellIcon}
          parentIndex={parentIndex}
          crossFilterRows={crossFilterRows}
          crossFilterTailRows={crossFilterTailRows}
        />
      )}
    </Stack>
  );
};

// `all: unset` for the label is in TableNG.css.
const styles = stylex.create({
  headerCellLabel: {
    cursor: 'pointer',
    fontWeight: typography['--gf-typography-font-weight-medium'],
    color: colors['--gf-colors-text-secondary'],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    borderRadius: spacing['--gf-spacing-x0-25'],
    lineHeight: '20px',
    textDecoration: { default: null, ':hover': 'underline' },
    '::selection': {
      backgroundColor: 'var(--rdg-background-color)',
      color: colors['--gf-colors-text-secondary'],
    },
  },
  labelWrap: {
    whiteSpace: 'pre-line',
  },
  labelNoWrap: {
    whiteSpace: 'nowrap',
  },
  headerCellIcon: {
    color: colors['--gf-colors-text-secondary'],
  },
});
