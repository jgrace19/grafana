import { type CellProps } from 'react-table';

import { TagList } from '@grafana/ui';

import { type DashboardsTreeItem } from '../types';
import './TagsCell.css';

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

  return <TagList className="gf-tags-cell-tag-list" tags={item.tags} onClick={onTagClick} />;
}
