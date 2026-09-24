import * as stylex from '@stylexjs/stylex';
import { type CellProps } from 'react-table';

import { TagList } from '@grafana/ui';

import { type DashboardsTreeItem } from '../types';
interface TagsCellProps extends CellProps<DashboardsTreeItem, unknown> {
  onTagClick?: (tag: string) => void;
}

export function TagsCell({ row: { original: data }, onTagClick }: TagsCellProps) {
  const item = data.item;

  if (item.kind === 'ui') {
    if (item.uiKind === 'pagination-placeholder') {
      return <TagList.Skeleton />;
    } else {
      return null;
    }
  }

  if (!item.tags) {
    return null;
  }

  return <TagList xstyle={styles.tagList} tags={item.tags} onClick={onTagClick} />;
}

const styles = stylex.create({
  tagList: {
    justifyContent: 'flex-start',
    flexWrap: 'nowrap',
  },
});
