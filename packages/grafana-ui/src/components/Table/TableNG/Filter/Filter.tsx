import * as stylex from '@stylexjs/stylex';
import { memo, useRef, useState } from 'react';

import { type Field, type SelectableValue } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';

import { colors, spacing } from '../../../../themes/stylex/tokens.stylex';
import { Icon } from '../../../Icon/Icon';
import { Popover } from '../../../Tooltip/Popover';
import { FilterOperator, type FilterType, type TableRow } from '../types';
import { getDisplayName } from '../utils';

import { FilterPopup } from './FilterPopup';
import { operatorSelectableValues } from './utils';

interface Props {
  name: string;
  rows: TableRow[];
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  field?: Field;
  iconXstyle?: stylex.StyleXStyles;
  parentIndex?: number;
  /** Cross-filter rows keyed by filter key. Each entry holds the rows available *before* that filter was applied.  */
  crossFilterRows: Record<string, TableRow[]>;
  /** Rows surviving all active filters. Used for brand-new (not-yet-active) filter popups. */
  crossFilterTailRows: TableRow[];
}

export const Filter = memo(
  ({ name, rows, filter, setFilter, field, iconXstyle, parentIndex, crossFilterRows, crossFilterTailRows }: Props) => {
    const filterKey = typeof parentIndex === 'number' ? `${name}-${parentIndex}` : name;
    const filterValue = filter[filterKey]?.filtered;

    const ref = useRef<HTMLButtonElement>(null);
    const [isPopoverVisible, setPopoverVisible] = useState<boolean>(false);
    const filterEnabled = Boolean(filterValue);
    const [searchFilter, setSearchFilter] = useState(filter[filterKey]?.searchFilter || '');
    const [operator, setOperator] = useState<SelectableValue<FilterOperator>>(
      filter[filterKey]?.operator ?? operatorSelectableValues()[FilterOperator.CONTAINS]
    );

    // Show options scoped to the current cross-filter state:
    // - Active filter: rows available before that filter was applied (keeps its own options visible).
    // - New filter: rows surviving all active filters (the tail).
    // - No active filters at all: fall back to raw rows.
    const rowsForPopup = filterKey in crossFilterRows ? crossFilterRows[filterKey] : crossFilterTailRows;

    return (
      <button
        {...stylex.props(styles.headerFilter)}
        ref={ref}
        type="button"
        aria-haspopup="dialog"
        aria-pressed={isPopoverVisible}
        aria-label={t('grafana-ui.table.filter.button', `Filter {{name}}`, {
          name: field ? getDisplayName(field) : '',
        })}
        data-testid={selectors.components.Panels.Visualization.TableNG.Filters.HeaderButton}
        tabIndex={0}
        onKeyDown={(ev) => {
          // can't use tabindex alone to handle this, because column sort would intercept the keypress.
          if (ev.target === ref.current && (ev.key === 'Enter' || ev.key === ' ')) {
            setPopoverVisible(true);
            ev.stopPropagation();
            ev.preventDefault();
          }
        }}
        onClick={(ev) => {
          ev.stopPropagation();
          if (!isPopoverVisible) {
            setPopoverVisible(true);
          }
        }}
      >
        <Icon name="filter" xstyle={[iconXstyle, filterEnabled && styles.filterIconEnabled]} />
        {isPopoverVisible && ref.current && (
          <Popover
            content={
              <FilterPopup
                name={name}
                rows={rowsForPopup}
                filterValue={filterValue}
                setFilter={setFilter}
                field={field}
                onClose={() => setPopoverVisible(false)}
                searchFilter={searchFilter}
                setSearchFilter={setSearchFilter}
                operator={operator}
                setOperator={setOperator}
                buttonElement={ref.current}
                parentIndex={parentIndex}
              />
            }
            placement="bottom-start"
            referenceElement={ref.current}
            show
          />
        )}
      </button>
    );
  }
);

Filter.displayName = 'Filter';

const styles = stylex.create({
  headerFilter: {
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    borderStyle: 'none',
    borderWidth: 'medium',
    borderColor: 'currentcolor',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    alignSelf: 'flex-end',
    borderRadius: spacing['--gf-spacing-x0-25'],
  },
  filterIconEnabled: {
    color: colors['--gf-colors-primary-text'],
  },
});
