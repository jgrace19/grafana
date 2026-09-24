import * as stylex from '@stylexjs/stylex';
import { useMemo, type JSX } from 'react';

import { Trans } from '@grafana/i18n';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { Button } from '../Button/Button';

import { useLimit } from './hooks';

export interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => JSX.Element;
  getItemKey?: (item: T) => string;
  className?: string;
  limit?: number;
}

interface AbstractListProps<T> extends ListProps<T> {
  inline?: boolean;
  limit?: number;
}

/** @deprecated Use ul/li/arr.map directly instead */
// no point converting, this is deprecated
// eslint-disable-next-line react-prefer-function-component/react-prefer-function-component
export const AbstractList = <T,>({
  items,
  renderItem,
  getItemKey,
  className,
  inline,
  limit = 0,
}: AbstractListProps<T>) => {
  const [curLimit, setLimit] = useLimit(limit);

  const limitedItems = useMemo(() => (curLimit > 0 ? items.slice(0, curLimit) : items), [items, curLimit]);

  return (
    <ul {...mergeStylexProps(stylex.props(styles.list), { className })}>
      {limitedItems.map((item, i) => {
        return (
          <li {...stylex.props(styles.item, inline && styles.inlineItem)} key={getItemKey ? getItemKey(item) : i}>
            {renderItem(item, i)}
          </li>
        );
      })}
      {curLimit > 0 && items.length > curLimit && (
        <li {...stylex.props(styles.item, inline && styles.inlineItem)} key="__limit">
          <Button fill="text" variant="primary" size="sm" onClick={() => setLimit(0)}>
            <Trans i18nKey={'legend.container.show-all-series'}>...show all {{ total: items.length }} items</Trans>
          </Button>
        </li>
      )}
    </ul>
  );
};

const styles = stylex.create({
  list: {
    listStyleType: 'none',
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
  item: {
    display: 'block',
  },
  inlineItem: {
    display: 'inline-block',
  },
});
