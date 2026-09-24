import * as stylex from '@stylexjs/stylex';
import { useMemo } from 'react';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { spacing, typography } from '../../themes/stylex/tokens.stylex';
import { InlineList } from '../List/InlineList';
import { List } from '../List/List';

import { VizLegendListItem } from './VizLegendListItem';
import { type VizLegendBaseProps, type VizLegendItem } from './types';

export interface Props<T> extends VizLegendBaseProps<T> {}

/**
 * @internal
 */
export const VizLegendList = <T extends unknown>({
  items,
  itemRenderer,
  onLabelMouseOver,
  onLabelMouseOut,
  onLabelClick,
  placement,
  className,
  readonly,
  limit = 0,
  filterAction,
}: Props<T>) => {
  const allItemsSelected = useMemo(() => !items.some((item) => item.disabled), [items]);

  if (!itemRenderer) {
    /* eslint-disable-next-line react/display-name */
    itemRenderer = (item) => (
      <VizLegendListItem
        item={item}
        onLabelClick={onLabelClick}
        onLabelMouseOver={onLabelMouseOver}
        onLabelMouseOut={onLabelMouseOut}
        readonly={readonly}
        allItemsSelected={allItemsSelected}
      />
    );
  }

  const leftItems = useMemo(
    () => (placement === 'right' ? items : items.filter((item) => item.yAxis === 1)),
    [placement, items]
  );
  const rightItems = useMemo(
    () => (placement === 'right' ? [] : items.filter((item) => item.yAxis !== 1)),
    [placement, items]
  );

  const getItemKey = (item: VizLegendItem<T>) => `${item.getItemKey ? item.getItemKey() : item.label}`;

  switch (placement) {
    case 'right': {
      const renderItem = (item: VizLegendItem<T>, index: number) => {
        return <span {...stylex.props(styles.itemBottom, styles.itemRight)}>{itemRenderer!(item, index)}</span>;
      };

      return (
        <div {...mergeStylexProps(stylex.props(styles.rightWrapper), { className })}>
          {filterAction && <span {...stylex.props(styles.itemBottom, styles.itemRight)}>{filterAction}</span>}
          <List items={leftItems} renderItem={renderItem} getItemKey={getItemKey} limit={limit} />
        </div>
      );
    }
    case 'bottom':
    default: {
      const renderItem = (item: VizLegendItem<T>, index: number) => {
        return <span {...stylex.props(styles.itemBottom)}>{itemRenderer!(item, index)}</span>;
      };

      return (
        <div {...mergeStylexProps(stylex.props(styles.bottomWrapper), { className })}>
          {leftItems.length > 0 && (
            <div {...stylex.props(styles.section)}>
              {filterAction && <span {...stylex.props(styles.itemBottom)}>{filterAction}</span>}
              <InlineList items={leftItems} renderItem={renderItem} getItemKey={getItemKey} limit={limit} />
            </div>
          )}
          {rightItems.length > 0 && (
            <div {...stylex.props(styles.section, styles.sectionRight)}>
              {!leftItems.length && filterAction && <span {...stylex.props(styles.itemBottom)}>{filterAction}</span>}
              <InlineList items={rightItems} renderItem={renderItem} getItemKey={getItemKey} limit={limit} />
            </div>
          )}
        </div>
      );
    }
  }
};

VizLegendList.displayName = 'VizLegendList';

const styles = stylex.create({
  itemBottom: {
    paddingRight: '10px',
    display: 'flex',
    fontSize: typography['--gf-typography-body-small-font-size'],
    whiteSpace: 'nowrap',
  },
  itemRight: {
    marginBottom: spacing['--gf-spacing-x0-5'],
  },
  rightWrapper: {
    padding: spacing['--gf-spacing-x0-5'],
  },
  bottomWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    padding: spacing['--gf-spacing-x0-5'],
    rowGap: '15px',
    columnGap: '25px',
  },
  section: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  sectionRight: {
    justifyContent: 'flex-end',
    flexGrow: 1,
    flexBasis: '50%',
  },
});
