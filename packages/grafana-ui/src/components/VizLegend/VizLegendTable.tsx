import clsx from 'clsx';

import { mergeStylexClassName } from '../../themes/stylex/mergeClassNames';
import { vizLegendTableStyleProps } from './VizLegendTable.stylex'

import { useMemo, type JSX } from 'react';

import { Trans } from '@grafana/i18n';

import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { useLimit } from '../List/hooks';

import { LegendTableItem } from './VizLegendTableItem';
import { type VizLegendItem, type VizLegendTableProps } from './types';

const nameSortKey = 'Name';
const naturalCompare = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare;

/**
 * @internal
 */
export const VizLegendTable = <T extends unknown>({
  items,
  sortBy: sortKey,
  sortDesc,
  itemRenderer,
  className,
  onToggleSort,
  onLabelClick,
  onLabelMouseOver,
  onLabelMouseOut,
  readonly,
  isSortable,
  limit = 0,
  filterAction,
}: VizLegendTableProps<T>): JSX.Element => {
  const header: Record<string, string> = {
    [nameSortKey]: '',
  };

  for (const item of items) {
    if (item.getDisplayValues) {
      for (const displayValue of item.getDisplayValues()) {
        header[displayValue.title ?? '?'] = displayValue.description ?? '';
      }
    }
  }

  if (sortKey != null) {
    let itemVals = new Map<VizLegendItem, number>();

    items.forEach((item) => {
      if (sortKey !== nameSortKey && item.getDisplayValues) {
        const stat = item.getDisplayValues().find((stat) => stat.title === sortKey);
        const val = stat == null || Number.isNaN(stat.numeric) ? -Infinity : stat.numeric;
        itemVals.set(item, val);
      }
    });

    let sortMult = sortDesc ? -1 : 1;

    if (sortKey === nameSortKey) {
      items.sort((a, b) => {
        return sortMult * naturalCompare(a.label, b.label);
      });
    } else {
      items.sort((a, b) => {
        const aVal = itemVals.get(a) ?? 0;
        const bVal = itemVals.get(b) ?? 0;

        return sortMult * (aVal - bVal);
      });
    }
  }

  const [curLimit, setLimit] = useLimit(limit);

  const limitedItems = useMemo(() => (curLimit > 0 ? items.slice(0, curLimit) : items), [items, curLimit]);

  if (!itemRenderer) {
    /* eslint-disable-next-line react/display-name */
    itemRenderer = (item, index) => (
      <LegendTableItem
        key={`${item.label}-${index}`}
        item={item}
        onLabelClick={onLabelClick}
        onLabelMouseOver={onLabelMouseOver}
        onLabelMouseOut={onLabelMouseOut}
        readonly={readonly}
      />
    );
  }

  return (
    <table {...mergeStylexClassName(vizLegendTableStyleProps('table'), className)}>
      <thead>
        <tr>
          {Object.keys(header).map((columnTitle) => (
            <th
              title={header[columnTitle]}
              key={columnTitle}
              className={clsx(
                vizLegendTableStyleProps('header').className,
                Boolean(onToggleSort) && vizLegendTableStyleProps('headerSortable').className,
                isSortable && vizLegendTableStyleProps('nameHeader').className,
                sortKey === columnTitle && vizLegendTableStyleProps('withIcon').className,
                !isSortable && 'sr-only'
              )}
              onClick={() => {
                if (onToggleSort && isSortable) {
                  onToggleSort(columnTitle);
                }
              }}
            >
              {columnTitle === nameSortKey && filterAction && (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <span {...vizLegendTableStyleProps('filterAction')} onClick={(e) => e.stopPropagation()}>
                  {filterAction}
                </span>
              )}
              {columnTitle}
              {sortKey === columnTitle && <Icon size="xs" name={sortDesc ? 'angle-down' : 'angle-up'} />}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{limitedItems.map(itemRenderer!)}</tbody>
      {curLimit > 0 && items.length > curLimit && (
        <tfoot>
          <tr>
            <td colSpan={100} style={{ textAlign: 'right' }}>
              <Button fill="text" variant="primary" size="sm" onClick={() => setLimit(0)}>
                <Trans i18nKey={'legend.container.show-all-series'}>...show all {{ total: items.length }} items</Trans>
              </Button>
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  );
};

